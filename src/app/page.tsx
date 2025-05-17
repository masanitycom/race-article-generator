import Link from 'next/link';

export default function Home() {
  return (
    <div className="page-content">
      {/* ヒーローセクション */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">競馬レース記事生成システム</h1>
            <p className="hero-subtitle">
              レース名を入力するだけで、AIが自動的に最新情報を収集・分析し、プロフェッショナルな予想記事を生成します。
              出走馬情報、オッズ、馬場状態、天気予報などを自動取得し、印と買い目を提案します。
            </p>
            
            <div className="hero-buttons">
              <Link href="/login" className="btn btn-primary btn-lg">
                ログイン
              </Link>
              <Link href="/register" className="btn btn-outline btn-lg">
                新規登録
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* 特徴セクション */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">AI競馬予想の新時代</h2>
          <p className="section-subtitle">
            最新のAI技術を駆使して、競馬予想の精度と効率を飛躍的に向上させます。
            プロの競馬評論家のような詳細な分析と予想を、わずか数分で自動生成します。
          </p>
          
          <div className="features-grid">
            <div className="card">
              <div className="card-body">
                <div className="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3 className="card-title">最新情報を自動収集</h3>
                <p className="card-text">
                  出走馬情報、オッズ、馬場状態、天気予報などの最新情報を自動的に収集し、常に最新のデータに基づいた分析を提供します。
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <div className="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <h3 className="card-title">AI独自の分析</h3>
                <p className="card-text">
                  収集したデータを基に、独自のAI分析を実施し、各馬の勝率を計算。過去の傾向や血統情報も考慮した総合的な分析を提供します。
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <div className="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3 className="card-title">完全自動化</h3>
                <p className="card-text">
                  レース名を入力するだけで、すべての分析と記事生成を自動的に行います。手間をかけずに、プロフェッショナルな予想記事を入手できます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 使い方セクション */}
      <section className="py-5" style={{ backgroundColor: 'var(--gray-100)' }}>
        <div className="container">
          <h2 className="section-title">簡単3ステップ</h2>
          
          <div className="features-grid">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-3">
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>1</div>
                </div>
                <h3 className="card-title text-center">アカウント登録</h3>
                <p className="card-text text-center">
                  無料でアカウントを作成し、OpenAI APIキーを設定します。
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-3">
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>2</div>
                </div>
                <h3 className="card-title text-center">レース名を入力</h3>
                <p className="card-text text-center">
                  分析したいレース名を入力するだけ。中央競馬も地方競馬も対応しています。
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-3">
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>3</div>
                </div>
                <h3 className="card-title text-center">分析結果を確認</h3>
                <p className="card-text text-center">
                  AIが生成した詳細な分析と予想を確認。印や買い目も一目瞭然です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTAセクション */}
      <section className="py-5" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
        <div className="container text-center py-4">
          <h2 className="mb-3">今すぐAI競馬予想を体験しよう</h2>
          <p className="mb-4">最新のAI技術を活用した競馬予想で、的中率を向上させましょう。</p>
          <Link href="/register" className="btn btn-lg" style={{ backgroundColor: 'white', color: 'var(--primary)' }}>
            無料で始める
          </Link>
        </div>
      </section>
      
      {/* フッター */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div>
              <h3 className="footer-title">AI競馬予想システム</h3>
              <p>最新のAI技術を活用した競馬予想サービス</p>
            </div>
            
            <div>
              <h3 className="footer-title">リンク</h3>
              <ul className="footer-links">
                <li className="footer-link"><Link href="/">ホーム</Link></li>
                <li className="footer-link"><Link href="/login">ログイン</Link></li>
                <li className="footer-link"><Link href="/register">新規登録</Link></li>
                <li className="footer-link"><Link href="/analyze">AI自動分析</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="footer-title">お問い合わせ</h3>
              <ul className="footer-links">
                <li className="footer-link"><a href="mailto:info@ai-keiba.example.com">info@ai-keiba.example.com</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} AI競馬予想システム. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
