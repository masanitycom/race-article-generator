import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DeepStride競馬AI - 最先端AIによる競馬予想',
  description: '最先端のAI技術を活用した競馬予想システム。レース分析、予想、買い目提案をAIが自動で行います。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <header className="navbar">
          <div className="container navbar-container">
            <Link href="/" className="navbar-brand">
              <Image 
                src="/logo.png" 
                alt="DeepStride競馬AI" 
                width={200} 
                height={40} 
                priority
              />
            </Link>
            <nav>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link href="/" className="nav-link">
                    ホーム
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/analyze" className="nav-link">
                    レース分析
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/api-settings" className="nav-link">
                    API設定
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">
                    ログイン
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/register" className="nav-link">
                    新規登録
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div>
                <h3 className="footer-title">DeepStride競馬AI</h3>
                <p>最先端のAI技術を活用した競馬予想システム</p>
              </div>
              <div>
                <h3 className="footer-title">リンク</h3>
                <ul className="footer-links">
                  <li className="footer-link">
                    <Link href="/">ホーム</Link>
                  </li>
                  <li className="footer-link">
                    <Link href="/analyze">レース分析</Link>
                  </li>
                  <li className="footer-link">
                    <Link href="/api-settings">API設定</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="footer-title">アカウント</h3>
                <ul className="footer-links">
                  <li className="footer-link">
                    <Link href="/login">ログイン</Link>
                  </li>
                  <li className="footer-link">
                    <Link href="/register">新規登録</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} DeepStride競馬AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
