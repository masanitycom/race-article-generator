'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="page-content">
      <div className="container py-5">
        <div className="analysis-container text-center">
          <h1 className="mb-4">ページが見つかりません</h1>
          <p className="mb-4">お探しのページは存在しないか、移動した可能性があります。</p>
          <button 
            onClick={() => router.push('/')}
            className="btn btn-primary"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
