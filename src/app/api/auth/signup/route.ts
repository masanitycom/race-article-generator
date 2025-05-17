import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { hash } from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

// メール送信関数
async function sendVerificationEmail(email: string, name: string, token: string) {
  try {
    // 環境変数からSMTP設定を取得
    const host = process.env.EMAIL_SERVER_HOST;
    const port = parseInt(process.env.EMAIL_SERVER_PORT || '587');
    const user = process.env.EMAIL_SERVER_USER;
    const pass = process.env.EMAIL_SERVER_PASSWORD;
    const from = process.env.EMAIL_FROM;

    // SMTP設定が不完全な場合はログに記録して処理を続行
    if (!host || !user || !pass || !from) {
      console.warn('メール設定が不完全です。メール送信をスキップします。');
      return;
    }

    // トランスポーターの作成
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    // 確認URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

    // メール内容
    await transporter.sendMail({
      from: `"DeepStride競馬AI" <${from}>`,
      to: email,
      subject: 'DeepStride競馬AI - メールアドレスの確認',
      text: `${name}様\n\nDeepStride競馬AIへのご登録ありがとうございます。\n\n以下のリンクをクリックして、メールアドレスを確認してください：\n\n${verificationUrl}\n\nこのリンクは24時間有効です。\n\nDeepStride競馬AIチーム`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #0088cc;">DeepStride競馬AI</h1>
          </div>
          <p>こんにちは、${name}様</p>
          <p>DeepStride競馬AIへのご登録ありがとうございます。</p>
          <p>以下のボタンをクリックして、メールアドレスを確認してください：</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #0088cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">メールアドレスを確認する</a>
          </div>
          <p>このリンクは24時間有効です。</p>
          <p>もしボタンが機能しない場合は、以下のURLをブラウザにコピー＆ペーストしてください：</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>このメールにお心当たりがない場合は、無視していただいて構いません。</p>
            <p>&copy; ${new Date().getFullYear()} DeepStride競馬AI</p>
          </div>
        </div>
      `,
    });

    console.log(`確認メールを送信しました: ${email}`);
  } catch (error) {
    console.error('メール送信エラー:', error);
    // メール送信エラーは致命的ではないため、処理を続行
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('新規登録APIが呼び出されました');
    
    // リクエストボディの解析
    const body = await request.json();
    const { name, email, password } = body;

    // 必須フィールドの検証
    if (!name || !email || !password) {
      console.log('必須フィールドが不足しています');
      return NextResponse.json(
        { error: '名前、メールアドレス、パスワードは必須です' },
        { status: 400 }
      );
    }

    // パスワードの長さ検証
    if (password.length < 8) {
      console.log('パスワードが短すぎます');
      return NextResponse.json(
        { error: 'パスワードは8文字以上である必要があります' },
        { status: 400 }
      );
    }

    // メールアドレスの形式検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('無効なメールアドレス形式です');
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください' },
        { status: 400 }
      );
    }

    try {
      // 既存ユーザーの確認
      const existingUser = await kv.hgetall(`user:email:${email}`);
      if (existingUser) {
        console.log('既存ユーザーが見つかりました');
        return NextResponse.json(
          { error: 'このメールアドレスは既に登録されています' },
          { status: 409 }
        );
      }
    } catch (kvError) {
      console.error('KVデータベースエラー (ユーザー確認):', kvError);
      // KVエラーの場合でも処理を続行（新規ユーザーとして扱う）
    }

    // パスワードのハッシュ化
    const hashedPassword = await hash(password, 10);

    // ユーザーIDの生成
    const userId = crypto.randomUUID();

    // 確認トークンの生成
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24時間後

    // ユーザーデータの作成
    const userData = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
      createdAt: Date.now(),
    };

    try {
      // ユーザーデータの保存
      await kv.hset(`user:${userId}`, userData);
      await kv.set(`user:email:${email}`, userId);
      await kv.set(`verification:${verificationToken}`, {
        userId,
        email,
        expires: tokenExpiry,
      });

      console.log('ユーザーデータを保存しました:', userId);
    } catch (kvError) {
      console.error('KVデータベースエラー (ユーザー保存):', kvError);
      return NextResponse.json(
        { error: 'ユーザー登録中にエラーが発生しました。しばらくしてからもう一度お試しください。' },
        { status: 500 }
      );
    }

    // 確認メールの送信
    await sendVerificationEmail(email, name, verificationToken);

    // 成功レスポンス
    return NextResponse.json(
      { 
        message: '登録が完了しました。確認メールをご確認ください。',
        userId 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('新規登録エラー:', error);
    return NextResponse.json(
      { error: '登録処理中にエラーが発生しました。しばらくしてからもう一度お試しください。' },
      { status: 500 }
    );
  }
}
