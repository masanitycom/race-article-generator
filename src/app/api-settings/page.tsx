'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { useApiKeys } from '../../hooks/useFirestore';

export default function ApiSettingsPage() {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [provider, setProvider] = useState('openai');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { 
    keys, 
    loading: keysLoading, 
    error: keysError, 
    addApiKey, 
    deleteApiKey 
  } = useApiKeys();

  // 認証状態の確認
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=api-settings');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await addApiKey(name, key, provider);
      setSuccessMessage('APIキーが正常に追加されました');
      setName('');
      setKey('');
    } catch (err: any) {
      console.error('APIキー追加エラー:', err);
      setError(err.message || 'APIキーの追加に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (keyId: string) => {
    if (!confirm('このAPIキーを削除してもよろしいですか？')) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await deleteApiKey(keyId);
      setSuccessMessage('APIキーが正常に削除されました');
    } catch (err: any) {
      console.error('APIキー削除エラー:', err);
      setError(err.message || 'APIキーの削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 認証中またはキー読み込み中はローディング表示
  if (authLoading || keysLoading) {
    return (
      <div className="page-content">
        <div className="loading-container">
          <div className="spinner large"></div>
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="settings-container">
        <div className="settings-header">
          <h1 className="settings-title">API設定</h1>
          <p className="settings-subtitle">レース分析に使用するAPIキーを管理します</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {keysError && (
          <div className="alert alert-danger" role="alert">
            {keysError}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header">
            <h2 className="card-title">APIキー追加</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">名前</label>
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
                <label htmlFor="key" className="form-label">APIキー</label>
                <input
                  type="password"
                  className="form-control"
                  id="key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="provider" className="form-label">プロバイダー</label>
                <select
                  className="form-control"
                  id="provider"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  required
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="google">Google AI</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner me-2"></span>
                    追加中...
                  </>
                ) : (
                  'APIキーを追加'
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">登録済みAPIキー</h2>
          </div>
          <div className="card-body">
            {keys.length === 0 ? (
              <p className="text-muted">登録されているAPIキーはありません</p>
            ) : (
              <div className="api-keys-list">
                {keys.map((apiKey) => (
                  <div key={apiKey.id} className="api-key-item">
                    <div className="api-key-info">
                      <h3 className="api-key-name">{apiKey.name}</h3>
                      <p className="api-key-provider">{apiKey.provider}</p>
                      <p className="api-key-date">
                        追加日: {new Date(apiKey.createdAt).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <div className="api-key-actions">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(apiKey.id)}
                        disabled={isLoading}
                      >
                        削除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="settings-footer">
          <Link href="/analyze" className="btn btn-outline-primary">
            分析ページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
