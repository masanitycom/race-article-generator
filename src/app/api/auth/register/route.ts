import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import crypto from 'crypto';
import { z } from 'zod';
import nodemailer from 'nodemailer';

// 動的レンダリングを強制するための設定
export const dynamic = 'force-dynamic';

// 登録用のスキーマ
const registerSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上必要です'),
});

// メール送信関数
async function sendVerificationEmail(email: string, name: string, verificationToken: string) {
  try {
    // 本番環境では実際のSMTPサーバーを設定
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || 'smtp.example.com',
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: process.env.EMAIL_SERVER_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_SERVER_USER || 'user@example.com',
        pass: process.env.EMAIL_SERVER_PASSWORD || 'password',
      },
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"AI競馬予想システム" <noreply@example.com>',
      to: email,
      subject: 'AI競馬予想システム - メールアドレスの確認',
      text: `${name}様\n\nAI競馬予想システムへのご登録ありがとうございます。\n\n以下のリンクをクリックして、メールアドレスを確認してください：\n${verificationUrl}\n\nこのリンクは24時間有効です。\n\nAI競馬予想システム`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">AI競馬予想システム</h2>
          <p>${name}様</p>
          <p>AI競馬予想システムへのご登録ありがとうございます。</p>
          <p>以下のボタンをクリックして、メールアドレスを確認してください：</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">メールアドレスを確認</a>
          </p>
          <p>このリンクは24時間有効です。</p>
          <p>AI競馬予想システム</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('メール送信エラー:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得
    const body = await request.json();
    
    // 入力値の検証
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: '入力値が不正です', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { name, email, password } = result.data;
    
    // メールアドレスの重複チェック
    const existingUser = await kv.get(`user:email:${email}`);
    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 409 }
      );
    }
    
    // パスワードのハッシュ化
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');
    
    // ユーザーIDの生成
    const userId = crypto.randomBytes(16).toString('hex');
    
    // 確認トークンの生成
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24時間後
    
    // ユーザー情報の保存
    await kv.set(`user:${userId}`, {
      id: userId,
      name,
      email,
      password: {
        hash,
        salt,
      },
      emailVerified: false,
      createdAt: Date.now(),
    });
    
    // メールアドレスとユーザーIDのマッピング
    await kv.set(`user:email:${email}`, userId);
    
    // 確認トークンの保存
    await kv.set(`verification:${verificationToken}`, {
      userId,
      email,
      expires: tokenExpiry,
    });
    
    // 確認メールの送信
    const emailSent = await sendVerificationEmail(email, name, verificationToken);
    
    return NextResponse.json({
      success: true,
      userId,
      emailSent,
      message: '登録が完了しました。確認メールを送信しました。',
    });
  } catch (error) {
    console.error('登録エラー:', error);
    return NextResponse.json(
      { error: '登録中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
