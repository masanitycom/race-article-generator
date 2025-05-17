# Firebase環境変数設定ガイド

## 必要な環境変数

### Firebase設定
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### メール送信設定
```
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=
```

### アプリ設定
```
NEXTAUTH_URL=
OPENAI_API_KEY=
```

## 環境変数の取得方法

### Firebase設定の取得

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクトを選択（または新規作成）
3. プロジェクト設定 > 全般 > マイアプリ > Webアプリ（追加または既存）
4. 「Firebase SDK snippet」で「構成」を選択
5. 表示されるオブジェクトから各値をコピー

```javascript
const firebaseConfig = {
  apiKey: "ここからNEXT_PUBLIC_FIREBASE_API_KEYの値をコピー",
  authDomain: "ここからNEXT_PUBLIC_FIREBASE_AUTH_DOMAINの値をコピー",
  projectId: "ここからNEXT_PUBLIC_FIREBASE_PROJECT_IDの値をコピー",
  storageBucket: "ここからNEXT_PUBLIC_FIREBASE_STORAGE_BUCKETの値をコピー",
  messagingSenderId: "ここからNEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_IDの値をコピー",
  appId: "ここからNEXT_PUBLIC_FIREBASE_APP_IDの値をコピー"
};
```

### メール送信設定

SMTPサーバー情報を設定します。Gmail、SendGrid、Amazon SESなどのサービスが利用可能です。

例（Gmail）:
```
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

注意: Gmailを使用する場合は、「アプリパスワード」の設定が必要です。

### アプリ設定

- `NEXTAUTH_URL`: デプロイしたアプリのURL（例: https://your-app.vercel.app）
- `OPENAI_API_KEY`: OpenAIのAPIキー（オプション、アプリ内で設定する場合は不要）

## 環境変数の設定場所

### ローカル開発環境

`.env.local`ファイルを作成し、上記の環境変数を設定します。

### Vercel

1. Vercelダッシュボードでプロジェクトを選択
2. 「Settings」 > 「Environment Variables」
3. 各環境変数を追加

### Firebase Cloud Functions

Firebase Cloud Functionsを使用する場合は、以下のコマンドで環境変数を設定します。

```bash
firebase functions:config:set email.host="smtp.example.com" email.port="587" email.user="user@example.com" email.password="password" email.from="noreply@example.com"
```
