'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // エラーをログに記録
    console.error(error);
  }, [error]);

  return (
    <div className="page-content">
      <div className="container py-5">
        <div className="analysis-container text-center">
          <h1 className="mb-4">エラーが発生しました</h1>
          <p className="mb-4">申し訳ありませんが、予期せぬエラーが発生しました。</p>
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => reset()}
              className="btn btn-primary"
            >
              再試行
            </button>
            <button 
              onClick={() => router.push('/')}
              className="btn btn-outline"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
