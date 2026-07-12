"""Fetch existing YouTube captions into TranscriptResult (no translation)."""

from __future__ import annotations

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    CouldNotRetrieveTranscript,
    InvalidVideoId,
    NoTranscriptFound,
    TranscriptsDisabled,
    VideoUnavailable,
    YouTubeTranscriptApiException,
)

from scripts.video_transcript.models import (
    TranscriptError,
    TranscriptResult,
    TranscriptSegment,
)
from scripts.video_transcript.youtube_url import extract_youtube_video_id

# Prefer common spoken languages; library still falls back via list()/find_*.
_LANGUAGE_PREFERENCE = (
    "en",
    "en-US",
    "en-GB",
    "ja",
    "ja-JP",
)


def _format_ts(seconds: float) -> str:
    total = max(0, int(seconds))
    h, rem = divmod(total, 3600)
    m, s = divmod(rem, 60)
    if h:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"


def _snippets_to_segments(snippets: list) -> list[TranscriptSegment]:
    segments: list[TranscriptSegment] = []
    for snip in snippets:
        start = float(getattr(snip, "start", 0.0))
        duration = float(getattr(snip, "duration", 0.0))
        text = str(getattr(snip, "text", "")).replace("\n", " ").strip()
        if not text:
            continue
        segments.append(
            TranscriptSegment(
                start=_format_ts(start),
                end=_format_ts(start + duration),
                text=text,
                text_ja=None,
            )
        )
    return segments


def fetch_youtube_captions(url: str) -> TranscriptResult | TranscriptError:
    """Load captions for a public YouTube URL (manual preferred, else auto)."""
    video_id = extract_youtube_video_id(url)
    if isinstance(video_id, TranscriptError):
        return video_id

    api = YouTubeTranscriptApi()
    try:
        transcript_list = api.list(video_id)
        fetched = None
        try:
            fetched = transcript_list.find_manually_created_transcript(
                list(_LANGUAGE_PREFERENCE)
            ).fetch()
        except NoTranscriptFound:
            try:
                fetched = transcript_list.find_generated_transcript(
                    list(_LANGUAGE_PREFERENCE)
                ).fetch()
            except NoTranscriptFound:
                # Any available track (manual first via iteration order of find_transcript).
                try:
                    fetched = transcript_list.find_transcript(
                        list(_LANGUAGE_PREFERENCE)
                    ).fetch()
                except NoTranscriptFound:
                    # Last resort: first listed transcript regardless of language.
                    first = next(iter(transcript_list), None)
                    if first is None:
                        return TranscriptError(
                            code="NO_CAPTIONS",
                            message=f"No captions available for video {video_id}",
                        )
                    fetched = first.fetch()

        snippets = list(fetched)
        segments = _snippets_to_segments(snippets)
        transcript = " ".join(seg.text for seg in segments).strip()
        if not transcript:
            return TranscriptError(
                code="NO_CAPTIONS",
                message=f"Captions empty for video {video_id}",
            )

        return TranscriptResult(
            source="youtube",
            source_url=url.strip(),
            transcript=transcript,
            translation_ja="",
            segments=segments,
            warnings=[],
        )
    except InvalidVideoId as exc:
        return TranscriptError(code="INVALID_URL", message=str(exc))
    except (TranscriptsDisabled, NoTranscriptFound) as exc:
        return TranscriptError(code="NO_CAPTIONS", message=str(exc))
    except VideoUnavailable as exc:
        return TranscriptError(code="NO_CAPTIONS", message=str(exc))
    except CouldNotRetrieveTranscript as exc:
        return TranscriptError(code="NO_CAPTIONS", message=str(exc))
    except YouTubeTranscriptApiException as exc:
        return TranscriptError(code="NO_CAPTIONS", message=str(exc))
