import { createAnthropic } from '@ai-sdk/anthropic';
import { convertToModelMessages, streamText } from 'ai';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEYが設定されていません' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const modelId = 'claude-3-haiku-20240307';
    const uiMessages = Array.isArray(messages) ? messages : [];
    const modelMessages = convertToModelMessages(
      uiMessages.map(({ id, ...rest }) => rest)
    );

    const result = streamText({
      model: anthropic(modelId),
      messages: modelMessages,
    });

    // AI SDK UI互換のレスポンスを返却
    return result.toUIMessageStreamResponse();
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'エラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}