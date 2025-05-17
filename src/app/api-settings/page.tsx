'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ApiSettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [maskedApiKey, setMaskedApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
  const router = useRouter();

  // APIキー情報の取得
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/api-keys');
        if (response.ok) {
          const data = await response.json();
          if (data.masked_api_key) {
            setMaskedApiKey(data.masked_api_key);
          }
        }
      } catch (err) {
        console.error('APIキー取得エラー:', err);
      }
    };

    fetchApiKey();
  }, []);

  // APIキーの保存
  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsSaved(false);
    setTestResult(null);

    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key: apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'APIキーの保存中にエラーが発生しました');
        setIsLoading(false);
        return;
      }

      setIsSaved(true);
      setApiKey('');
      if (data.masked_api_key) {
        setMaskedApiKey(data.masked_api_key);
      }
    } catch (err) {
      setError('サーバーとの通信中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // APIキーのテスト
  const handleTestApiKey = async () => {
    setIsLoading(true);
    setTestResult(null);
    setError('');

    try {
      const response = await fetch('/api/api-keys/test', {
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        setTestResult({
          success: false,
          message: data.error || 'APIキーのテストに失敗しました',
        });
        setIsLoading(false);
        return;
      }

      setTestResult({
        success: true,
        message: 'APIキーのテストに成功しました',
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: 'サーバーとの通信中にエラーが発生しました',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="container py-4">
        <h1 className="section-title">API設定</h1>
        
        <div className="analysis-container">
          <h2 className="mb-4">OpenAI APIキー設定</h2>
          <p className="mb-4">
            AI自動分析機能を使用するには、OpenAI APIキーが必要です。
            <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="auth-link ms-2">
              APIキーを取得する（OpenAIウェブサイト）
            </a>
          </p>
          
          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              {error}
            </div>
          )}
          
          {isSaved && (
            <div className="alert alert-success mb-4" role="alert">
              APIキーが正常に保存されました
            </div>
          )}
          
          {testResult && (
            <div className={`alert ${testResult.success ? 'alert-success' : 'alert-danger'} mb-4`} role="alert">
              {testResult.message}
            </div>
          )}
          
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">現在のAPIキー状態</h3>
              <p className="card-text">
                {maskedApiKey ? (
                  <>APIキー: {maskedApiKey}</>
                ) : (
                  <>APIキーが設定されていません</>
                )}
              </p>
              
              {maskedApiKey && (
                <button
                  className="btn btn-outline"
                  onClick={handleTestApiKey}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner me-2"></span>
                      テスト中...
                    </>
                  ) : (
                    'APIキーをテスト'
                  )}
                </button>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSaveApiKey}>
            <div className="form-group">
              <label htmlFor="api_key" className="form-label">
                OpenAI APIキー
              </label>
              <input
                type="password"
                className="form-control"
                id="api_key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                autoComplete="off"
              />
              <div className="form-text">
                APIキーは安全に暗号化して保存されます。
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !apiKey}
            >
              {isLoading ? (
                <>
                  <span className="spinner me-2"></span>
                  保存中...
                </>
              ) : (
                'APIキーを保存'
              )}
            </button>
          </form>
        </div>
        
        <div className="analysis-container">
          <h2 className="mb-3">APIキーについての注意事項</h2>
          <div className="alert alert-warning">
            <h5 className="alert-heading">重要</h5>
            <p>
              OpenAI APIは有料サービスです。APIキーを使用すると、使用量に応じて課金されます。
              料金体系については、<a href="https://openai.com/pricing" target="_blank" rel="noopener noreferrer" className="auth-link">OpenAIの料金ページ</a>をご確認ください。
            </p>
            <hr />
            <p className="mb-0">
              テスト用のダミーAPIキー（例: sk-test...）では機能しません。有効なAPIキーを設定してください。
            </p>
          </div>
          
          <h3 className="mt-4 mb-3">APIキーの取得方法</h3>
          <ol>
            <li className="mb-2">OpenAIアカウントを作成（または既存のアカウントでログイン）</li>
            <li className="mb-2"><a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="auth-link">APIキーページ</a>にアクセス</li>
            <li className="mb-2">「Create new secret key」ボタンをクリック</li>
            <li className="mb-2">生成されたAPIキーをコピーして、上記フォームに貼り付け</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
