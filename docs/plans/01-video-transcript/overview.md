# 01 — Video Transcript (字幕取得 → 和訳)

## Context

動画 URL を渡すと文字起こし相当のテキストを得て、日本語訳を出したい。リポジトリ本体は Vercel AI SDK + Gemini の Next.js デモ群だが、**API 課金を避けたい**ため本機能は **Python CLI** で進める。メイン対象は公開 YouTube。Twitter/X は字幕が期待できないため後続フェーズとする。

## Scope

### In

- 公開 YouTube URL から字幕（手動 / 自動）を取得
- 取得テキストの日本語翻訳
- ローカル実行の Python CLI（stdout / ファイル出力）
- 共通出力契約（YouTube / Twitter で同じ形）
- Twitter/X 用の `source` 分岐と「未実装」エラー予約（実装本体は後続）

### Out（明示的除外）

- Gemini / 有料文字起こし API の利用
- Next.js 画面・`/api/*` Route Handler（必要なら別プラン）
- 任意サイトの汎用スクレイピング
- 非公開・メンバー限定・年齢制限動画の対応保証
- Twitter/X の本実装（Phase 5 まで着手しない）

## Constraints

- **課金:** 外部 AI/翻訳 API の有料利用をしない（無料枠・ローカル・非公式無料エンドポイントに限定）
- **実行:** 開発者マシン上の CLI。Vercel デプロイ対象にしない
- **依存:** Python 3.11+ 想定。最小依存（字幕取得 + 翻訳）
- **既存パターン:** Next.js デモの UI/API 規約はこのプランでは触らない
- **失敗時:** 字幕なし / URL 不正はクラッシュせず構造化エラーで返す

## Alternatives

| 案 | 概要 | 判定 |
|----|------|------|
| A. Gemini + YouTube URL | 既存スタックと整合、課金リスク | 不採用（コスト制約） |
| B. YouTube 字幕 API + 無料翻訳 | $0 寄り、字幕依存 | **採用（Phase 1–4）** |
| C. 全件ローカル Whisper | 字幕不要だが重い | Twitter 向けに Phase 5 で検討 |

## Applicable skills

実装時に invoke する:

- `omega-mode` → **Feature** プレイブック（各 phase 実装時）
- `principle-foundational-thinking`（契約先行・小フェーズ）
- `principle-sequence-verifiable-units`（phase ごとに verify → 次へ）
- `principle-make-operations-idempotent`（同じ URL を再実行して同じ成果物へ収束）
- `/verify-done`（各 phase 完了宣言前）

Next.js ドメインスキル（`web-coding-standards` 等）は **本プランの Python CLI 範囲では n/a**。画面を足す別プランで適用。

## Phases

1. [phase-1-scaffold-contract.md](./phase-1-scaffold-contract.md) — ディレクトリ・契約・依存定義
2. [phase-2-youtube-captions.md](./phase-2-youtube-captions.md) — URL 解析と字幕取得
3. [phase-3-translate-ja.md](./phase-3-translate-ja.md) — 日本語翻訳
4. [phase-4-cli-entrypoint.md](./phase-4-cli-entrypoint.md) — CLI 結合・README
5. [phase-5-twitter-whisper.md](./phase-5-twitter-whisper.md) — Twitter/X（**deferred**）

横断: [testing.md](./testing.md)

## Verification（プロジェクトレベル）

- Python: `python -m compileall scripts/video_transcript` および phase ごとの runtime CLI 手順（[testing.md](./testing.md)）
- Next.js: 本プランでは変更しないため `npm run lint` / `npm run build` は **回帰確認のみ（任意）**
- Surface: **CLI 手動 verify**（`control-cli` 未導入のため flag）

## Implementation guidance

- 各 phase 着手前、触るモジュールが unfamiliar なら **how**（狭ければ Explain）
- 設計が争点化したら出荷前に `review-orchestrator-triple-hybrid`
- 監査トレイルが必要なら **show-me-your-work**
- PR を開いたら **babysit**
- **architect:** Phase 1 の契約確定時のみ。以降は契約に沿って Feature 実装
- `architect skipped` 条件: 契約が overview / phase-1 で合意済みで形が変わらない場合は再実行不要

## Done の定義（Phase 1–4）

公開 YouTube URL を 1 本渡し、字幕がある動画で原文＋日本語訳が CLI から得られ、字幕がない / 不正 URL では構造化エラーになること。Twitter は未実装エラーでよい。

## Open decisions（実装開始時にデフォルトで進めてよい）

| 項目 | デフォルト |
|------|-----------|
| 翻訳ライブラリ | `deep-translator`（無料 Google 経由）。不通時は原文のみ出力＋警告 |
| 出力形式 | JSON（契約どおり）＋ `--plain` で人間可读 |
| 配置 | `scripts/video_transcript/`（Next.js `app/` 外） |
