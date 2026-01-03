"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { type ChangeEvent, type FormEvent, Suspense, useState } from "react";
import { ChatEmptyState } from "../web-search/components/chat/ChatEmptyState";
import { ChatHeader } from "../web-search/components/chat/ChatHeader";
import { ChatInputForm } from "../web-search/components/chat/ChatInputForm";
import { ChatLoadingIndicator } from "../web-search/components/chat/ChatLoadingIndicator";
import { ChatMessage } from "../web-search/components/chat/ChatMessage";

const transport = new DefaultChatTransport({
  api: "/api/tool-calling",
});

function ToolCallingChatContent() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, clearError } = useChat({
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";
  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : "エラーが発生しました。"
    : undefined;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!input.trim() || isLoading) {
      return;
    }

    await sendMessage({ text: input });
    setInput("");
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (error) {
      clearError();
    }
    setInput(event.target.value);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <ChatHeader
        title="Function/Tool calling"
        description="天気取得や在庫検索をツールで実行するデモ"
      />

      <main className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.length === 0 ? (
            <ChatEmptyState
              title="やりたいことを入力してください"
              examples={[
                "例: 「Tokyoの天気を教えて」",
                "例: 「ノートPCの在庫を検索して」",
              ]}
            />
          ) : null}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading ? <ChatLoadingIndicator /> : null}
        </div>
      </main>

      <ChatInputForm
        input={input}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </div>
  );
}

export default function ToolCallingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          読み込み中...
        </div>
      }
    >
      <ToolCallingChatContent />
    </Suspense>
  );
}
