# Vercel デプロイガイド

このガイドでは、競馬レース記事生成システムをVercelにデプロイする手順を説明します。

## 前提条件

- GitHubアカウント
- Vercelアカウント
- OpenAI APIキー

## デプロイ手順

### 1. GitHubリポジトリの準備

1. GitHubで新しいリポジトリを作成します
2. 以下のコマンドでローカルリポジトリを初期化し、GitHubにプッシュします

```bash
# リポジトリの初期化
git init
git add .
git commit -m "初回コミット"

# リモートリポジトリの設定
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
git push -u origin main
```

### 2. Vercelアカウントの設定

1. [Vercel](https://vercel.com/)にアクセスし、GitHubアカウントでサインアップまたはログインします
2. ダッシュボードから「New Project」をクリックします

### 3. プロジェクトのインポート

1. 「Import Git Repository」セクションで、先ほど作成したGitHubリポジトリを選択します
2. 「Import」をクリックします

### 4. プロジェクト設定

1. 「Framework Preset」が「Next.js」になっていることを確認します
2. 「Root Directory」が「race_article_generator/vercel_setup」になっていることを確認します
   - もし異なる場合は、「Edit」をクリックして正しいディレクトリを選択します
3. 「Environment Variables」セクションで、以下の環境変数を設定します：

```
NEXTAUTH_SECRET=（ランダムな文字列、例: openssl rand -base64 32 で生成）
NEXTAUTH_URL=https://あなたのプロジェクト名.vercel.app
ENCRYPTION_KEY=（ランダムな文字列、APIキー暗号化用）
```

4. 「Deploy」ボタンをクリックします

### 5. Vercel KVの設定

1. デプロイ完了後、Vercelダッシュボードの「Storage」タブをクリックします
2. 「Create Database」をクリックし、「KV Database」を選択します
3. 必要な情報を入力し、データベースを作成します
4. 作成したデータベースを選択し、「Connect to Project」をクリックします
5. 先ほどデプロイしたプロジェクトを選択し、「Connect」をクリックします
6. 環境変数が自動的に追加されます

### 6. 再デプロイ

1. Vercelダッシュボードの「Deployments」タブをクリックします
2. 最新のデプロイを選択し、「Redeploy」をクリックします
3. これにより、新しく追加された環境変数が反映されます

## 動作確認

1. デプロイが完了したら、Vercelが提供するURLにアクセスします
2. 新規ユーザー登録を行います
3. 「API設定」ページでOpenAI APIキーを設定します
4. 「AI自動分析」ページでレース名を入力し、分析が正常に行われることを確認します

## トラブルシューティング

### ビルドエラーが発生する場合

1. Vercelダッシュボードの「Deployments」タブでエラーログを確認します
2. 必要に応じてコードを修正し、GitHubにプッシュします
3. Vercelは自動的に再デプロイを行います

### 認証エラーが発生する場合

1. 環境変数`NEXTAUTH_SECRET`と`NEXTAUTH_URL`が正しく設定されているか確認します
2. `NEXTAUTH_URL`はデプロイ後のURLと一致している必要があります

### APIキー関連のエラーが発生する場合

1. 環境変数`ENCRYPTION_KEY`が設定されているか確認します
2. OpenAI APIキーが正しく設定されているか確認します

## 更新方法

コードを更新する場合は、GitHubリポジトリにプッシュするだけです。Vercelは自動的に再デプロイを行います。

```bash
git add .
git commit -m "更新内容"
git push origin main
```

## バックアップと復元

Vercel KVのデータをバックアップする場合は、Vercelダッシュボードの「Storage」タブからエクスポート機能を使用します。復元する場合は、同じ場所からインポート機能を使用します。
