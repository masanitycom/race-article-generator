'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// ローディングコンポーネント
function Loading() {
  return (
    <div className="text-center py-5">
      <div className="spinner" style={{ width: '3rem', height: '3rem', borderWidth: '0.3rem', borderTopColor: 'var(--primary)', margin: '0 auto' }}></div>
      <p className="mt-3">分析中...</p>
    </div>
  );
}

// 分析フォームコンポーネント
function AnalyzeForm() {
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

      if (!response.ok) {
        const data = await response.json();
        
        // APIキーエラーの場合は設定ページへ誘導
        if (data.type === 'api_key_error') {
          throw new Error('APIキーが設定されていないか、無効です。API設定ページで設定してください。');
        }
        
        throw new Error(data.error || 'レース分析中にエラーが発生しました');
      }

      const data = await response.json();
      
      // 分析結果ページへリダイレクト
      router.push(`/analyze/result?session_id=${data.session_id}`);
    } catch (err: any) {
      setError(err.message || 'レース分析リクエスト中にエラーが発生しました');
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">レース分析</h2>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
            {error.includes('APIキー') && (
              <div className="mt-2">
                <Link href="/api-settings" className="btn btn-outline btn-sm">
                  API設定ページへ
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="raceName" className="form-label">レース名</label>
            <input
              type="text"
              className="form-control"
              id="raceName"
              value={raceName}
              onChange={(e) => setRaceName(e.target.value)}
              placeholder="例: 東京11R 日本ダービー"
              required
            />
            <div className="form-text">
              分析したいレース名を入力してください。正確なレース名を入力するとより精度の高い分析が可能です。
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner me-2"></span>
                分析中...
              </>
            ) : (
              'AIでレースを分析'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <div className="page-content">
      <div className="container py-5">
        <div className="text-center mb-5">
          <Image 
            src="/logo.png" 
            alt="DeepStride競馬AI" 
            width={300} 
            height={60} 
            priority
            className="mb-4"
          />
          <h1 className="mb-3">AIレース分析</h1>
          <p className="mb-4">
            最先端のAI技術を活用して、レース情報を分析し、予想を提供します。
            レース名を入力するだけで、出走馬の情報、血統分析、展開予想、買い目候補などを自動で分析します。
          </p>
        </div>

        <div className="row">
          <div className="col-md-8 mx-auto">
            <Suspense fallback={<Loading />}>
              <AnalyzeForm />
            </Suspense>
          </div>
        </div>

        <div className="mt-5">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">分析の仕組み</h3>
              <p>
                DeepStride競馬AIは、過去のレース結果、血統情報、調教データ、騎手成績など、
                あらゆるデータを分析し、精度の高い予想を提供します。
                最新の情報をリアルタイムで反映し、馬場状態や天候変化なども考慮した分析結果を提供します。
              </p>
              <h4 className="mt-4">分析内容</h4>
              <ul>
                <li>出走馬情報（馬名、騎手、調教師、オッズなど）</li>
                <li>馬場状態と天気予報</li>
                <li>各馬の過去の成績と調子</li>
                <li>血統分析</li>
                <li>展開予想</li>
                <li>勝率予測</li>
                <li>印（◎○▲△）と買い目</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
