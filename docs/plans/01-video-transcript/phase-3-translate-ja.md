# Phase 3 — Translate to Japanese

Back-link: [overview.md](./overview.md)

## Goal

Phase 2 で得た原文を日本語に翻訳し、`translation_ja` と（あれば）`segments[].text_ja` を埋める。有料 API は使わない。

## Changes

| 対象 | what / why |
|------|------------|
| 翻訳モジュール | 原文 → 日本語。長文はチャンク分割して順に翻訳（レート制限耐性） |
| 結果マージ | `TranscriptResult` に和訳を書き戻す |
| 失敗ハンドリング | 翻訳失敗時は `TRANSLATE_FAILED`、または原文維持 + `warnings`（overview デフォルト: 警告付き原文維持でも可。実装時に一方に固定） |

Whisper・音声ダウンロードは入れない。

## Data structures

- 入力: 字幕付き `TranscriptResult`（または `transcript: str`）
- 出力: `translation_ja` が非空の `TranscriptResult`、または `TranscriptError` / warnings

依存候補: `deep-translator`（無料 Google 経由）。不通時の挙動は overview の Open decisions に従う。

## Verification

**Static**

- `python -m compileall scripts/video_transcript`

**Runtime**

- 短い英語（または非日本語）字幕サンプルで `translation_ja` が日本語を含む
- 空文字列入力でクラッシュしない
- ネットワーク不通をシミュレートした場合、採用した失敗ポリシーどおり（エラー or warning）
- matching surface: 翻訳関数。CLI は Phase 4
