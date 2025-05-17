'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="catchphrase">最先端AIで競馬予想を革新する</div>
      <div className="header-container">
        <div className="logo-container">
          <Link href="/" className="logo-text">DeepStride競馬AI</Link>
        </div>
        <nav className="main-nav">
          <ul className="nav-links">
            <li>
              <Link href="/" className="nav-link">ホーム</Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link href="/analyze" className="nav-link">レース分析</Link>
                </li>
                <li>
                  <Link href="/api-settings" className="nav-link">API設定</Link>
                </li>
                <li>
                  <button onClick={logout} className="nav-link logout-button">ログアウト</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="nav-link">ログイン</Link>
                </li>
                <li>
                  <Link href="/register" className="nav-link register-link">新規登録</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
