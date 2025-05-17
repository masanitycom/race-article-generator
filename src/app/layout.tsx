import type { Metadata } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto', weight: ['300', '400', '500', '700'], display: 'swap' });

export const metadata: Metadata = {
  title: 'AI競馬予想システム | プロフェッショナルな競馬分析',
  description: 'AIが自動的に競馬レースを分析し、プロフェッショナルな予想記事を生成するシステム',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body>
        <nav className="navbar">
          <div className="container navbar-container">
            <Link href="/" className="navbar-brand">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 7v10c0 3-2 5-5 5H5"></path>
                <path d="M5 2v10c0 3 2 5 5 5h5"></path>
                <path d="M12 12h7"></path>
                <path d="M12 16h7"></path>
                <path d="M12 8h7"></path>
              </svg>
              AI競馬予想システム
            </Link>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link href="/" className="nav-link active">ホーム</Link>
              </li>
              <li className="nav-item">
                <Link href="/analyze" className="nav-link">AI自動分析</Link>
              </li>
              <li className="nav-item">
                <Link href="/api-settings" className="nav-link">API設定</Link>
              </li>
              <li className="nav-item">
                <Link href="/login" className="nav-link">ログイン</Link>
              </li>
              <li className="nav-item">
                <Link href="/register" className="nav-link">新規登録</Link>
              </li>
            </ul>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
