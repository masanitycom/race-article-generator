'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  // 5秒後にホームページにリダイレクト
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

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
            <h1 className="mb-4">404 - ページが見つかりません</h1>
            <p className="mb-4">
              お探しのページは存在しないか、移動した可能性があります。
              5秒後にホームページに自動的にリダイレクトします。
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link href="/" className="btn btn-primary">
                ホームページへ
              </Link>
              <Link href="/analyze" className="btn btn-outline">
                レース分析へ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
