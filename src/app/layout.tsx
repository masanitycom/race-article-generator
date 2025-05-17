import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './layout-client';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DeepStride競馬AI - 最先端AIで競馬予想を革新する',
  description: '最先端のAI技術を活用した競馬予想サービス。レース分析、予想、買い目提案をAIが自動で行います。',
  openGraph: {
    title: 'DeepStride競馬AI - 最先端AIで競馬予想を革新する',
    description: '最先端のAI技術を活用した競馬予想サービス。レース分析、予想、買い目提案をAIが自動で行います。',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeepStride競馬AI - 最先端AIで競馬予想を革新する',
    description: '最先端のAI技術を活用した競馬予想サービス。レース分析、予想、買い目提案をAIが自動で行います。',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
