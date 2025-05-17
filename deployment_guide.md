# Firebase デプロイガイド

## 概要

このガイドでは、DeepStride競馬AIをFirebaseとVercelを使用してデプロイする方法を説明します。

## 前提条件

- Firebaseアカウント
- Vercelアカウント
- GitHubアカウント（推奨）
- Node.js 16以上

## 1. Firebaseプロジェクトのセットアップ

### 1.1 Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: `deepstride-racing-ai`）
4. Google Analyticsの設定を選択（推奨: 有効化）
5. 「プロジェクトを作成」をクリック

### 1.2 Firebase Webアプリの登録

1. プロジェクトのダッシュボードで「</>」（Webアプリ）をクリック
2. アプリのニックネームを入力（例: `deepstride-racing-ai-web`）
3. 「このアプリのFirebase Hostingも設定する」にチェック
4. 「アプリを登録」をクリック
5. 表示されるFirebaseの設定情報をメモ（環境変数設定で使用）

### 1.3 認証の設定

1. 左メニューの「Authentication」をクリック
2. 「始める」をクリック
3. 「ログイン方法」タブで以下のプロバイダを有効化:
   - メール/パスワード
   - Google
   - Twitter
4. 各プロバイダの設定を完了（TwitterはTwitter Developer Portalでの設定が必要）

### 1.4 Firestoreの設定

1. 左メニューの「Firestore Database」をクリック
2. 「データベースの作成」をクリック
3. セキュリティルールのモードを選択（開発中は「テストモード」、本番環境では「本番環境モード」）
4. ロケーションを選択（例: `asia-northeast1`）
5. 「有効にする」をクリック

### 1.5 Firestoreセキュリティルールの設定

1. Firestoreダッシュボードで「ルール」タブをクリック
2. 以下のルールを設定:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみアクセス可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // APIキーは所有者のみアクセス可能
    match /apiKeys/{userId}/keys/{keyId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 分析結果は所有者のみアクセス可能
    match /analyses/{userId}/results/{analysisId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. 「公開」をクリック

## 2. Firebase Cloud Functionsのセットアップ

### 2.1 Firebase CLIのインストール

```bash
npm install -g firebase-tools
```

### 2.2 Firebase CLIでログイン

```bash
firebase login
```

### 2.3 プロジェクトディレクトリで初期化

```bash
cd race_article_generator/firebase_implementation
firebase init functions
```

- 既存のFirebaseプロジェクトを選択
- 言語は「JavaScript」を選択
- ESLintは任意
- 依存関係のインストールは「はい」を選択

### 2.4 Cloud Functions用の環境変数設定

```bash
firebase functions:config:set email.host="smtp.example.com" email.port="587" email.user="user@example.com" email.password="password" email.from="noreply@example.com"
```

### 2.5 Cloud Functionsのデプロイ

```bash
firebase deploy --only functions
```

## 3. Vercelへのデプロイ

### 3.1 GitHubリポジトリの準備

1. GitHubにリポジトリを作成
2. プロジェクトファイルをリポジトリにプッシュ

### 3.2 Vercelプロジェクトの作成

1. [Vercel](https://vercel.com/)にログイン
2. 「New Project」をクリック
3. GitHubリポジトリをインポート

### 3.3 環境変数の設定

「Environment Variables」セクションで以下の環境変数を設定:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXTAUTH_URL=
```

### 3.4 デプロイ

「Deploy」ボタンをクリックしてデプロイを開始

## 4. デプロイ後の確認

1. 認証機能（ログイン、新規登録）
2. Google/Twitter認証
3. APIキー管理
4. レース分析機能
5. 自動返信メール送信

## トラブルシューティング

### 認証エラー

- Firebase Consoleで認証プロバイダの設定を確認
- 環境変数が正しく設定されているか確認
- ブラウザのコンソールでエラーメッセージを確認

### Firestore接続エラー

- Firestoreが有効化されているか確認
- セキュリティルールが正しく設定されているか確認
- プロジェクトIDが環境変数に正しく設定されているか確認

### Cloud Functions実行エラー

- Firebase Functionsのログを確認
- 環境変数が正しく設定されているか確認
- 依存関係が正しくインストールされているか確認

## 参考リンク

- [Firebase ドキュメント](https://firebase.google.com/docs)
- [Next.js ドキュメント](https://nextjs.org/docs)
- [Vercel ドキュメント](https://vercel.com/docs)
