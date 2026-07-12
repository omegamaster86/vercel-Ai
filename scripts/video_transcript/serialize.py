"""Serialize contract dataclasses to JSON-ready dicts."""

from __future__ import annotations

from dataclasses import asdict

from scripts.video_transcript.models import TranscriptError, TranscriptResult


def result_to_dict(result: TranscriptResult) -> dict:
    return asdict(result)


def error_to_dict(error: TranscriptError) -> dict:
    return asdict(error)
