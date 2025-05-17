'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
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
          <div className="spinner" style={{ width: '3rem', height: '3rem', borderWidth: '0.3rem', borderTopColor: 'var(--primary)' }}></div>
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
          メールアドレスの確認が完了しました。ログインしてAI競馬予想システムをご利用いただけます。
        </p>
        <Link href="/login" className="btn btn-primary">
          ログインページへ
        </Link>
      </div>
    </div>
  );
}
