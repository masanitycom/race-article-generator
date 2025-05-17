'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle, signInWithTwitter } = useAuth();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    // パスワード確認
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      setIsLoading(false);
      return;
    }

    try {
      await signUpWithEmail(email, password, name);
      setSuccessMessage('登録が完了しました。自動返信メールをご確認ください。');
      
      // 3秒後にログインページへリダイレクト
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 3000);
    } catch (err: any) {
      console.error('登録エラー:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('このメールアドレスは既に登録されています');
      } else if (err.code === 'auth/invalid-email') {
        setError('無効なメールアドレスです');
      } else if (err.code === 'auth/weak-password') {
        setError('パスワードが弱すぎます。8文字以上の英数字を入力してください');
      } else {
        setError(err.message || '登録中にエラーが発生しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      router.push('/analyze');
    } catch (err: any) {
      console.error('Googleサインアップエラー:', err);
      setError('Googleでの登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitterSignUp = async () => {
    setIsLoading(true);
    setError('');

    try {
      await signInWithTwitter();
      router.push('/analyze');
    } catch (err: any) {
      console.error('Twitterサインアップエラー:', err);
      setError('Twitterでの登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">新規登録</h1>
          <p className="auth-subtitle">アカウントを作成して、AI競馬予想を始めましょう</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <form className="auth-form" onSubmit={handleEmailSignUp}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">お名前</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">メールアドレス</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">パスワード</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <div className="form-text">8文字以上の英数字を入力してください</div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">パスワード（確認）</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner me-2"></span>
                登録中...
              </>
            ) : (
              'アカウント作成'
            )}
          </button>
        </form>

        <div className="social-login">
          <p className="social-login-text">または</p>
          <button
            className="btn btn-social btn-google"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            Googleで登録
          </button>
          <button
            className="btn btn-social btn-twitter"
            onClick={handleTwitterSignUp}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.46,6c-0.77,0.35-1.6,0.58-2.46,0.69c0.88-0.53,1.56-1.37,1.88-2.38c-0.83,0.5-1.75,0.85-2.72,1.05C18.37,4.5,17.26,4,16,4c-2.35,0-4.27,1.92-4.27,4.29c0,0.34,0.04,0.67,0.11,0.98C8.28,9.09,5.11,7.38,3,4.79c-0.37,0.63-0.58,1.37-0.58,2.15c0,1.49,0.75,2.81,1.91,3.56c-0.71,0-1.37-0.2-1.95-0.5c0,0.02,0,0.03,0,0.05c0,2.08,1.48,3.82,3.44,4.21c-0.36,0.1-0.74,0.15-1.13,0.15c-0.27,0-0.54-0.03-0.8-0.08c0.54,1.69,2.11,2.95,3.98,2.98c-1.46,1.16-3.31,1.84-5.33,1.84c-0.34,0-0.68-0.02-1.02-0.06C3.44,20.29,5.7,21,8.12,21C16,21,20.33,14.46,20.33,8.79c0-0.19,0-0.37-0.01-0.56C21.17,7.65,21.88,6.87,22.46,6z"/>
            </svg>
            Twitterで登録
          </button>
        </div>

        <div className="auth-footer">
          <p>
            すでにアカウントをお持ちの方は
            <Link href="/login" className="auth-link">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
