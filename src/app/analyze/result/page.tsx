'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// ローディングコンポーネント
function Loading() {
  return (
    <div className="text-center py-5">
      <div className="spinner" style={{ width: '3rem', height: '3rem', borderWidth: '0.3rem', borderTopColor: 'var(--primary)', margin: '0 auto' }}></div>
      <p className="mt-3">分析結果を読み込み中...</p>
    </div>
  );
}

// 分析結果表示コンポーネント
function AnalysisResult() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!sessionId) {
      setError('セッションIDが見つかりません');
      setStatus('error');
      return;
    }
    
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/analyze?session_id=${sessionId}`);
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'レース分析結果の取得に失敗しました');
        }
        
        const data = await response.json();
        
        // 分析中の場合は定期的に再取得
        if (data.status === 'pending' || data.status === 'processing') {
          setStatus(data.status);
          setTimeout(fetchResult, 3000);
          return;
        }
        
        setResult(data);
        setStatus('completed');
      } catch (err: any) {
        setError(err.message || 'レース分析結果の取得中にエラーが発生しました');
        setStatus('error');
      }
    };
    
    fetchResult();
  }, [sessionId]);
  
  if (status === 'loading' || status === 'pending' || status === 'processing') {
    return (
      <div className="analysis-container">
        <div className="analysis-header">
          <h1 className="analysis-title">
            {status === 'loading' ? 'レース分析結果を読み込み中...' : 
             status === 'pending' ? 'レース分析を準備中...' : 
             'レース分析を実行中...'}
          </h1>
          <p className="analysis-meta">
            {status === 'processing' ? 'AIがレース情報を分析しています。これには数分かかる場合があります。' : 
             '分析リクエストを処理しています。しばらくお待ちください。'}
          </p>
        </div>
        <div className="text-center py-5">
          <div className="spinner" style={{ width: '4rem', height: '4rem', borderWidth: '0.4rem', borderTopColor: 'var(--primary)', margin: '0 auto' }}></div>
          <p className="mt-4">
            {status === 'processing' ? 
              '最新のレース情報、出走馬データ、血統情報などを分析中...' : 
              '分析の準備中...'}
          </p>
        </div>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="analysis-container">
        <div className="analysis-header">
          <h1 className="analysis-title">エラーが発生しました</h1>
        </div>
        <div className="alert alert-danger">
          {error}
        </div>
        <div className="mt-4">
          <Link href="/analyze" className="btn btn-primary">
            分析ページに戻る
          </Link>
        </div>
      </div>
    );
  }
  
  // 分析結果の表示
  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <h1 className="analysis-title">{result.race_name} 分析結果</h1>
        <p className="analysis-meta">
          {result.race_date ? `レース日: ${result.race_date}` : ''}
          {result.race_date ? ' | ' : ''}
          分析日時: {new Date().toLocaleString()}
        </p>
      </div>
      
      {/* 馬評価セクション */}
      <div className="analysis-section">
        <h2 className="analysis-section-title">馬評価</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>印</th>
                <th>馬番</th>
                <th>馬名</th>
                <th>オッズ</th>
                <th>勝率予測</th>
              </tr>
            </thead>
            <tbody>
              {result.horse_ratings && result.horse_ratings.map((horse: any, index: number) => (
                <tr key={index}>
                  <td>
                    {horse.mark === '◎' && <div className="mark-circle">◎</div>}
                    {horse.mark === '○' && <div className="mark-circle" style={{ backgroundColor: 'var(--primary)' }}>○</div>}
                    {horse.mark === '▲' && <div className="mark-triangle"><span>▲</span></div>}
                    {horse.mark === '△' && <div className="mark-diamond"><span>△</span></div>}
                    {!['◎', '○', '▲', '△'].includes(horse.mark) && horse.mark}
                  </td>
                  <td>{horse.number}</td>
                  <td>{horse.name}</td>
                  <td>{horse.odds}</td>
                  <td>{horse.win_probability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* レース分析セクション */}
      {result.race_analysis && (
        <div className="analysis-section">
          <h2 className="analysis-section-title">レース分析</h2>
          <div className="card mb-3">
            <div className="card-body">
              <h3 className="card-title">ペース予想</h3>
              <p>{result.race_analysis.pace_prediction}</p>
            </div>
          </div>
          <div className="card mb-3">
            <div className="card-body">
              <h3 className="card-title">レース展開予想</h3>
              <p>{result.race_analysis.race_development}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">馬場状態分析</h3>
              <p>{result.race_analysis.track_bias_analysis}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* 穴馬分析セクション */}
      {result.longshots_analysis && (
        <div className="analysis-section">
          <h2 className="analysis-section-title">穴馬分析</h2>
          <div className="card">
            <div className="card-body">
              <p>{result.longshots_analysis}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* 人気薄分析セクション */}
      {result.overrated_horses && (
        <div className="analysis-section">
          <h2 className="analysis-section-title">人気薄と思われる馬</h2>
          <div className="card">
            <div className="card-body">
              <p>{result.overrated_horses}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* 買い目提案セクション */}
      {result.betting_suggestions && (
        <div className="analysis-section">
          <h2 className="analysis-section-title">買い目提案</h2>
          <div className="card">
            <div className="card-body">
              <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{result.betting_suggestions}</pre>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-5 text-center">
        <Link href="/analyze" className="btn btn-primary">
          新しいレースを分析
        </Link>
      </div>
    </div>
  );
}

export default function AnalysisResultPage() {
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
          <h1 className="mb-3">AI分析結果</h1>
        </div>
        
        <Suspense fallback={<Loading />}>
          <AnalysisResult />
        </Suspense>
      </div>
    </div>
  );
}
