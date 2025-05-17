'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { useRaceAnalyses, useApiKeys } from '../../hooks/useFirestore';

// ローディングコンポーネント
function AnalyzeLoading() {
  return (
    <div className="loading-container">
      <div className="spinner large"></div>
      <p>読み込み中...</p>
    </div>
  );
}

// メインコンテンツコンポーネント
function AnalyzeContent() {
  const [raceInfo, setRaceInfo] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { keys, loading: keysLoading } = useApiKeys();
  const { saveAnalysis } = useRaceAnalyses();

  // 認証状態の確認
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=analyze');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError('');
    setResult(null);

    if (!raceInfo.trim()) {
      setError('レース情報を入力してください');
      setIsAnalyzing(false);
      return;
    }

    if (keys.length === 0) {
      setError('APIキーが設定されていません。API設定ページでAPIキーを追加してください。');
      setIsAnalyzing(false);
      return;
    }

    try {
      // APIキーを取得（最初のキーを使用）
      const apiKey = keys[0];
      
      // レース分析APIを呼び出し
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raceInfo,
          apiKeyId: apiKey.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'レース分析に失敗しました');
      }

      const data = await response.json();
      
      // 分析結果を保存
      const analysisId = await saveAnalysis(
        data.result.race_name || 'レース分析',
        { raceInfo },
        data.result
      );
      
      // 結果ページに遷移
      router.push(`/analyze/result?id=${analysisId}`);
    } catch (err: any) {
      console.error('分析エラー:', err);
      setError(err.message || 'レース分析中にエラーが発生しました');
      setIsAnalyzing(false);
    }
  };

  // 認証中またはキー読み込み中はローディング表示
  if (authLoading || keysLoading) {
    return <AnalyzeLoading />;
  }

  return (
    <div className="analyze-container">
      <div className="analyze-header">
        <h1 className="analyze-title">レース分析</h1>
        <p className="analyze-subtitle">レース情報を入力して、AIによる分析を開始します</p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="raceInfo" className="form-label">レース情報</label>
              <textarea
                className="form-control"
                id="raceInfo"
                rows={10}
                value={raceInfo}
                onChange={(e) => setRaceInfo(e.target.value)}
                placeholder="レース名、日付、出走馬、騎手、オッズなどの情報を入力してください"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <span className="spinner me-2"></span>
                    分析中...
                  </>
                ) : (
                  'AIで分析する'
                )}
              </button>
              
              <Link href="/api-settings" className="btn btn-outline-secondary">
                API設定
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="analyze-tips">
        <h3>入力のヒント</h3>
        <ul>
          <li>レース名、開催日、コース情報（距離、馬場状態）を含めてください</li>
          <li>出走馬の名前、騎手名、オッズ情報を含めるとより精度の高い分析が可能です</li>
          <li>過去の成績や血統情報も参考になります</li>
          <li>天候や馬場状態の変化についても記載するとよいでしょう</li>
        </ul>
      </div>
    </div>
  );
}

// メインページコンポーネント
export default function AnalyzePage() {
  return (
    <div className="page-content">
      <Suspense fallback={<AnalyzeLoading />}>
        <AnalyzeContent />
      </Suspense>
    </div>
  );
}
