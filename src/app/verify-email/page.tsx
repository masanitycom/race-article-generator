'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// ローディングコンポーネント
function Loading() {
  return (
    <div className="page-content">
      <div className="verification-container">
        <div className="spinner" style={{ width: '3rem', height: '3rem', borderWidth: '0.3rem', borderTopColor: 'var(--primary)', margin: '0 auto' }}></div>
        <h1 className="verification-title mt-4">メールアドレスを確認中...</h1>
        <p className="verification-message">しばらくお待ちください</p>
      </div>
    </div>
  );
}

// メール確認コンポーネント
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!token) {
      setError('確認トークンが見つかりません');
      setIsLoading(false);
      return;
    }
    
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: 'GET',
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'メールアドレスの確認に失敗しました');
        }
        
        setIsVerified(true);
      } catch (err: any) {
        setError(err.message || 'メールアドレスの確認中にエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyEmail();
  }, [token]);
  
  if (isLoading) {
    return (
      <div className="page-content">
        <div className="verification-container">
          <div className="spinner" style={{ width: '3rem', height: '3rem', borderWidth: '0.3rem', borderTopColor: 'var(--primary)', margin: '0 auto' }}></div>
          <h1 className="verification-title mt-4">メールアドレスを確認中...</h1>
          <p className="verification-message">しばらくお待ちください</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="page-content">
        <div className="verification-container">
          <div className="verification-icon">❌</div>
          <h1 className="verification-title">確認エラー</h1>
          <p className="verification-message">{error}</p>
          <Link href="/register" className="btn btn-primary">
            新規登録ページに戻る
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-content">
      <div className="verification-container">
        <div className="verification-icon">✅</div>
        <h1 className="verification-title">メールアドレスが確認されました</h1>
        <p className="verification-message">
          メールアドレスの確認が完了しました。ログインしてDeepStride競馬AIをご利用いただけます。
        </p>
        <Link href="/login" className="btn btn-primary">
          ログインページへ
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
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
          <h1 className="mb-3">メールアドレス確認</h1>
        </div>
        
        <Suspense fallback={<Loading />}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
