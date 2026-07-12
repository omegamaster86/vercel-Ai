"""Shared I/O contract for video transcript pipelines.

YouTube (Phase 2–4) and Twitter/X (Phase 5) must emit the same shapes.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

SourceKind = Literal["youtube", "twitter"]

ErrorCode = Literal[
    "INVALID_URL",
    "UNSUPPORTED_SOURCE",
    "NO_CAPTIONS",
    "TRANSLATE_FAILED",
    "NOT_IMPLEMENTED",
]


@dataclass(frozen=True)
class TranscriptRequest:
    url: str


@dataclass(frozen=True)
class TranscriptSegment:
    start: str
    end: str
    text: str
    text_ja: str | None = None


@dataclass
class TranscriptResult:
    source: SourceKind
    source_url: str
    transcript: str
    translation_ja: str
    segments: list[TranscriptSegment] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class TranscriptError:
    code: ErrorCode
    message: str
