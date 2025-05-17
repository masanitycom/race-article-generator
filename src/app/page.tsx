import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="page-content">
      <section className="hero">
        <div className="container hero-content">
          <Image 
            src="/logo.png" 
            alt="DeepStride競馬AI" 
            width={400} 
            height={80} 
            priority
            className="mb-4"
          />
          <h1 className="hero-title">最先端AIで競馬予想を革新する</h1>
          <p className="hero-subtitle">
            DeepStride競馬AIは、最新のAI技術を駆使して、レース分析から買い目提案まで
            あなたの競馬予想をサポートします。過去のデータ、血統情報、調教データなど
            あらゆる要素を分析し、精度の高い予想を提供します。
          </p>
          <div className="hero-buttons">
            <Link href="/analyze" className="btn btn-primary btn-lg">
              レース分析を始める
            </Link>
            <Link href="/register" className="btn btn-outline btn-lg">
              新規登録
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">DeepStride競馬AIの特徴</h2>
          <p className="section-subtitle">
            最先端のAI技術と豊富なデータを組み合わせた、次世代の競馬予想システム
          </p>
          <div className="features-grid">
            <div className="card">
              <div className="card-body">
                <div className="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <h3 className="card-title">膨大なデータ分析</h3>
                <p className="card-text">
                  過去のレース結果、血統情報、調教データ、騎手成績など、あらゆるデータを分析し、精度の高い予想を提供します。
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
                <h3 className="card-title">リアルタイム分析</h3>
                <p className="card-text">
                  最新の情報をリアルタイムで反映し、馬場状態や天候変化なども考慮した分析結果を提供します。
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v4l3 3"></path>
                  </svg>
                </div>
                <h3 className="card-title">高速処理</h3>
                <p className="card-text">
                  最新のAIエンジンにより、複雑なデータ分析も瞬時に処理。レース直前の分析も可能です。
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="card-title">個別最適化</h3>
                <p className="card-text">
                  あなたの予想スタイルや過去の結果を学習し、個別に最適化された予想を提供します。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="card">
            <div className="card-body text-center py-5">
              <h2 className="mb-4">今すぐDeepStride競馬AIを体験しよう</h2>
              <p className="mb-4">
                新規登録して、AI競馬予想の未来を体験してください。
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link href="/register" className="btn btn-primary btn-lg">
                  無料で新規登録
                </Link>
                <Link href="/analyze" className="btn btn-outline btn-lg">
                  レース分析を試す
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
