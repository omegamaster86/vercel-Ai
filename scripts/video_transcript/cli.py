"""CLI: URL → transcript + Japanese translation."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from scripts.video_transcript.models import (
    TranscriptError,
    TranscriptRequest,
    TranscriptResult,
)
from scripts.video_transcript.pipeline import fetch_transcript
from scripts.video_transcript.serialize import error_to_dict, result_to_dict


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="video_transcript",
        description=(
            "Fetch public YouTube captions and translate to Japanese. "
            "No paid AI APIs."
        ),
    )
    parser.add_argument("url", help="Video URL (YouTube; Twitter/X → NOT_IMPLEMENTED)")
    parser.add_argument(
        "--plain",
        action="store_true",
        help="Print human-readable transcript / translation instead of JSON",
    )
    parser.add_argument(
        "-o",
        "--output",
        metavar="PATH",
        help="Write stdout payload to PATH as well",
    )
    parser.add_argument(
        "--no-translate",
        action="store_true",
        help="Skip Japanese translation (captions only)",
    )
    return parser


def _format_plain(result: TranscriptResult) -> str:
    lines = [
        f"source: {result.source}",
        f"url: {result.source_url}",
        "",
        "=== transcript ===",
        result.transcript,
        "",
        "=== translation_ja ===",
        result.translation_ja or "(empty)",
    ]
    if result.warnings:
        lines.extend(["", "=== warnings ===", *result.warnings])
    return "\n".join(lines) + "\n"


def _format_payload(
    value: TranscriptResult | TranscriptError,
    *,
    plain: bool,
) -> str:
    if isinstance(value, TranscriptError):
        return json.dumps(error_to_dict(value), ensure_ascii=False, indent=2) + "\n"
    if plain:
        return _format_plain(value)
    return json.dumps(result_to_dict(value), ensure_ascii=False, indent=2) + "\n"


def main(argv: list[str] | None = None) -> int:
    args = _build_parser().parse_args(argv)
    outcome = fetch_transcript(
        TranscriptRequest(url=args.url),
        translate=not args.no_translate,
    )
    payload = _format_payload(outcome, plain=args.plain)

    # Errors go to stderr as JSON (or plain message body still JSON for machine use).
    stream = sys.stdout if isinstance(outcome, TranscriptResult) else sys.stderr
    stream.write(payload)
    stream.flush()

    if args.output:
        Path(args.output).write_text(payload, encoding="utf-8")

    return 0 if isinstance(outcome, TranscriptResult) else 1


if __name__ == "__main__":
    raise SystemExit(main())
