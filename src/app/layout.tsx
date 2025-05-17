import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '競馬レース記事生成システム',
  description: 'AIが自動的に競馬レースを分析し、予想記事を生成するシステム',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
          <div className="container">
            <a className="navbar-brand" href="/">AI競馬予想システム</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <a className="nav-link" href="/dashboard">ダッシュボード</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/analyze">AI自動分析</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/api-settings">API設定</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div style={{ paddingTop: '60px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
