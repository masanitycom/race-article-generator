import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';
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

// 動的レンダリングを強制するための設定
export const dynamic = 'force-dynamic';

// レース分析リクエスト
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
    const { race_name } = body;
    
    if (!race_name) {
      return NextResponse.json(
        { error: 'レース名は必須です' },
        { status: 400 }
      );
    }
    
    // APIキーの取得
    const apiKeys = await kv.get(`api_keys:${userId}`) as any;
    const encryptedApiKey = apiKeys?.api_key || '';
    
    if (!encryptedApiKey) {
      return NextResponse.json(
        { error: 'APIキーが設定されていません', type: 'api_key_error' },
        { status: 400 }
      );
    }
    
    // APIキーの復号化
    const apiKey = decryptApiKey(encryptedApiKey, userId);
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'APIキーの復号化に失敗しました', type: 'api_key_error' },
        { status: 500 }
      );
    }
    
    // セッションIDの生成
    const sessionId = crypto.randomBytes(16).toString('hex');
    
    // 分析リクエストの保存
    await kv.set(`analysis:${sessionId}`, {
      race_name,
      user_id: userId,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
    
    // バックグラウンドで分析を実行
    analyzeRace(sessionId, race_name, apiKey, userId).catch(error => {
      console.error('レース分析エラー:', error);
    });
    
    return NextResponse.json({
      success: true,
      session_id: sessionId,
    });
  } catch (error) {
    console.error('分析リクエストエラー:', error);
    return NextResponse.json(
      { error: '分析リクエスト中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// レース分析の実行（バックグラウンド処理）
async function analyzeRace(sessionId: string, raceName: string, apiKey: string, userId: string) {
  try {
    // OpenAI APIクライアントの初期化
    const client = new OpenAI({ apiKey });
    
    // 分析ステータスの更新
    await kv.set(`analysis:${sessionId}`, {
      race_name: raceName,
      user_id: userId,
      status: 'processing',
      updated_at: new Date().toISOString(),
    });
    
    // レース情報の収集と分析
    const analysisPrompt = `
あなたは競馬分析のプロフェッショナルです。以下のレースについて、最新の情報を収集し、詳細な分析を行ってください。

レース名: ${raceName}

以下の情報を含めてください：
1. 出走馬情報（馬名、騎手、調教師、オッズなど）
2. 馬場状態と天気予報
3. 各馬の過去の成績と調子
4. 血統分析
5. 展開予想
6. 勝率予測
7. 印（◎○▲△）と買い目

分析結果は以下のJSON形式で返してください：
{
  "race_name": "レース名",
  "race_date": "レース日",
  "horse_ratings": [
    {"mark": "◎", "number": 1, "name": "馬名1", "odds": 2.5, "win_probability": "35%"},
    {"mark": "○", "number": 2, "name": "馬名2", "odds": 4.0, "win_probability": "25%"},
    ...
  ],
  "race_analysis": {
    "pace_prediction": "ハイペース予想",
    "race_development": "展開予想の詳細...",
    "track_bias_analysis": "馬場状態分析..."
  },
  "longshots_analysis": "穴馬候補の分析...",
  "overrated_horses": "人気薄と思われる馬の分析..."
}
`;
    
    // OpenAI APIを使用して分析
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: '競馬分析のプロフェッショナルとして、詳細かつ正確な分析を提供してください。' },
        { role: 'user', content: analysisPrompt }
      ],
      temperature: 0.7,
    });
    
    // レスポンスの解析
    const analysisText = response.choices[0].message.content || '';
    let analysisResult;
    
    try {
      // JSONの抽出
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('JSON形式の分析結果が見つかりません');
      }
    } catch (parseError) {
      console.error('分析結果のパースエラー:', parseError);
      // エラー時はテキスト形式で保存
      analysisResult = {
        error: '分析結果のパースに失敗しました',
        raw_text: analysisText
      };
    }
    
    // 分析結果の保存
    await kv.set(`analysis:${sessionId}`, {
      race_name: raceName,
      user_id: userId,
      status: 'completed',
      result: analysisResult,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('レース分析エラー:', error);
    
    // エラー情報の保存
    await kv.set(`analysis:${sessionId}`, {
      race_name: raceName,
      user_id: userId,
      status: 'error',
      error: error instanceof Error ? error.message : '不明なエラー',
      updated_at: new Date().toISOString(),
    });
  }
}

// 分析結果の取得
export async function GET(request: NextRequest) {
  try {
    // セッション確認
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    
    // クエリパラメータの取得
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'セッションIDは必須です' },
        { status: 400 }
      );
    }
    
    // 分析結果の取得
    const analysis = await kv.get(`analysis:${sessionId}`) as any;
    
    if (!analysis) {
      return NextResponse.json(
        { error: '分析結果が見つかりません' },
        { status: 404 }
      );
    }
    
    // ユーザーIDの確認
    if (analysis.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'この分析結果にアクセスする権限がありません' },
        { status: 403 }
      );
    }
    
    // 分析ステータスの確認
    if (analysis.status === 'error') {
      return NextResponse.json(
        { error: analysis.error || '分析中にエラーが発生しました' },
        { status: 500 }
      );
    }
    
    if (analysis.status === 'pending' || analysis.status === 'processing') {
      return NextResponse.json(
        { status: analysis.status, race_name: analysis.race_name },
        { status: 202 }
      );
    }
    
    // 分析結果の返却
    return NextResponse.json({
      ...analysis.result,
      race_name: analysis.race_name,
      status: analysis.status,
    });
  } catch (error) {
    console.error('分析結果取得エラー:', error);
    return NextResponse.json(
      { error: '分析結果の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
