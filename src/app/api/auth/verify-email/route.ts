import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// 動的レンダリングを強制するための設定
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // クエリパラメータの取得
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: '確認トークンが見つかりません' },
        { status: 400 }
      );
    }
    
    // トークン情報の取得
    const verification = await kv.get(`verification:${token}`) as any;
    
    if (!verification) {
      return NextResponse.json(
        { error: '無効または期限切れのトークンです' },
        { status: 400 }
      );
    }
    
    // トークンの有効期限チェック
    if (verification.expires < Date.now()) {
      return NextResponse.json(
        { error: 'トークンの有効期限が切れています' },
        { status: 400 }
      );
    }
    
    // ユーザー情報の取得
    const userId = verification.userId;
    const user = await kv.get(`user:${userId}`) as any;
    
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }
    
    // メール確認ステータスの更新
    await kv.set(`user:${userId}`, {
      ...user,
      emailVerified: true,
      updatedAt: Date.now(),
    });
    
    // 使用済みトークンの削除
    await kv.del(`verification:${token}`);
    
    return NextResponse.json({
      success: true,
      message: 'メールアドレスが確認されました',
    });
  } catch (error) {
    console.error('メール確認エラー:', error);
    return NextResponse.json(
      { error: 'メールアドレスの確認中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
