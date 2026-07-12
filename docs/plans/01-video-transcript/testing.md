# Testing — 01 Video Transcript

Back-link: [overview.md](./overview.md)

## 方針

- 各 phase の Verification をその phase の完了ゲートにする
- ユニットテストは任意。あっても **CLI runtime の代替にはしない**（`/verify-done`）
- `control-cli` 未導入のため、CLI 検証は手動 + コマンドログ

## 環境

```bash
cd scripts/video_transcript
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Static（毎 phase）

```bash
python -m compileall scripts/video_transcript
```

## Runtime マトリクス（Phase 4 Done）

| # | 入力 | 期待 |
|---|------|------|
| 1 | 字幕あり公開 YouTube URL | exit 0、`transcript` と `translation_ja` が非空 |
| 2 | 不正文字列 / 非 URL | `INVALID_URL`、exit ≠ 0 |
| 3 | 字幕なし（または無効）YouTube | `NO_CAPTIONS`、exit ≠ 0 |
| 4 | `https://x.com/...` または `twitter.com` | `NOT_IMPLEMENTED`、exit ≠ 0 |
| 5 | ケース 1 を再実行 | 同様に成功（利用上の冪等） |

ケース 3 の実動画が用意できない場合: Phase 2 で取得レイヤを stub したテストで代替し、Phase 4 README に「字幕なしは `NO_CAPTIONS`」と明記。

## Phase 5 追加（着手後）

| # | 入力 | 期待 |
|---|------|------|
| 6 | 動画付き公開 X ポスト | exit 0、原文＋和訳 |
| 7 | 動画なしポスト | 構造化エラー |

## 完了記録

Phase 4 完了時、実行したコマンド・使用 URL（公開のもの）・exit code を PR または作業メモに残す。秘密情報は載せない。
