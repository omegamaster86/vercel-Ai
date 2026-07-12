# video_transcript

公開 YouTube URL から字幕を取得し、日本語訳を出す **ローカル Python CLI**。

> **Status:** Phase 1–4 Done（取得 + 和訳 + CLI）。Twitter/X は Phase 5 deferred（`NOT_IMPLEMENTED`）。

## 目的

- 公開 YouTube: 既存字幕 → 原文 + 日本語訳
- Twitter/X: 未実装（`NOT_IMPLEMENTED`）
- 有料 AI / 翻訳 API は使わない（`youtube-transcript-api` + `deep-translator`）

## セットアップ（初回のみ）

```bash
cd scripts/video_transcript
python3.12 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## 使い方

### 毎回の前提

コマンドは **リポジトリルート** で実行し、venv を有効化する。

```bash
cd ~/Desktop/cursor/vercel-Ai
source scripts/video_transcript/.venv/bin/activate
```

### 基本コマンド

```bash
# JSON（デフォルト）— 原文 + 日本語訳
python -m scripts.video_transcript 'https://www.youtube.com/watch?v=VIDEO_ID'

# 人間が読みやすいテキスト（これが1番良い）
python -m scripts.video_transcript --plain 'https://youtu.be/VIDEO_ID'

# ファイルにも保存する（**どちらか一方**を実行。2行は別例）:

`-o` のパスは相対なら **いまのカレントディレクトリ** 基準。リポジトリルートで実行していれば、その直下に `out.json` / `out.txt` ができる。絶対パスも可（例: `~/Desktop/out.json`）。

```bash
python -m scripts.video_transcript -o out.json 'https://youtu.be/VIDEO_ID'
python -m scripts.video_transcript --plain -o out.txt 'https://youtu.be/VIDEO_ID'
```

# 翻訳スキップ（字幕のみ）
python -m scripts.video_transcript --no-translate 'https://youtu.be/VIDEO_ID'
```

### オプション一覧

| オプション | 説明 |
|------------|------|
| `url`（必須） | YouTube URL（`youtube.com` / `youtu.be`） |
| `--plain` | JSON ではなく原文・和訳のテキストを出力 |
| `-o PATH` / `--output PATH` | 同じ内容をファイルにも書き出す |
| `--no-translate` | 日本語翻訳を行わない（字幕取得のみ） |

### 終了コードと出力先

| 結果 | exit | 出力 |
|------|------|------|
| 成功 | `0` | **stdout** に `TranscriptResult`（JSON または `--plain` テキスト） |
| 失敗 | `≠ 0` | **stderr** に `TranscriptError` JSON |

例（失敗）:

```json
{
  "code": "INVALID_URL",
  "message": "Not a valid URL"
}
```

よくある `code`:

| code | 意味 |
|------|------|
| `INVALID_URL` | URL 不正・video id 抽出失敗 |
| `UNSUPPORTED_SOURCE` | YouTube / Twitter 以外のホスト |
| `NO_CAPTIONS` | 字幕なし・取得不可 |
| `NOT_IMPLEMENTED` | Twitter/X（未実装） |
| `TRANSLATE_FAILED` | 契約上予約（現行は不通時に原文維持 + `warnings`） |

### 成功時の主なフィールド（JSON）

| フィールド | 内容 |
|------------|------|
| `transcript` | 原文（字幕テキスト） |
| `translation_ja` | 日本語訳 |
| `segments` | 時刻付きセグメント（`start` / `end` / `text` / `text_ja`） |
| `warnings` | 翻訳不通など非致命の警告 |
| `source` | `"youtube"` |
| `source_url` | 入力した URL |

### 実行例

```bash
python -m scripts.video_transcript --plain \
  'https://www.youtube.com/watch?v=jNQXAC9IVRw'
```

出力イメージ:

```text
source: youtube
url: https://www.youtube.com/watch?v=jNQXAC9IVRw

=== transcript ===
All right, so here we are, ...

=== translation_ja ===
さて、ここに来ました、...
```

## 制限

- 公開 YouTube の **既存字幕**（手動 / 自動）が必要。音声からの文字起こしはしない
- 非公開・メンバー限定・年齢制限は非対応
- 翻訳は無料 Google 経由。不通時は原文を維持し `warnings` に記録
- Twitter/X は未実装

## 出力契約（型）

| 型 | 主なフィールド |
|----|----------------|
| `TranscriptRequest` | `url` |
| `TranscriptSegment` | `start`, `end`, `text`, `text_ja` |
| `TranscriptResult` | `source`, `source_url`, `transcript`, `translation_ja`, `segments`, `warnings` |
| `TranscriptError` | `code`, `message` |

## フェーズ

1. Scaffold & contract
2. YouTube captions
3. Translate JA
4. CLI entrypoint ← 現行
5. Twitter/X（deferred）

詳細: `docs/plans/01-video-transcript/`
