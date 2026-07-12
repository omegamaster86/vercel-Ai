"""Request → captions → Japanese translation (or structured error)."""

from __future__ import annotations

from scripts.video_transcript.captions import fetch_youtube_captions
from scripts.video_transcript.models import (
    TranscriptError,
    TranscriptRequest,
    TranscriptResult,
)
from scripts.video_transcript.source import detect_source
from scripts.video_transcript.translate import translate_result


def fetch_transcript(
    request: TranscriptRequest,
    *,
    translate: bool = True,
) -> TranscriptResult | TranscriptError:
    """Resolve source, fetch captions, optionally translate to Japanese."""
    kind = detect_source(request.url)
    if isinstance(kind, TranscriptError):
        return kind

    if kind == "twitter":
        return TranscriptError(
            code="NOT_IMPLEMENTED",
            message="Twitter/X transcript is not implemented (deferred to Phase 5)",
        )

    if kind != "youtube":
        return TranscriptError(
            code="UNSUPPORTED_SOURCE",
            message=f"Unsupported source: {kind}",
        )

    fetched = fetch_youtube_captions(request.url)
    if isinstance(fetched, TranscriptError):
        return fetched

    if not translate:
        return fetched

    return translate_result(fetched)
