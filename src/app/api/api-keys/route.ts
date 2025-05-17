import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';
import { kv } from '@vercel/kv';
import { z } from 'zod';
import crypto from 'crypto';

// APIキー保存用のスキーマ
const apiKeySchema = z.object({
  api_key: z.string().min(1, 'APIキーは必須です'),
});

// APIキーのマスク表示（最初と最後の数文字のみ表示）
function maskApiKey(apiKey: string) {
  if (!apiKey) {
    return '';
  }
  if (apiKey.length <= 8) {
    return '****';
  }
  return apiKey.slice(0, 4) + '****' + apiKey.slice(-4);
}

// APIキーの暗号化
function encryptApiKey(apiKey: string, userId: string) {
  // 実際の実装では、より安全な方法で暗号化キーを管理する必要があります
  const encryptionKey = process.env.ENCRYPTION_KEY || userId;
  const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

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

// APIキー取得
export async function GET() {
  try {
    // セッションの取得
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    
    // ユーザーIDの確認
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが取得できません' },
        { status: 500 }
      );
    }
    
    // APIキーの取得
    const apiKeys = await kv.get(`api_keys:${userId}`) as any;
    const apiKey = apiKeys?.api_key || '';
    
    return NextResponse.json({
      api_key_set: !!apiKey,
      masked_api_key: maskApiKey(apiKey),
      last_verified: apiKeys?.last_verified || '',
    });
  } catch (error) {
    console.error('APIキー取得エラー:', error);
    return NextResponse.json(
      { error: 'APIキーの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// APIキー保存
export async function POST(request: NextRequest) {
  try {
    // セッション確認
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    
    // ユーザーIDの確認
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが取得できません' },
        { status: 500 }
      );
    }
    
    // リクエストボディの取得
    const body = await request.json();
    
    // 入力値の検証
    const result = apiKeySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: '入力値が不正です', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { api_key } = result.data;
    
    // APIキーの暗号化と保存
    const encryptedApiKey = encryptApiKey(api_key, userId);
    
    await kv.set(`api_keys:${userId}`, {
      api_key: encryptedApiKey,
      updated_at: new Date().toISOString(),
    });
    
    return NextResponse.json({
      success: true,
      masked_api_key: maskApiKey(api_key),
    });
  } catch (error) {
    console.error('APIキー保存エラー:', error);
    return NextResponse.json(
      { error: 'APIキーの保存中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
