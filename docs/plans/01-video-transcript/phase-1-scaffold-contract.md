# Phase 1 — Scaffold & Contract

Back-link: [overview.md](./overview.md)

## Goal

実装本体の前に、出力契約・パッケージ骨格・依存一覧を固定する。以降の phase はこの契約に対して埋めるだけにする。

## Changes

| 対象 | what / why |
|------|------------|
| `scripts/video_transcript/` | Python パッケージ置き場を新設（Next.js `app/` と分離） |
| `scripts/video_transcript/models.py`（または同等） | 入出力・エラーの契約型を定義 |
| `scripts/video_transcript/requirements.txt` | 字幕・翻訳の最小依存を宣言 |
| `scripts/video_transcript/README.md`（骨格） | 目的・インストール・未完成である旨 |

コード snip なし。ロジック（取得・翻訳・CLI）は書かないか、`NotImplementedError` / stub に留める。

## Data structures

- `TranscriptRequest`: `{ url: str }`
- `TranscriptSegment`: `{ start: str, end: str, text: str, text_ja: str | None }`
- `TranscriptResult`: `{ source: "youtube" \| "twitter", source_url: str, transcript: str, translation_ja: str, segments: list[TranscriptSegment], warnings: list[str] }`
- `TranscriptError`: `{ code: "INVALID_URL" \| "UNSUPPORTED_SOURCE" \| "NO_CAPTIONS" \| "TRANSLATE_FAILED" \| "NOT_IMPLEMENTED", message: str }`

`source` は URL ホストから判定。Twitter 分岐は `NOT_IMPLEMENTED` を返せるところまで（本体は Phase 5）。

## Verification

**Static**

- `python -m compileall scripts/video_transcript`
- 契約フィールド名が overview の Done 定義と一致することを目視

**Runtime**

- まだ CLI 完成前のため、import できることのみ: `python -c "from scripts.video_transcript... import ..."`（実際の import パスは配置に合わせる）
- matching surface: n/a（機能未接続）
