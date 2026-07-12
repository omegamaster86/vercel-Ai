"""YouTube URL → video id parsing."""

from __future__ import annotations

import re
from urllib.parse import parse_qs, urlparse

from scripts.video_transcript.models import TranscriptError

_VIDEO_ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")


def extract_youtube_video_id(url: str) -> str | TranscriptError:
    """Extract an 11-char YouTube video id from common URL shapes.

    Supports watch?v=, youtu.be/, /embed/, /shorts/, /live/.
    """
    raw = (url or "").strip()
    if not raw:
        return TranscriptError(code="INVALID_URL", message="URL is empty")

    parsed = urlparse(raw if "://" in raw else f"https://{raw}")
    if parsed.scheme not in ("http", "https"):
        return TranscriptError(
            code="INVALID_URL",
            message=f"Unsupported URL scheme: {parsed.scheme or '(none)'}",
        )

    host = (parsed.hostname or "").lower()
    if host not in (
        "youtube.com",
        "www.youtube.com",
        "m.youtube.com",
        "music.youtube.com",
        "youtu.be",
    ):
        return TranscriptError(
            code="INVALID_URL",
            message=f"Not a YouTube URL host: {host or '(none)'}",
        )

    path = parsed.path or ""
    video_id: str | None = None

    if host == "youtu.be":
        # https://youtu.be/<id>
        segment = path.strip("/").split("/", 1)[0]
        video_id = segment or None
    else:
        qs = parse_qs(parsed.query)
        if "v" in qs and qs["v"]:
            video_id = qs["v"][0]
        else:
            parts = [p for p in path.split("/") if p]
            # /embed/<id>, /shorts/<id>, /live/<id>, /v/<id>
            if len(parts) >= 2 and parts[0] in ("embed", "shorts", "live", "v"):
                video_id = parts[1]

    if not video_id or not _VIDEO_ID_RE.fullmatch(video_id):
        return TranscriptError(
            code="INVALID_URL",
            message="Could not extract a valid YouTube video id",
        )

    return video_id
