"""Translate transcript text to Japanese via deep-translator (free Google).

On failure: keep original transcript and append a warning (overview default).
"""

from __future__ import annotations

import time
from dataclasses import replace

from deep_translator import GoogleTranslator
from deep_translator.exceptions import (
    NotValidPayload,
    RequestError,
    TooManyRequests,
    TranslationNotFound,
)

from scripts.video_transcript.models import TranscriptResult, TranscriptSegment

_CHUNK_SIZE = 4500
_CHUNK_PAUSE_SEC = 0.35
_SEG_SEP = "\n⟦S⟧\n"


def _chunk_text(text: str, size: int = _CHUNK_SIZE) -> list[str]:
    text = text.strip()
    if not text:
        return []
    if len(text) <= size:
        return [text]

    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = min(start + size, len(text))
        if end < len(text):
            split_at = text.rfind(" ", start, end)
            if split_at > start + size // 2:
                end = split_at
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start = end if end > start else start + size
    return chunks


def _translate_chunks(chunks: list[str]) -> tuple[list[str], list[str]]:
    """Translate chunks in order. On hard failure, append originals for the rest."""
    if not chunks:
        return [], []

    translator = GoogleTranslator(source="auto", target="ja")
    parts: list[str] = []
    warnings: list[str] = []

    for i, chunk in enumerate(chunks):
        if i:
            time.sleep(_CHUNK_PAUSE_SEC)
        try:
            translated = translator.translate(chunk)
            if not translated:
                warnings.append(
                    "Translation returned empty for a chunk; kept original chunk"
                )
                parts.append(chunk)
            else:
                parts.append(translated)
        except (
            RequestError,
            TooManyRequests,
            TranslationNotFound,
            NotValidPayload,
            ConnectionError,
            TimeoutError,
            OSError,
        ) as exc:
            warnings.append(f"Translation failed ({type(exc).__name__}): {exc}")
            parts.extend(chunks[i:])
            break
        except Exception as exc:  # noqa: BLE001 — free endpoint can raise odd types
            warnings.append(f"Translation failed ({type(exc).__name__}): {exc}")
            parts.extend(chunks[i:])
            break

    return parts, warnings


def translate_text_to_ja(text: str) -> tuple[str, list[str]]:
    """Return (translated_or_original, warnings). Empty input → ("", [])."""
    raw = (text or "").strip()
    if not raw:
        return "", []

    parts, warnings = _translate_chunks(_chunk_text(raw))
    return " ".join(parts).strip(), warnings


def _translate_segments(
    segments: list[TranscriptSegment],
) -> tuple[list[TranscriptSegment], list[str]]:
    if not segments:
        return [], []

    warnings: list[str] = []
    texts = [seg.text for seg in segments]
    batches: list[tuple[int, int]] = []
    start = 0
    while start < len(texts):
        end = start
        size = 0
        while end < len(texts):
            piece = len(texts[end]) + len(_SEG_SEP)
            if end > start and size + piece > _CHUNK_SIZE:
                break
            size += piece
            end += 1
        if end == start:
            end = start + 1
        batches.append((start, end))
        start = end

    ja_texts: list[str | None] = [None] * len(segments)
    for bi, (a, b) in enumerate(batches):
        if bi:
            time.sleep(_CHUNK_PAUSE_SEC)
        blob = _SEG_SEP.join(texts[a:b])
        translated, batch_warnings = translate_text_to_ja(blob)
        warnings.extend(batch_warnings)
        if not translated:
            continue
        parts = translated.split(_SEG_SEP)
        if len(parts) != (b - a):
            warnings.append(
                f"Segment batch {a}:{b} split mismatch "
                f"(got {len(parts)}, expected {b - a}); skipped segment JA"
            )
            continue
        for i, part in enumerate(parts):
            ja_texts[a + i] = part.strip() or None

    out = [replace(seg, text_ja=ja_texts[i]) for i, seg in enumerate(segments)]
    return out, warnings


def translate_result(result: TranscriptResult) -> TranscriptResult:
    """Fill translation_ja and segments[].text_ja. Network failures → warnings."""
    translation_ja, warnings = translate_text_to_ja(result.transcript)
    new_segments, seg_warnings = _translate_segments(result.segments)
    all_warnings = list(result.warnings) + warnings + seg_warnings

    if not translation_ja and result.transcript.strip():
        if not any("Translation failed" in w for w in all_warnings):
            all_warnings.append(
                "translation_ja is empty; original transcript preserved"
            )

    return TranscriptResult(
        source=result.source,
        source_url=result.source_url,
        transcript=result.transcript,
        translation_ja=translation_ja,
        segments=new_segments,
        warnings=all_warnings,
    )
