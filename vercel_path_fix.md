# Vercelビルドエラー修正ガイド

## 発生したエラー

Vercelでのビルド時に以下のエラーが発生しました：

```
Module not found: Can't resolve '@/lib/auth'
```

これは、Next.jsのプロジェクトで`@`エイリアスを使用しているのに、適切な設定がされていないことが原因です。

## 修正内容

以下のファイルを追加・修正しました：

### 1. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2. next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  // API Routes用の設定
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      }
    ];
  },
  // webpack設定を追加
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    return config;
  },
};

module.exports = nextConfig;
```

### 3. jsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 修正後の確認方法

1. 変更をGitHubリポジトリにプッシュ
2. Vercelの自動ビルドが開始されるのを確認
3. ビルドログでエラーが解消されたことを確認
4. デプロイされたアプリケーションにアクセスして動作確認

## 注意点

- パスエイリアスの設定は、TypeScriptとwebpackの両方で行う必要があります
- Vercelでは、これらの設定ファイルがプロジェクトのルートディレクトリに配置されている必要があります
- 設定変更後は必ず再ビルドが必要です
