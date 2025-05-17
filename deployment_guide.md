# 競馬レース記事生成システム - Vercelデプロイガイド

このガイドでは、競馬レース記事生成システムをVercelにデプロイする手順を説明します。

## 前提条件

- GitHubアカウント
- Vercelアカウント
- OpenAIアカウントとAPIキー

## デプロイ手順

### 1. GitHubリポジトリの準備

1. GitHubで新しいリポジトリを作成します
2. 提供されたコード一式（`vercel_setup`ディレクトリの内容）をリポジトリにプッシュします

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/race-article-generator.git
git push -u origin main
```

### 2. Vercelアカウントの設定

1. [Vercel](https://vercel.com/)にアクセスし、GitHubアカウントでサインアップまたはログインします
2. ダッシュボードから「New Project」をクリックします

### 3. プロジェクトのインポート

1. 先ほど作成したGitHubリポジトリを選択します
2. フレームワークプリセットとして「Next.js」が自動選択されていることを確認します
3. 「Environment Variables」セクションで以下の環境変数を設定します:

```
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
ENCRYPTION_KEY=your-encryption-key-for-api-keys
```

4. 「Deploy」ボタンをクリックしてデプロイを開始します

### 4. Vercel KVの設定

1. デプロイ完了後、Vercelダッシュボードの「Storage」タブをクリックします
2. 「Create Database」→「KV Database」を選択します
3. 必要な情報を入力し、KVデータベースを作成します
4. 作成したKVデータベースをプロジェクトにリンクします
5. 自動的に必要な環境変数が追加されます:

```
KV_URL
KV_REST_API_URL
KV_REST_API_TOKEN
KV_REST_API_READ_ONLY_TOKEN
```

### 5. 動作確認

1. デプロイが完了したら、提供されたURLにアクセスします
2. 新規ユーザー登録を行います
3. API設定ページでOpenAI APIキーを設定します
4. AI自動分析ページでレース名を入力し、分析が正常に行われることを確認します

## トラブルシューティング

### APIキーエラー

- OpenAI APIキーが正しく設定されているか確認してください
- APIキーに十分なクレジットが残っているか確認してください
- テスト用のダミーAPIキー（sk-test...）ではなく、実際の有料APIキーを使用してください

### デプロイエラー

- ビルドログを確認し、エラーメッセージを特定してください
- 必要な環境変数がすべて設定されているか確認してください
- GitHubリポジトリが最新の状態であることを確認してください

## 運用上の注意点

1. **APIコスト管理**
   - OpenAI APIの使用量を定期的に確認してください
   - 必要に応じて使用量制限を設定してください

2. **セキュリティ**
   - 定期的に環境変数（特にNEXTAUTH_SECRETとENCRYPTION_KEY）を更新してください
   - ユーザーのAPIキーは暗号化して保存されますが、定期的なセキュリティレビューを行ってください

3. **パフォーマンス**
   - 大量のユーザーがいる場合は、Vercelのスケーリングプランのアップグレードを検討してください
   - KVデータベースの容量制限に注意してください

## 更新とメンテナンス

1. GitHubリポジトリに変更をプッシュすると、Vercelは自動的に再デプロイします
2. 大きな変更を行う場合は、プレビュー環境でテストしてから本番環境に反映させることをお勧めします

## サポートとリソース

- [Vercelドキュメント](https://vercel.com/docs)
- [Next.jsドキュメント](https://nextjs.org/docs)
- [OpenAI APIドキュメント](https://platform.openai.com/docs/api-reference)
