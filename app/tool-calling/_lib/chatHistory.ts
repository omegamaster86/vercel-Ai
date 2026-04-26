import type { UIMessage } from "ai";

export const CHAT_STORAGE_KEY = "tool-calling-chat-history-v1";
export const FALLBACK_CHAT_TITLE = "新しいチャット";
export const EMPTY_PREVIEW_TEXT = "会話を開始しましょう";

export type ChatSession = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

export function createSession(): ChatSession {
  return {
    id: crypto.randomUUID(),
    title: FALLBACK_CHAT_TITLE,
    updatedAt: Date.now(),
    messages: [],
  };
}

function extractMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text.trim())
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function deriveSessionTitle(messages: UIMessage[]): string {
  const firstUserMessage = messages.find((message) => message.role === "user");
  const text = firstUserMessage ? extractMessageText(firstUserMessage) : "";

  if (!text) {
    return FALLBACK_CHAT_TITLE;
  }

  return text.length > 30 ? `${text.slice(0, 30)}...` : text;
}

export function deriveSessionPreview(messages: UIMessage[]): string {
  const latestTextMessage = [...messages]
    .reverse()
    .find((message) => extractMessageText(message).length > 0);
  const text = latestTextMessage ? extractMessageText(latestTextMessage) : "";

  return text || EMPTY_PREVIEW_TEXT;
}

export function normalizeStoredSessions(rawValue: unknown): ChatSession[] {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  return rawValue
    .map((session): ChatSession | null => {
      if (!session || typeof session !== "object") {
        return null;
      }

      const candidate = session as Partial<ChatSession>;
      if (typeof candidate.id !== "string") {
        return null;
      }

      return {
        id: candidate.id,
        title:
          typeof candidate.title === "string" && candidate.title.length > 0
            ? candidate.title
            : FALLBACK_CHAT_TITLE,
        updatedAt:
          typeof candidate.updatedAt === "number"
            ? candidate.updatedAt
            : Date.now(),
        messages: Array.isArray(candidate.messages)
          ? (candidate.messages as UIMessage[])
          : [],
      };
    })
    .filter((session): session is ChatSession => session !== null)
    .sort((left, right) => right.updatedAt - left.updatedAt);
}
