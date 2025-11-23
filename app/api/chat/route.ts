// import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, streamText } from 'ai';

// const anthropic = createAnthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY || '',
// });

const google = process.env.GOOGLE_API_KEY
  ? createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
    })
  : null;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const uiMessages = Array.isArray(messages) ? messages : [];
    const modelMessages = convertToModelMessages(
      uiMessages.map(({ id, ...rest }) => rest)
    );

    if (google) {
      try {
        const googleResult = streamText({
          model: google('gemini-2.0-flash-001'),
          messages: modelMessages,
        });

        return googleResult.toUIMessageStreamResponse();
      } catch (googleError) {
        console.error('Google Generative AI 呼び出しに失敗しました');
      }
    }

    // if (!process.env.ANTHROPIC_API_KEY) {
    //   return new Response(
    //     JSON.stringify({
    //       error: 'すべてのプロバイダ呼び出しに失敗しました',
    //       details: 'ANTHROPIC_API_KEYが設定されていません',
    //     }),
    //     { status: 500, headers: { 'Content-Type': 'application/json' } }
    //   );
    // }

    // const anthropicResult = streamText({
    //   model: anthropic('claude-3-haiku-20240307'),
    //   messages: modelMessages,
    // });

    // AI SDK UI互換のレスポンスを返却
    // return anthropicResult.toUIMessageStreamResponse();
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