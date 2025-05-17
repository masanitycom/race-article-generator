import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { kv } from '@vercel/kv';
import OpenAI from 'openai';
import crypto from 'crypto';

// APIキーの復号化
function decryptApiKey(encryptedApiKey: string, userId: string) {
  try {
    const encryptionKey = process.env.ENCRYPTION_KEY || userId;
    const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
    let decrypted = decipher.update(encryptedApiKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('APIキー復号化エラー:', error);
    return '';
  }
}

export async function POST() {
  try {
    // セッションの取得
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    
    // APIキーの取得
    const apiKeys = await kv.get(`api_keys:${session.user.id}`) as any;
    const encryptedApiKey = apiKeys?.api_key || '';
    
    if (!encryptedApiKey) {
      return NextResponse.json(
        { error: 'APIキーが設定されていません' },
        { status: 400 }
      );
    }
    
    // APIキーの復号化
    const apiKey = decryptApiKey(encryptedApiKey, session.user.id);
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'APIキーの復号化に失敗しました' },
        { status: 500 }
      );
    }
    
    // OpenAI APIのテスト
    const client = new OpenAI({ apiKey });
    const response = await client.models.list();
    
    // テスト成功
    await kv.set(`api_keys:${session.user.id}`, {
      ...apiKeys,
      last_verified: new Date().toISOString(),
      status: 'active',
    });
    
    return NextResponse.json({
      success: true,
      model: 'gpt-4o' in response.data.map(model => model.id) ? 'gpt-4o' : 'Available',
    });
  } catch (error) {
    console.error('APIキーテストエラー:', error);
    return NextResponse.json(
      { error: `APIキーのテストに失敗しました: ${error}` },
      { status: 500 }
    );
  }
}
