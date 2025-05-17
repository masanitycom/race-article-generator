'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// 結果ローディングコンポーネント
function ResultLoader() {
  return (
    <div className="page-content">
      <div className="container py-5 text-center">
        <div className="spinner" style={{ width: '3rem', height: '3rem', borderWidth: '0.3rem' }}></div>
        <p className="mt-3">分析結果を読み込んでいます...</p>
      </div>
    </div>
  );
}

// 結果表示の実際のコンポーネント
function AnalysisResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  useEffect(() => {
    if (!sessionId) {
      setError('セッションIDが見つかりません');
      setIsLoading(false);
      return;
    }
    
    const fetchAnalysisResult = async () => {
      try {
        const response = await fetch(`/api/analyze/result?session_id=${sessionId}`);
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || '分析結果の取得に失敗しました');
        }
        
        const data = await response.json();
        setAnalysisResult(data);
      } catch (err: any) {
        setError(err.message || '分析結果の取得中にエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalysisResult();
  }, [sessionId]);
  
  if (isLoading) {
    return (
      <div className="page-content">
        <div className="container py-5 text-center">
          <div className="spinner" style={{ width: '3rem', height: '3rem', borderWidth: '0.3rem' }}></div>
          <p className="mt-3">分析結果を読み込んでいます...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="page-content">
        <div className="container py-5">
          <div className="analysis-container text-center">
            <h1 className="mb-4">エラーが発生しました</h1>
            <div className="alert alert-danger mb-4">{error}</div>
            <Link href="/analyze" className="btn btn-primary">
              分析ページに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!analysisResult) {
    return (
      <div className="page-content">
        <div className="container py-5">
          <div className="analysis-container text-center">
            <h1 className="mb-4">分析結果が見つかりません</h1>
            <p className="mb-4">指定されたセッションIDの分析結果が見つかりませんでした。</p>
            <Link href="/analyze" className="btn btn-primary">
              分析ページに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-content">
      <div className="container py-4">
        <div className="analysis-container">
          <div className="analysis-header">
            <h1 className="analysis-title">{analysisResult.race_name} ― AI 生成分析</h1>
            <p className="analysis-meta">※データ：{new Date().toLocaleDateString('ja-JP')} 時点</p>
          </div>
          
          <div className="analysis-section">
            <h2 className="analysis-section-title">【◆結論】印と買い目</h2>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>印</th>
                    <th>馬番</th>
                    <th>馬名</th>
                    <th>単勝オッズ</th>
                    <th>AI 勝率</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisResult.horse_ratings && analysisResult.horse_ratings.map((horse: any, index: number) => (
                    <tr key={index}>
                      <td>
                        {horse.mark === '◎' && <div className="mark-circle">◎</div>}
                        {horse.mark === '○' && <div className="mark-circle" style={{ backgroundColor: 'var(--primary)' }}>○</div>}
                        {horse.mark === '▲' && <div className="mark-triangle"><span>▲</span></div>}
                        {horse.mark === '△' && <div className="mark-triangle" style={{ borderBottomColor: 'var(--primary)' }}><span>△</span></div>}
                        {horse.mark === '☆' && <div className="mark-star">☆</div>}
                        {!['◎', '○', '▲', '△', '☆'].includes(horse.mark) && horse.mark}
                      </td>
                      <td>{horse.number || '-'}</td>
                      <td>{horse.name || '-'}</td>
                      <td>{horse.odds || '-'}</td>
                      <td>{horse.win_probability || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="analysis-section">
            <h2 className="analysis-section-title">【展開分析】</h2>
            <p className="mb-3"><strong>ペース想定：</strong>{analysisResult.race_analysis?.pace_prediction || '情報なし'}</p>
            <p>{analysisResult.race_analysis?.race_development || '情報なし'}</p>
          </div>
          
          <div className="analysis-section">
            <h2 className="analysis-section-title">【補足ポイント】</h2>
            
            <h3 className="mb-2">馬場状態</h3>
            <p className="mb-4">{analysisResult.race_analysis?.track_bias_analysis || '情報なし'}</p>
            
            <h3 className="mb-2">穴馬候補</h3>
            <p className="mb-4">{analysisResult.longshots_analysis || '情報なし'}</p>
            
            <h3 className="mb-2">危険人気馬</h3>
            <p>{analysisResult.overrated_horses || '情報なし'}</p>
          </div>
          
          <div className="alert alert-warning mt-4">
            <p className="mb-0">※本稿は投資判断の助言を目的としたものではありません。購入は自己責任で。</p>
          </div>
          
          <div className="mt-4">
            <Link href="/analyze" className="btn btn-primary">
              新しい分析を開始
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// メインページコンポーネント
export default function AnalysisResultPage() {
  return (
    <Suspense fallback={<ResultLoader />}>
      <AnalysisResultContent />
    </Suspense>
  );
}
