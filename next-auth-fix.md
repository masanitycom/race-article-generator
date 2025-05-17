# Next-Auth修正ガイド

## 発生したエラー

Vercelでのビルド時に以下のエラーが発生しました：

```
Type error: Module '"next-auth"' has no exported member 'getServerSession'.
Did you mean to use 'import getServerSession from "next-auth"' instead?
```

これはnext-authのバージョンとimport記法の不一致によるエラーです。

## 修正内容

すべてのAPIルートファイルで、next-authのimport文を修正しました：

### 1. src/app/api/analyze/route.ts

```typescript
// 変更前
import { getServerSession } from 'next-auth';

// 変更後
import { getServerSession } from 'next-auth/next';
```

### 2. src/app/api/api-keys/route.ts

```typescript
// 変更前
import { getServerSession } from 'next-auth';

// 変更後
import { getServerSession } from 'next-auth/next';
```

### 3. src/app/api/api-keys/test/route.ts

```typescript
// 変更前
import { getServerSession } from 'next-auth';

// 変更後
import { getServerSession } from 'next-auth/next';
```

## 技術的背景

Next.js 13以降のApp Routerでは、next-authの使用方法が変更されています。getServerSessionは'next-auth'からではなく、'next-auth/next'からインポートする必要があります。

これはnext-authのバージョン4以降での変更点で、App RouterとPages Routerで異なるインポート方法が必要になりました。

## 今後の注意点

- next-authのバージョンアップデート時には、APIの変更に注意してください
- App Router（src/app/...）とPages Router（src/pages/...）では異なるインポート方法が必要です
- 公式ドキュメントを参照して、最新の使用方法を確認することをお勧めします

## 参考リンク

- [next-auth公式ドキュメント](https://next-auth.js.org/)
- [Next.js App Router with next-auth](https://next-auth.js.org/configuration/nextjs#in-app-router)
