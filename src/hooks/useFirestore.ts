'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryDocumentSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

// APIキー管理フック
export function useApiKeys() {
  const { user } = useAuth();
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // APIキーの取得
  const fetchApiKeys = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const keysRef = collection(db, 'apiKeys', user.uid, 'keys');
      const q = query(keysRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const keysList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setKeys(keysList);
    } catch (err: any) {
      console.error('APIキー取得エラー:', err);
      setError(err.message || 'APIキーの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // APIキーの追加
  const addApiKey = async (name: string, key: string, provider: string) => {
    if (!user) throw new Error('認証が必要です');
    
    try {
      const keysRef = collection(db, 'apiKeys', user.uid, 'keys');
      const newKey = await addDoc(keysRef, {
        name,
        key,
        provider,
        createdAt: serverTimestamp(),
        lastUsed: null
      });
      
      await fetchApiKeys();
      return newKey.id;
    } catch (err: any) {
      console.error('APIキー追加エラー:', err);
      throw new Error(err.message || 'APIキーの追加に失敗しました');
    }
  };

  // APIキーの更新
  const updateApiKey = async (keyId: string, data: any) => {
    if (!user) throw new Error('認証が必要です');
    
    try {
      const keyRef = doc(db, 'apiKeys', user.uid, 'keys', keyId);
      await updateDoc(keyRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      await fetchApiKeys();
    } catch (err: any) {
      console.error('APIキー更新エラー:', err);
      throw new Error(err.message || 'APIキーの更新に失敗しました');
    }
  };

  // APIキーの削除
  const deleteApiKey = async (keyId: string) => {
    if (!user) throw new Error('認証が必要です');
    
    try {
      const keyRef = doc(db, 'apiKeys', user.uid, 'keys', keyId);
      await deleteDoc(keyRef);
      
      await fetchApiKeys();
    } catch (err: any) {
      console.error('APIキー削除エラー:', err);
      throw new Error(err.message || 'APIキーの削除に失敗しました');
    }
  };

  // APIキーの使用記録更新
  const updateApiKeyUsage = async (keyId: string) => {
    if (!user) return;
    
    try {
      const keyRef = doc(db, 'apiKeys', user.uid, 'keys', keyId);
      await updateDoc(keyRef, {
        lastUsed: serverTimestamp()
      });
    } catch (err) {
      console.error('APIキー使用記録更新エラー:', err);
      // 非クリティカルなエラーなので、例外はスローしない
    }
  };

  // ユーザー認証状態が変わったらAPIキーを再取得
  useEffect(() => {
    if (user) {
      fetchApiKeys();
    } else {
      setKeys([]);
      setLoading(false);
    }
  }, [user]);

  return {
    keys,
    loading,
    error,
    fetchApiKeys,
    addApiKey,
    updateApiKey,
    deleteApiKey,
    updateApiKeyUsage
  };
}

// レース分析結果管理フック
export function useRaceAnalyses() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 分析結果の取得
  const fetchAnalyses = async (limit = 10) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const analysesRef = collection(db, 'analyses', user.uid, 'results');
      const q = query(analysesRef, orderBy('date', 'desc'), limit(limit));
      const snapshot = await getDocs(q);
      
      const analysesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setAnalyses(analysesList);
    } catch (err: any) {
      console.error('分析結果取得エラー:', err);
      setError(err.message || '分析結果の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 分析結果の取得（単一）
  const fetchAnalysis = async (analysisId: string) => {
    if (!user) throw new Error('認証が必要です');
    
    try {
      const analysisRef = doc(db, 'analyses', user.uid, 'results', analysisId);
      const snapshot = await getDoc(analysisRef);
      
      if (!snapshot.exists()) {
        throw new Error('分析結果が見つかりません');
      }
      
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    } catch (err: any) {
      console.error('分析結果取得エラー:', err);
      throw new Error(err.message || '分析結果の取得に失敗しました');
    }
  };

  // 分析結果の保存
  const saveAnalysis = async (raceName: string, raceData: any, result: any) => {
    if (!user) throw new Error('認証が必要です');
    
    try {
      const analysesRef = collection(db, 'analyses', user.uid, 'results');
      const newAnalysis = await addDoc(analysesRef, {
        raceName,
        date: serverTimestamp(),
        status: 'completed',
        raceData,
        result
      });
      
      await fetchAnalyses();
      return newAnalysis.id;
    } catch (err: any) {
      console.error('分析結果保存エラー:', err);
      throw new Error(err.message || '分析結果の保存に失敗しました');
    }
  };

  // 分析結果の削除
  const deleteAnalysis = async (analysisId: string) => {
    if (!user) throw new Error('認証が必要です');
    
    try {
      const analysisRef = doc(db, 'analyses', user.uid, 'results', analysisId);
      await deleteDoc(analysisRef);
      
      await fetchAnalyses();
    } catch (err: any) {
      console.error('分析結果削除エラー:', err);
      throw new Error(err.message || '分析結果の削除に失敗しました');
    }
  };

  // ユーザー認証状態が変わったら分析結果を再取得
  useEffect(() => {
    if (user) {
      fetchAnalyses();
    } else {
      setAnalyses([]);
      setLoading(false);
    }
  }, [user]);

  return {
    analyses,
    loading,
    error,
    fetchAnalyses,
    fetchAnalysis,
    saveAnalysis,
    deleteAnalysis
  };
}
