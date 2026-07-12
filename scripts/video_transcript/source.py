"""URL host → source kind."""

from __future__ import annotations

from urllib.parse import urlparse

from scripts.video_transcript.models import SourceKind, TranscriptError


def detect_source(url: str) -> SourceKind | TranscriptError:
    """Classify URL host. Empty / non-http(s) / non-URL → INVALID_URL."""
    raw = (url or "").strip()
    if not raw:
        return TranscriptError(code="INVALID_URL", message="URL is empty")

    has_scheme = "://" in raw
    parsed = urlparse(raw if has_scheme else f"https://{raw}")
    if parsed.scheme not in ("http", "https"):
        return TranscriptError(
            code="INVALID_URL",
            message=f"Unsupported URL scheme: {parsed.scheme or '(none)'}",
        )

    host = (parsed.hostname or "").lower()
    if not host:
        return TranscriptError(code="INVALID_URL", message="URL has no host")

    # Bare strings like "not-a-url" become https://not-a-url — reject.
    if not has_scheme and "." not in host:
        return TranscriptError(
            code="INVALID_URL",
            message="Not a valid URL",
        )

    if host in (
        "youtube.com",
        "www.youtube.com",
        "m.youtube.com",
        "music.youtube.com",
        "youtu.be",
    ):
        return "youtube"
    if host in ("twitter.com", "www.twitter.com", "x.com", "www.x.com"):
        return "twitter"

    return TranscriptError(
        code="UNSUPPORTED_SOURCE",
        message=f"Unsupported host: {host}",
    )
