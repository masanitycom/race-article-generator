import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('レース分析APIが呼び出されました');
    
    // リクエストボディの解析
    const body = await request.json();
    const { raceInfo, apiKeyId, userId } = body;

    // 必須フィールドの検証
    if (!raceInfo) {
      console.log('レース情報が不足しています');
      return NextResponse.json(
        { error: 'レース情報は必須です' },
        { status: 400 }
      );
    }

    if (!apiKeyId || !userId) {
      console.log('APIキーIDまたはユーザーIDが不足しています');
      return NextResponse.json(
        { error: 'APIキーIDとユーザーIDは必須です' },
        { status: 400 }
      );
    }

    // APIキーの取得
    const keyRef = doc(db, 'apiKeys', userId, 'keys', apiKeyId);
    const keyDoc = await getDoc(keyRef);
    
    if (!keyDoc.exists()) {
      console.log('APIキーが見つかりません');
      return NextResponse.json(
        { error: 'APIキーが見つかりません' },
        { status: 404 }
      );
    }
    
    const apiKey = keyDoc.data();

    // OpenAI APIを呼び出し
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.key}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `あなたは競馬分析の専門家です。以下のレース情報を分析し、各馬の評価（★〜★★★★★）、レース展開予想、買い目（単勝・複勝・馬連・三連複など）を提案してください。
            分析結果は以下のJSON形式で返してください：
            {
              "race_name": "レース名",
              "race_details": "レースの基本情報",
              "horse_ratings": [
                {"horse_name": "馬名1", "rating": "★★★★★", "comment": "評価コメント"},
                {"horse_name": "馬名2", "rating": "★★★", "comment": "評価コメント"}
              ],
              "race_analysis": "レース展開予想と分析",
              "betting_suggestions": "買い目提案"
            }`
          },
          {
            role: 'user',
            content: raceInfo
          }
        ]
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI APIエラー:', errorData);
      return NextResponse.json(
        { error: 'レース分析中にエラーが発生しました' },
        { status: 500 }
      );
    }

    const openaiData = await openaiResponse.json();
    const analysisContent = openaiData.choices[0].message.content;
    
    // JSONレスポンスの解析
    let analysisResult;
    try {
      // JSON文字列を抽出（マークダウンコードブロックなどから）
      const jsonMatch = analysisContent.match(/```json\n([\s\S]*?)\n```/) || 
                        analysisContent.match(/```\n([\s\S]*?)\n```/) || 
                        [null, analysisContent];
      
      const jsonStr = jsonMatch[1] || analysisContent;
      analysisResult = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON解析エラー:', parseError);
      console.log('解析対象テキスト:', analysisContent);
      
      // 解析に失敗した場合は、テキスト全体を返す
      analysisResult = {
        race_name: "解析エラー",
        race_details: "JSONの解析に失敗しました",
        horse_ratings: [],
        race_analysis: analysisContent,
        betting_suggestions: ""
      };
    }

    // 成功レスポンス
    return NextResponse.json(
      { 
        success: true,
        result: analysisResult
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('レース分析エラー:', error);
    return NextResponse.json(
      { error: '分析処理中にエラーが発生しました。しばらくしてからもう一度お試しください。' },
      { status: 500 }
    );
  }
}
