# Phase 2 — YouTube captions

Back-link: [overview.md](./overview.md)

## Goal

公開 YouTube URL から字幕テキスト（と可能ならセグメント）を取得し、契約の `transcript` / `segments`（`text_ja` は空で可）を埋める。

## Changes

| 対象 | what / why |
|------|------------|
| URL パースモジュール | `youtube.com` / `youtu.be` から video id 抽出。不正は `INVALID_URL` |
| 字幕取得モジュール | 既存字幕（手動優先、なければ自動）を取得。なしは `NO_CAPTIONS` |
| ソース判定 | YouTube 以外は Phase 2 では成功させない（Twitter は `NOT_IMPLEMENTED`） |

翻訳は行わない。取得のみを verify 可能にする。

## Data structures

- 入力: `TranscriptRequest`
- 成功時: `TranscriptResult`（`translation_ja=""`、`segments[].text_ja=None` 可）
- 失敗時: `TranscriptError`（`NO_CAPTIONS` / `INVALID_URL` / `UNSUPPORTED_SOURCE`）

依存候補: `youtube-transcript-api`（overview の案 B）。

## Verification

**Static**

- `python -m compileall scripts/video_transcript`

**Runtime（CLI 未完成なら関数直呼び）**

- 字幕ありの公開 YouTube 1 本で `transcript` が非空
- 明らかな不正 URL で `INVALID_URL`
- 字幕無効が確認できる動画、またはモックで `NO_CAPTIONS`（実動画が用意できない場合はユニットで stub）
- matching surface: ライブラリ関数 / 暫定スクリプト。最終 CLI は Phase 4
