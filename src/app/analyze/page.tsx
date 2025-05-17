'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AnalyzePage() {
  const [raceName, setRaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKeyError, setApiKeyError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setApiKeyError(false);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ race_name: raceName }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.type === 'api_key_error') {
          setApiKeyError(true);
        } else {
          setError(data.error || '分析中にエラーが発生しました');
        }
        setIsLoading(false);
        return;
      }

      // 分析結果ページへリダイレクト
      router.push(`/analyze/result/${data.session_id}`);
    } catch (err) {
      setError('サーバーとの通信中にエラーが発生しました');
      setIsLoading(false);
    }
  };

  return (
    <main className="container py-4">
      <h1 className="mb-4">AI競馬予想</h1>
      
      <div className="bg-white rounded shadow p-4 mb-4">
        <h3 className="mb-3">レース名を入力するだけで予想記事を自動生成</h3>
        <p className="text-muted mb-4">
          レース名を入力するだけで、AIが自動的に最新情報を収集・分析し、予想記事を生成します。
          出走馬情報、オッズ、馬場状態、天気予報などを自動取得し、印と買い目を提案します。
        </p>
        
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}
        
        {apiKeyError && (
          <div className="alert alert-danger mb-4" role="alert">
            <h5 className="alert-heading">APIキーエラー</h5>
            <p>OpenAI APIキーが無効または期限切れです。以下をご確認ください：</p>
            <ul>
              <li>有効なOpenAI APIキーが設定されていること</li>
              <li>APIキーに十分な利用枠（クレジット）が残っていること</li>
              <li>テスト用やダミーのAPIキーではなく、実際の有料APIキーであること</li>
            </ul>
            <hr />
            <p className="mb-0">
              <Link href="/api-settings" className="btn btn-outline-danger">
                APIキー設定を確認する
              </Link>
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="race_name" className="form-label">
              レース名 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="race_name"
              value={raceName}
              onChange={(e) => setRaceName(e.target.value)}
              required
              placeholder="例: ヴィクトリアマイル、天皇賞(春)、菊花賞、かしわ記念 など"
            />
            <div className="form-text">
              中央競馬・地方競馬どちらも対応しています。レース名のみ入力してください。
            </div>
          </div>
          
          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  AIが情報収集・分析中...
                </>
              ) : (
                'AIに分析させる'
              )}
            </button>
          </div>
        </form>
        
        {isLoading && (
          <div className="text-center mt-4">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>AIが情報収集・分析中...</h4>
            <p className="text-muted">
              最新の出走馬情報、オッズ、馬場状態、天気予報などを収集し、分析しています。<br />
              しばらくお待ちください（約30秒〜1分）。
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded shadow p-4">
        <h3 className="mb-3">AI分析の特徴</h3>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">最新情報を自動収集</h5>
                <p className="card-text">
                  出走馬情報、オッズ、馬場状態、天気予報などの最新情報を自動的に収集します。
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">AI独自の分析</h5>
                <p className="card-text">
                  収集したデータを基に、独自のAI分析を実施し、各馬の勝率を計算します。
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">完全自動化</h5>
                <p className="card-text">
                  レース名を入力するだけで、すべての分析と記事生成を自動的に行います。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
