# 競馬レース記事生成システム - Vercel版

このディレクトリには、競馬レース記事生成システムのVercel移植版のコードが含まれています。

## プロジェクト構造

```
vercel_setup/
├── README.md                # このファイル
├── next.config.js           # Next.js設定ファイル
├── package.json             # 依存関係
├── .env.local.example       # 環境変数サンプル
├── src/
│   ├── app/                 # App Router
│   │   ├── page.tsx         # ホームページ
│   │   ├── dashboard/       # ダッシュボード
│   │   ├── login/           # ログインページ
│   │   ├── register/        # 登録ページ
│   │   ├── api-settings/    # API設定ページ
│   │   ├── analyze/         # AI分析ページ
│   │   └── articles/        # 記事表示ページ
│   ├── components/          # 共通コンポーネント
│   ├── lib/                 # ユーティリティ関数
│   ├── api/                 # API関連ロジック
│   └── types/               # 型定義
└── public/                  # 静的ファイル
```

## セットアップ手順

1. 依存関係のインストール
```bash
npm install
```

2. 環境変数の設定
`.env.local.example`を`.env.local`にコピーし、必要な値を設定します。

3. 開発サーバーの起動
```bash
npm run dev
```

4. Vercelへのデプロイ
```bash
vercel
```

## 移行ガイド

現在のFlaskアプリケーションからVercel版への移行方法については、`vercel_migration_plan.md`を参照してください。
