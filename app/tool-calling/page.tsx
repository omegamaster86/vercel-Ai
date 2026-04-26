"use client";

import { Suspense } from "react";
import { ChatEmptyState } from "../web-search/components/chat/ChatEmptyState";
import { ChatHeader } from "../web-search/components/chat/ChatHeader";
import { ChatInputForm } from "../web-search/components/chat/ChatInputForm";
import { ChatLoadingIndicator } from "../web-search/components/chat/ChatLoadingIndicator";
import { ChatMessage } from "../web-search/components/chat/ChatMessage";
import { ChatHistorySidebar } from "./_components/ChatHistorySidebar";
import { useToolCallingChat } from "./_hooks/useToolCallingChat";

function ToolCallingChatContent() {
  const {
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
  } = useToolCallingChat();

  return (
    <div className="flex min-h-screen flex-col">
      <ChatHeader
        title="Function/Tool calling"
        description="天気取得や在庫検索をツールで実行するデモ"
      />

      <div className="flex flex-1 overflow-hidden">
        <ChatHistorySidebar
          items={historyItems}
          activeId={activeSessionId}
          onSelect={handleSelectSession}
          onCreate={handleCreateSession}
          disabled={!isHydrated || isLoading}
        />

        <div className="flex min-w-0 flex-1 flex-col">
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
            submitOnEnter={false}
          />
        </div>
      </div>
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
