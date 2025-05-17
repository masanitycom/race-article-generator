'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyzePage() {
  const [raceName, setRaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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
          throw new Error('APIキーが無効です。API設定ページで有効なAPIキーを設定してください。');
        }
        throw new Error(data.error || '分析中にエラーが発生しました');
      }

      // 分析結果ページへリダイレクト
      router.push(`/analyze/result?session_id=${data.session_id}`);
    } catch (err: any) {
      setError(err.message || '分析リクエスト中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="container py-4">
        <h1 className="section-title">AI自動分析</h1>
        
        <div className="analysis-container">
          <h2 className="mb-4">レース分析</h2>
          <p className="mb-4">
            分析したいレース名を入力してください。AIが自動的に最新情報を収集・分析し、予想記事を生成します。
          </p>
          
          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="race_name" className="form-label">
                レース名
              </label>
              <input
                type="text"
                className="form-control"
                id="race_name"
                value={raceName}
                onChange={(e) => setRaceName(e.target.value)}
                placeholder="例: ヴィクトリアマイル 2025"
                required
              />
              <div className="form-text">
                中央競馬・地方競馬のレース名を入力できます。年度も含めるとより正確な分析が可能です。
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !raceName}
            >
              {isLoading ? (
                <>
                  <span className="spinner me-2"></span>
                  分析中...
                </>
              ) : (
                'AI分析を開始'
              )}
            </button>
          </form>
        </div>
        
        <div className="analysis-container">
          <h2 className="mb-3">分析対象レースの例</h2>
          
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">中央競馬G1レース</h3>
              <ul>
                <li>日本ダービー 2025</li>
                <li>天皇賞（春） 2025</li>
                <li>桜花賞 2025</li>
                <li>有馬記念 2025</li>
                <li>ジャパンカップ 2025</li>
              </ul>
            </div>
          </div>
          
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">地方競馬重賞レース</h3>
              <ul>
                <li>かしわ記念 2025</li>
                <li>帝王賞 2025</li>
                <li>東京大賞典 2025</li>
                <li>JBCクラシック 2025</li>
              </ul>
            </div>
          </div>
          
          <div className="alert alert-info">
            <h5 className="alert-heading">分析時間について</h5>
            <p className="mb-0">
              レース情報の収集・分析には約1〜2分かかります。分析中はページを閉じずにお待ちください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
