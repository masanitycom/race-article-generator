import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import crypto from 'crypto';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('メール確認APIが呼び出されました');
    
    // URLからトークンを取得
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      console.log('トークンが見つかりません');
      return NextResponse.json(
        { error: '確認トークンが見つかりません' },
        { status: 400 }
      );
    }

    // トークン情報の取得
    const verification = await kv.get(`verification:${token}`);
    
    if (!verification || typeof verification !== 'object') {
      console.log('無効なトークンです');
      return NextResponse.json(
        { error: '無効または期限切れのトークンです' },
        { status: 400 }
      );
    }

    const { userId, expires } = verification as { userId: string; expires: number };

    // トークンの有効期限チェック
    if (Date.now() > expires) {
      console.log('トークンの期限が切れています');
      return NextResponse.json(
        { error: 'トークンの期限が切れています。新しいトークンをリクエストしてください。' },
        { status: 400 }
      );
    }

    // ユーザー情報の取得
    const userData = await kv.hgetall(`user:${userId}`);
    
    if (!userData) {
      console.log('ユーザーが見つかりません');
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // メール確認ステータスの更新
    await kv.hset(`user:${userId}`, {
      emailVerified: true,
      emailVerifiedAt: Date.now(),
    });

    // 使用済みトークンの削除
    await kv.del(`verification:${token}`);

    console.log('メールアドレスが確認されました:', userId);

    // 成功レスポンス
    return NextResponse.json(
      { message: 'メールアドレスが確認されました' },
      { status: 200 }
    );
  } catch (error) {
    console.error('メール確認エラー:', error);
    return NextResponse.json(
      { error: '確認処理中にエラーが発生しました。しばらくしてからもう一度お試しください。' },
      { status: 500 }
    );
  }
}
