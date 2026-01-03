import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, streamText, tool, zodSchema } from 'ai';
import { z } from 'zod';

const google = process.env.GOOGLE_API_KEY
  ? createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
    })
  : null;

const weatherByCity = {
  Tokyo: { condition: '晴れ', tempC: 26 },
  Osaka: { condition: 'くもり', tempC: 24 },
  Sapporo: { condition: '雨', tempC: 18 },
  Fukuoka: { condition: '晴れのちくもり', tempC: 25 },
  Kyoto: { condition: 'くもり', tempC: 23 },
};

const inventory = [
  { id: 'P-1001', name: 'ノートPC Pro 14', category: 'PC', stock: 12 },
  { id: 'P-1002', name: 'ノートPC Air 13', category: 'PC', stock: 4 },
  { id: 'P-2001', name: 'スマートフォン X', category: 'Mobile', stock: 0 },
  { id: 'P-3001', name: 'ワイヤレスヘッドセット', category: 'Audio', stock: 32 },
  { id: 'P-3002', name: 'ノイズキャンセルイヤホン', category: 'Audio', stock: 8 },
  { id: 'P-4001', name: 'スマートウォッチ Active', category: 'Wearable', stock: 15 },
];

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const uiMessages = Array.isArray(messages) ? messages : [];
    const modelMessages = convertToModelMessages(
      uiMessages.map(({ id, ...rest }) => rest)
    );

    if (!google) {
      return new Response(
        JSON.stringify({
          error: 'Google Generative AI が設定されていません',
          details: 'GOOGLE_API_KEY を設定してください',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = streamText({
      model: google('gemini-2.0-flash-001'),
      messages: modelMessages,
      system:
        '必要に応じてツールを呼び出し、取得した結果をわかりやすく要約してください。',
      tools: {
        getWeather: tool({
          description:
            '都市名を受け取り、現在の天気と気温を返します。',
          inputSchema: zodSchema(
            z.object({
              location: z
                .string()
                .describe('都市名 (例: Tokyo, Osaka, Sapporo)'),
              unit: z
                .enum(['C', 'F'])
                .default('C')
                .describe('温度の単位'),
            })
          ),
          execute: async ({ location, unit }) => {
            const normalized = location.trim();
            const weather =
              weatherByCity[normalized as keyof typeof weatherByCity];
            const baseTemp = weather?.tempC ?? 22;
            const condition = weather?.condition ?? 'くもり';
            const temperature =
              unit === 'F' ? Math.round(baseTemp * 1.8 + 32) : baseTemp;

            return {
              location: normalized,
              condition,
              temperature,
              unit,
            };
          },
        }),
        searchInventory: tool({
          description:
            '社内デモ在庫からキーワードで検索し、該当する商品を返します。',
          inputSchema: zodSchema(
            z.object({
              query: z.string().describe('検索キーワード'),
            })
          ),
          execute: async ({ query }) => {
            const keyword = query.trim().toLowerCase();
            const results = inventory.filter((item) => {
              const haystack = `${item.name} ${item.category} ${item.id}`.toLowerCase();
              return haystack.includes(keyword);
            });

            return {
              query,
              count: results.length,
              results: results.slice(0, 5),
            };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'エラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
