import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { z } from 'zod';
import { zodSchema } from 'ai';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

async function searchWeb(query: string) {
  try {
    // SerpAPIを使用（無料プランあり）
    // または Google Custom Search API を使用可能
    const apiKey = process.env.SERP_API_KEY || process.env.GOOGLE_SEARCH_API_KEY;
    
    if (!apiKey) {
      return `検索機能を使用するには、SERP_API_KEYまたはGOOGLE_SEARCH_API_KEYを.env.localに設定してください。現在は検索機能なしで動作しています。`;
    }

    // SerpAPIを使用する場合
    if (process.env.SERP_API_KEY) {
      const response = await fetch(
        `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}&engine=google`
      );
      const data = await response.json();
      
      if (data.organic_results) {
        const results = data.organic_results.slice(0, 5).map((result: {
          title: string;
          snippet: string;
          link: string;
        }) => ({
          title: result.title,
          snippet: result.snippet,
          link: result.link,
        }));
        return JSON.stringify(results, null, 2);
      }
    }

    // Google Custom Search APIを使用する場合
    if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID) {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      
      if (data.items) {
        const results = data.items.slice(0, 5).map((item: {
          title: string;
          snippet: string;
          link: string;
        }) => ({
          title: item.title,
          snippet: item.snippet,
          link: item.link,
        }));
        return JSON.stringify(results, null, 2);
      }
    }

    return '検索結果が見つかりませんでした。';
  } catch (error) {
    console.error('Search error:', error);
    return `検索エラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

// 検索APIキーが設定されているかチェック
const hasSearchAPI = !!(process.env.SERP_API_KEY || (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID));

export async function POST(req: Request) {
  try {
    console.log('API Route: Request received');
    const { messages } = await req.json();
    console.log('API Route: Messages:', messages);

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('API Route: ANTHROPIC_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEYが設定されていません' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('API Route: ANTHROPIC_API_KEY is set');

    // 検索APIキーがある場合のみツールを追加
    const tools = hasSearchAPI ? {
      webSearch: {
        description: '最新の情報をWeb検索で取得します。現在のニュース、技術情報、その他の最新情報を検索する際に使用してください。',
        inputSchema: zodSchema(
          z.object({
            query: z.string().describe('検索クエリ'),
          })
        ),
        execute: async ({ query }: { query: string }) => {
          return await searchWeb(query);
        },
      },
    } : undefined;

    console.log('API Route: Calling streamText...');
    const modelId = 'claude-3-haiku-20240307';
    console.log('API Route: Model:', modelId);
    console.log('API Route: Messages count:', messages.length);
    console.log('API Route: Has tools:', !!tools);
    console.log('API Route: ANTHROPIC_API_KEY length:', process.env.ANTHROPIC_API_KEY?.length || 0);
    
    const result = streamText({
      model: anthropic(modelId),
      messages,
      ...(tools && { tools }),
      onFinish: (result) => {
        console.log('API Route: streamText finished:', {
          finishReason: result.finishReason,
          usage: result.usage,
          response: result.response,
        });
      },
    });

    console.log('API Route: streamText called, checking result...');
    
    // 結果を確認
    const textStream = result.textStream;
    console.log('API Route: textStream exists:', !!textStream);
    
    if (!textStream) {
      console.error('API Route: textStream is null or undefined!');
      return new Response(
        JSON.stringify({ error: 'ストリームの生成に失敗しました' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // AI SDKの標準メソッドを使用
    const response = result.toTextStreamResponse();
    console.log('API Route: Response created, returning...');
    return response;
  } catch (error) {
    console.error('API Route Error:', error);
    console.error('API Route Error Stack:', error instanceof Error ? error.stack : 'No stack');
    return new Response(
      JSON.stringify({ 
        error: 'エラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}