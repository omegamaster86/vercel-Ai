// import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { convertToModelMessages, streamText } from "ai";

// const anthropic = createAnthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY || '',
// });

const google = process.env.GOOGLE_API_KEY
  ? createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
    })
  : null;

function getTodayJapanString(now = new Date()): string {
  const formatter = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return formatter.format(now);
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const uiMessages = Array.isArray(messages) ? messages : [];
    const modelMessages = convertToModelMessages(
      uiMessages.map(({ id, ...rest }) => rest),
    );

    if (!google) {
      return new Response(
        JSON.stringify({
          error: "プロバイダが設定されていません",
          details: "GOOGLE_API_KEY を設定してください",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    if (google) {
      try {
        const todayJst = getTodayJapanString();
        const googleResult = streamText({
          model: google("gemini-2.0-flash-001"),
          messages: modelMessages,
          system: `あなたは日本語で回答してください。今日（日本時間）は「${todayJst}」です。ユーザーが「今日」「本日」「明日」など相対的な日付表現を使った場合は、この日付を基準に解釈してください。`,
        });

        return googleResult.toUIMessageStreamResponse();
      } catch {
        console.error("Google Generative AI 呼び出しに失敗しました");
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
    return new Response(
      JSON.stringify({
        error: "すべてのプロバイダ呼び出しに失敗しました",
        details: "Google Generative AI の呼び出しに失敗しました",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "エラーが発生しました",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
