# Vercel デプロイエラー修正ガイド

## 概要

このガイドでは、Next.js App Routerを使用したVercelへのデプロイ時に発生する可能性のあるエラーとその修正方法について説明します。

## 修正済みの主要エラー

1. **Dynamic Server Usage エラー**
   - 問題: `headers`などの動的サーバー機能を使用するAPIルートが静的生成されようとしてエラー
   - 解決策: `export const dynamic = 'force-dynamic'`をAPIルートに追加

2. **useSearchParams Suspense エラー**
   - 問題: クライアントコンポーネントで`useSearchParams`を使用する際にSuspenseでラップされていない
   - 解決策: `useSearchParams`を使用するコンポーネントを`<Suspense>`でラップ

## 修正したファイル

1. **src/app/api/api-keys/route.ts**
   - 動的レンダリング設定の追加
   - エラーハンドリングの強化

2. **src/app/api/api-keys/test/route.ts**
   - 動的レンダリング設定の追加
   - エラーハンドリングの強化

3. **src/app/api/analyze/route.ts**
   - 動的レンダリング設定の追加
   - エラーハンドリングの強化

4. **src/app/analyze/result/page.tsx**
   - Suspenseによるラッピング
   - クライアントコンポーネントの適切な分離

## Vercelデプロイのベストプラクティス

1. **動的レンダリングの明示的な指定**
   ```typescript
   // APIルートで動的レンダリングを強制
   export const dynamic = 'force-dynamic';
   ```

2. **クライアントコンポーネントのSuspense対応**
   ```tsx
   // useSearchParamsなどのフックを使用する場合
   export default function Page() {
     return (
       <Suspense fallback={<Loading />}>
         <ClientComponent />
       </Suspense>
     );
   }
   ```

3. **環境変数の適切な設定**
   - `.env.local`ファイルをVercelプロジェクト設定に反映
   - 秘密キーは必ずVercel環境変数として設定

4. **KVデータベースの接続確認**
   - Vercel KVが正しく設定されていることを確認
   - 接続文字列が環境変数として設定されていることを確認

## デプロイ前チェックリスト

1. `next build`コマンドでローカルビルドが成功することを確認
2. 動的APIルートに`dynamic = 'force-dynamic'`が設定されていることを確認
3. クライアントコンポーネントで使用される`useSearchParams`などのフックがSuspenseでラップされていることを確認
4. 必要な環境変数がすべて設定されていることを確認
5. KVデータベースが正しく設定されていることを確認
