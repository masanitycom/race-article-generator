import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { kv } from '@vercel/kv';
import OpenAI from 'openai';
import { z } from 'zod';

// 入力検証スキーマ
const analyzeSchema = z.object({
  race_name: z.string().min(1, 'レース名は必須です'),
});

// OpenAIクライアント取得関数
const getOpenAIClient = (apiKey: string) => {
  return new OpenAI({
    apiKey: apiKey,
  });
};

// レース情報検索関数
async function searchRaceInfo(raceName: string, apiKey: string) {
  const client = getOpenAIClient(apiKey);
  
  try {
    console.log(`「${raceName}」の情報検索を開始します`);
    
    // 検索クエリの作成
    const searchQueries = [
      `${raceName} 2025 出走表 枠順`,
      `${raceName} 2025 オッズ 予想`,
      `${raceName} 馬場状態 天気`,
      `${raceName} 過去 傾向 分析`
    ];
    
    // 各クエリで検索を実行
    const searchResults = await Promise.all(
      searchQueries.map(async (query) => {
        console.log(`検索クエリ: ${query}`);
        
        const response = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "あなたは競馬情報の検索エンジンです。与えられたクエリに関連する最新の情報を提供してください。"
            },
            {
              role: "user",
              content: `以下のクエリに関する情報を検索し、結果を詳細に提供してください: ${query}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        });
        
        return {
          query: query,
          result: response.choices[0].message.content
        };
      })
    );
    
    return searchResults;
  } catch (e) {
    console.error(`検索エラー: ${e}`);
    throw new Error(`レース情報の検索中にエラーが発生しました: ${e}`);
  }
}

// レースデータ抽出関数
async function extractRaceData(searchResults: any[], apiKey: string) {
  const client = getOpenAIClient(apiKey);
  
  try {
    console.log("検索結果からレースデータを抽出します");
    
    // 検索結果を結合
    const combinedResults = searchResults.map(r => 
      `クエリ: ${r.query}\n結果: ${r.result}`
    ).join("\n\n");
    
    // AIを使用してデータを構造化
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "あなたは競馬データアナリストです。検索結果から構造化されたレースデータを抽出してください。"
        },
        {
          role: "user",
          content: `以下の検索結果から、レース情報、出走馬情報、オッズ、馬場状態などを抽出し、JSON形式で構造化してください。\n\n${combinedResults}`
        }
      ],
      temperature: 0.5,
      response_format: { type: "json_object" }
    });
    
    // 結果をJSONとしてパース
    const raceData = JSON.parse(response.choices[0].message.content || "{}");
    
    return raceData;
  } catch (e) {
    console.error(`データ抽出エラー: ${e}`);
    throw new Error(`レースデータの抽出中にエラーが発生しました: ${e}`);
  }
}

// レースデータ分析関数
async function analyzeRaceData(raceData: any, apiKey: string) {
  const client = getOpenAIClient(apiKey);
  
  try {
    const raceName = raceData.race_info?.name || '不明';
    console.log(`「${raceName}」のデータ分析を開始します`);
    
    // OpenAIを使用してレースデータを分析
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "あなたは競馬分析の専門家です。レースデータを詳細に分析し、予想結果を生成してください。"
        },
        {
          role: "user",
          content: `以下の競馬レース「${raceName}」のデータを徹底的に分析し、非常に詳細な予想結果を生成してください。\n\nレースデータ:\n${JSON.stringify(raceData, null, 2)}`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });
    
    // 結果をJSONとしてパース
    const analysisResult = JSON.parse(response.choices[0].message.content || "{}");
    
    return analysisResult;
  } catch (e) {
    console.error(`分析エラー: ${e}`);
    throw new Error(`レースの分析中にエラーが発生しました: ${e}`);
  }
}

// 記事HTML生成関数
async function generateArticleHtml(raceName: string, raceData: any, analysisResult: any) {
  // HTMLテンプレートを使用して記事を生成
  // 実際の実装ではより複雑なテンプレート処理が必要
  
  const html = `
    <h1>${raceName} 2025 ― AI 生成分析</h1>
    <div class="race-info">
      <p>※データ：${new Date().toLocaleDateString('ja-JP')} 時点</p>
      <p>馬場：${raceData.track_condition || '情報なし'}</p>
    </div>
    
    <h2>【◆結論】印と買い目</h2>
    <div class="horse-marks">
      <!-- 印と買い目のテーブル -->
      <table class="table table-striped">
        <thead>
          <tr>
            <th>印</th>
            <th>馬番</th>
            <th>馬名</th>
            <th>単勝オッズ</th>
            <th>AI 勝率</th>
          </tr>
        </thead>
        <tbody>
          ${(analysisResult.horse_ratings || []).map((horse: any) => `
            <tr>
              <td>${horse.mark || '-'}</td>
              <td>${horse.number || '-'}</td>
              <td>${horse.name || '-'}</td>
              <td>${horse.odds || '-'}</td>
              <td>${horse.win_probability || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <h2>【展開分析】</h2>
    <div class="race-analysis">
      <p>ペース想定：${analysisResult.race_analysis?.pace_prediction || '情報なし'}</p>
      <p>${analysisResult.race_analysis?.race_development || '情報なし'}</p>
    </div>
    
    <h2>【補足ポイント】</h2>
    <div class="additional-points">
      <h3>馬場状態</h3>
      <p>${analysisResult.race_analysis?.track_bias_analysis || '情報なし'}</p>
      
      <h3>穴馬候補</h3>
      <p>${analysisResult.longshots_analysis || '情報なし'}</p>
      
      <h3>危険人気馬</h3>
      <p>${analysisResult.overrated_horses || '情報なし'}</p>
    </div>
    
    <p class="disclaimer">※本稿は投資判断の助言を目的としたものではありません。購入は自己責任で。</p>
  `;
  
  return html;
}

// 記事Markdown生成関数
async function generateArticleMarkdown(raceName: string, raceData: any, analysisResult: any) {
  // Markdownテンプレートを使用して記事を生成
  
  const markdown = `# ${raceName} 2025 ― AI 生成サンプル

※データ：${new Date().toLocaleDateString('ja-JP')} 時点
馬場：${raceData.track_condition || '情報なし'}

## 【◆結論】印と買い目

| 印 | 馬番 | 馬名 | 単勝オッズ | AI 勝率 |
| -- | ---- | ---- | ---------- | ------- |
${(analysisResult.horse_ratings || []).map((horse: any) => 
  `| ${horse.mark || '-'} | ${horse.number || '-'} | ${horse.name || '-'} | ${horse.odds || '-'} | ${horse.win_probability || '-'} |`
).join('\n')}

## 【展開分析】

ペース想定：${analysisResult.race_analysis?.pace_prediction || '情報なし'}

${analysisResult.race_analysis?.race_development || '情報なし'}

## 【補足ポイント】

### 馬場状態
${analysisResult.race_analysis?.track_bias_analysis || '情報なし'}

### 穴馬候補
${analysisResult.longshots_analysis || '情報なし'}

### 危険人気馬
${analysisResult.overrated_horses || '情報なし'}

※本稿は投資判断の助言を目的としたものではありません。購入は自己責任で。
`;
  
  return markdown;
}

// メイン分析関数
async function analyzeRace(raceName: string, apiKey: string) {
  try {
    console.log(`「${raceName}」の分析を開始します（APIキー: ${apiKey.substring(0, 5)}...）`);
    
    // 1. レース情報の検索
    const searchResults = await searchRaceInfo(raceName, apiKey);
    
    // 2. レースデータの抽出
    const raceData = await extractRaceData(searchResults, apiKey);
    
    // 3. レースデータの分析
    const analysisResult = await analyzeRaceData(raceData, apiKey);
    
    // 4. 記事の生成
    const htmlContent = await generateArticleHtml(raceName, raceData, analysisResult);
    const markdownContent = await generateArticleMarkdown(raceName, raceData, analysisResult);
    
    console.log(`「${raceName}」の分析が完了しました`);
    return {
      race_name: raceName,
      race_data: raceData,
      analysis_result: analysisResult,
      html_content: htmlContent,
      markdown_content: markdownContent,
      timestamp: new Date().toISOString()
    };
  } catch (e) {
    console.error(`分析エラー: ${e}`);
    return { error: `${e}` };
  }
}

export async function POST(req: NextRequest) {
  try {
    // セッションの取得
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    
    // リクエストボディの取得
    const body = await req.json();
    
    // 入力値の検証
    const result = analyzeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: '入力値が不正です', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { race_name } = result.data;
    
    // APIキーの取得
    const apiKeys = await kv.get(`api_keys:${session.user.id}`) as any;
    const apiKey = apiKeys?.api_key;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'APIキーが設定されていません' },
        { status: 400 }
      );
    }
    
    // レース分析の実行
    const analysisResult = await analyzeRace(race_name, apiKey);
    
    if ('error' in analysisResult) {
      // APIキー関連のエラーを検出
      if (analysisResult.error.includes('API key') || 
          analysisResult.error.includes('401') || 
          analysisResult.error.includes('invalid_api_key')) {
        return NextResponse.json(
          { error: 'APIキーが無効です', type: 'api_key_error' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: analysisResult.error },
        { status: 500 }
      );
    }
    
    // 分析結果の保存
    const sessionId = Date.now().toString();
    await kv.set(`analysis:${session.user.id}:${sessionId}`, {
      race_name: race_name,
      html_content: analysisResult.html_content,
      markdown_content: analysisResult.markdown_content,
      created_at: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      session_id: sessionId,
      race_name: race_name
    });
  } catch (error) {
    console.error('分析API エラー:', error);
    return NextResponse.json(
      { error: '分析中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
