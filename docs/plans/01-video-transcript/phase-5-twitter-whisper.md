# Phase 5 — Twitter / X (deferred)

Back-link: [overview.md](./overview.md)

## Status

**Deferred.** Phase 1–4 完了後、ユーザーが Twitter 対応を明示したときだけ着手する。

## Goal

Twitter/X の動画リンクから音声を取り、ローカル文字起こし → 日本語訳し、同じ `TranscriptResult` 契約で返す。

## Changes（着手時）

| 対象 | what / why |
|------|------------|
| ダウンローダ統合 | `yt-dlp` 等で動画/音声取得（字幕非依存） |
| ローカル STT | Whisper（または同等のローカルモデル）で文字起こし |
| 既存翻訳モジュール再利用 | Phase 3 の翻訳を流用 |
| CLI 分岐 | `source="twitter"` で成功パスを有効化 |

## Data structures

- 既存契約を維持。新規 error code が必要なら `DOWNLOAD_FAILED` / `TRANSCRIBE_FAILED` を契約に追加してから実装

## Constraints（再掲）

- 有料クラウド STT は使わない（ローカル優先）
- マシン負荷・モデルサイズを README に明記
- X の利用規約・レート制限は実装者責任で確認

## Verification

着手時に [testing.md](./testing.md) へ Twitter ケースを追加する。

**Runtime（予定）**

- 短い公開メディア付きポスト 1 本で `transcript` / `translation_ja` 非空
- 動画なしポストで構造化エラー
