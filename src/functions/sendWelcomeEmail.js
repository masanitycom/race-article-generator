// src/functions/sendWelcomeEmail.js
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// メール送信用のトランスポーター設定
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: process.env.EMAIL_SERVER_PORT === '465',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// 新規ユーザー登録時のウェルカムメール送信
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  try {
    // ユーザー情報の取得
    const { email, displayName } = user;
    const userName = displayName || 'ユーザー様';
    
    // メール送信
    await transporter.sendMail({
      from: `"DeepStride競馬AI" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'DeepStride競馬AI - ご登録ありがとうございます',
      text: `${userName}様\n\nDeepStride競馬AIへのご登録ありがとうございます。\n\nAIによる競馬予想をお楽しみください。\n\nDeepStride競馬AIチーム`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #0088cc;">DeepStride競馬AI</h1>
          </div>
          <p>こんにちは、${userName}様</p>
          <p>DeepStride競馬AIへのご登録ありがとうございます。</p>
          <p>AIによる競馬予想をお楽しみください。</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}" style="background-color: #0088cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">サイトにアクセスする</a>
          </div>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} DeepStride競馬AI</p>
          </div>
        </div>
      `,
    });
    
    console.log(`ウェルカムメールを送信しました: ${email}`);
    return null;
  } catch (error) {
    console.error('メール送信エラー:', error);
    return null;
  }
});
