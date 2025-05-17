'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをログに記録
    console.error('アプリケーションエラー:', error);
  }, [error]);

  return (
    <div className="page-content">
      <div className="container py-5 text-center">
        <div className="mb-5">
          <Image 
            src="/logo.png" 
            alt="DeepStride競馬AI" 
            width={300} 
            height={60} 
            priority
            className="mb-4"
          />
        </div>
        
        <div className="card">
          <div className="card-body py-5">
            <h1 className="mb-4">エラーが発生しました</h1>
            <p className="mb-4">
              申し訳ありませんが、予期せぬエラーが発生しました。
              もう一度お試しいただくか、別のページをご利用ください。
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button
                onClick={reset}
                className="btn btn-primary"
              >
                もう一度試す
              </button>
              <Link href="/" className="btn btn-outline">
                ホームページへ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
