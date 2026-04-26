"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CHAT_STORAGE_KEY,
  type ChatSession,
  createSession,
  deriveSessionPreview,
  deriveSessionTitle,
  normalizeStoredSessions,
} from "../_lib/chatHistory";

type ChatHistoryItem = {
  id: string;
  title: string;
  preview: string;
  updatedAt: number;
};

const transport = new DefaultChatTransport({
  api: "/api/tool-calling",
});

function updateSessionMessages(
  previousSessions: ChatSession[],
  activeSessionId: string | null,
  nextMessages: UIMessage[],
): ChatSession[] {
  if (!activeSessionId) {
    return previousSessions;
  }

  const targetSession = previousSessions.find(
    (session) => session.id === activeSessionId,
  );
  if (!targetSession) {
    return previousSessions;
  }

  const previousSerialized = JSON.stringify(targetSession.messages);
  const nextSerialized = JSON.stringify(nextMessages);
  if (previousSerialized === nextSerialized) {
    return previousSessions;
  }

  const updatedSession: ChatSession = {
    ...targetSession,
    title: deriveSessionTitle(nextMessages),
    updatedAt: Date.now(),
    messages: nextMessages,
  };
  const restSessions = previousSessions.filter(
    (session) => session.id !== activeSessionId,
  );

  return [updatedSession, ...restSessions];
}

export function useToolCallingChat() {
  const [input, setInput] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const syncSessionWithMessages = useCallback(
    (nextMessages: UIMessage[]) => {
      setSessions((previousSessions) =>
        updateSessionMessages(previousSessions, activeSessionId, nextMessages),
      );
    },
    [activeSessionId],
  );

  const { messages, setMessages, sendMessage, status, error, clearError } =
    useChat({
      transport,
      onFinish: ({ messages: completedMessages }) => {
        syncSessionWithMessages(completedMessages);
      },
    });

  const isLoading = status === "submitted" || status === "streaming";
  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : "エラーが発生しました。"
    : undefined;

  // ブラウザの localStorage から会話履歴を復元する
  useEffect(() => {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    let parsed: ChatSession[] = [];

    if (stored) {
      try {
        parsed = normalizeStoredSessions(JSON.parse(stored));
      } catch {
        parsed = [];
      }
    }

    if (parsed.length === 0) {
      const initialSession = createSession();
      setSessions([initialSession]);
      setActiveSessionId(initialSession.id);
      setMessages([]);
      setIsHydrated(true);
      return;
    }

    setSessions(parsed);
    setActiveSessionId(parsed[0]?.id ?? null);
    setMessages(parsed[0]?.messages ?? []);
    setIsHydrated(true);
  }, [setMessages]);

  // ブラウザの localStorage へ会話履歴を永続化する
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
  }, [isHydrated, sessions]);

  const historyItems = useMemo<ChatHistoryItem[]>(
    () =>
      sessions
        .slice()
        .sort((left, right) => right.updatedAt - left.updatedAt)
        .map((session) => ({
          id: session.id,
          title: session.title,
          preview: deriveSessionPreview(session.messages),
          updatedAt: session.updatedAt,
        })),
    [sessions],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isHydrated || !activeSessionId || !input.trim() || isLoading) {
      return;
    }

    await sendMessage({ text: input });
    setInput("");
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (error) {
      clearError();
    }

    setInput(event.target.value);
  };

  const handleCreateSession = () => {
    if (isLoading) {
      return;
    }

    const newSession = createSession();
    setSessions((previousSessions) => [newSession, ...previousSessions]);
    setActiveSessionId(newSession.id);
    setMessages([]);
    setInput("");
    if (error) {
      clearError();
    }
  };

  const handleSelectSession = (sessionId: string) => {
    if (isLoading || sessionId === activeSessionId) {
      return;
    }

    syncSessionWithMessages(messages);
    const selectedSession = sessions.find(
      (session) => session.id === sessionId,
    );
    if (!selectedSession) {
      return;
    }

    setMessages(selectedSession.messages);
    setActiveSessionId(sessionId);
    setInput("");
    if (error) {
      clearError();
    }
  };

  return {
    activeSessionId,
    errorMessage,
    handleCreateSession,
    handleInputChange,
    handleSelectSession,
    handleSubmit,
    historyItems,
    input,
    isHydrated,
    isLoading,
    messages,
  };
}
