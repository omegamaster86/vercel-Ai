# Phase 4 — CLI entrypoint

Back-link: [overview.md](./overview.md)

## Goal

Phase 2–3 を 1 本の CLI に結合し、README どおりに「URL を渡す → JSON（または plain）で原文＋和訳」が再現できるようにする。ここまでが現行 Done。

## Changes

| 対象 | what / why |
|------|------------|
| `main.py` / `__main__.py` | `python -m` またはスクリプト入口。引数: URL、`--plain`、終了コード |
| README 完成 | インストール、使い方、制限（字幕必須・公開 YouTube・課金なし） |
| ソース分岐 | Twitter/X URL は `NOT_IMPLEMENTED` を JSON で返し非ゼロ終了 |

新規の取得・翻訳ロジックは追加しない。配線と UX のみ。

## Data structures

- CLI 成功: stdout に `TranscriptResult` JSON（`--plain` 時は原文/和訳のテキスト）
- CLI 失敗: stdout または stderr に `TranscriptError` JSON、exit code ≠ 0

## Verification

**Static**

- `python -m compileall scripts/video_transcript`
- README のコマンドが実パスと一致

**Runtime（matching surface = CLI）**

1. 字幕あり公開 YouTube URL で成功 JSON（`transcript` / `translation_ja` 非空）
2. 不正 URL で `INVALID_URL`・非ゼロ終了
3. `x.com` / `twitter.com` リンクで `NOT_IMPLEMENTED`
4. 同一 URL を 2 回実行して成功形が再現できる（idempotent な利用感）

完了宣言前に `/verify-done`（Tier C: CLI 手動 verify のログを残す）。
