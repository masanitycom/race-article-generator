'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, twitterProvider } from '../lib/firebase';

// 認証コンテキストの型定義
type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signInWithTwitter: () => Promise<User>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<User>;
  logout: () => Promise<void>;
};

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 認証プロバイダーコンポーネント
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        // ユーザードキュメントの存在確認
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        // ユーザードキュメントが存在しない場合は作成
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            displayName: user.displayName || 'ユーザー',
            email: user.email,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
          });
        } else {
          // 最終ログイン時間の更新
          await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // メール/パスワードでサインイン
  const signInWithEmail = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  // Googleでサインイン
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  // Twitterでサインイン
  const signInWithTwitter = async () => {
    const result = await signInWithPopup(auth, twitterProvider);
    return result.user;
  };

  // メール/パスワードで新規登録
  const signUpWithEmail = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // ユーザープロファイルの作成
    await setDoc(doc(db, 'users', result.user.uid), {
      displayName: name,
      email: result.user.email,
      photoURL: null,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
    
    return result.user;
  };

  // ログアウト
  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    loading,
    signInWithEmail,
    signInWithGoogle,
    signInWithTwitter,
    signUpWithEmail,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 認証コンテキストを使用するためのフック
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
