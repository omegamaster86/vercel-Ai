'use client';

import { DefaultChatTransport } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ChatHeader } from './components/chat/ChatHeader';
import { ChatEmptyState } from './components/chat/ChatEmptyState';
import { ChatMessage } from './components/chat/ChatMessage';
import { ChatLoadingIndicator } from './components/chat/ChatLoadingIndicator';
import { ChatInputForm } from './components/chat/ChatInputForm';

const transport = new DefaultChatTransport({
  api: '/api/chat',
});

export default function Home() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error, clearError } = useChat({
    transport,
  });

  const isLoading = status === 'submitted' || status === 'streaming';
  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : 'エラーが発生しました。'
    : undefined;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!input.trim() || isLoading) {
      return;
    }

    await sendMessage({ text: input });
    setInput('');
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
        title="Claude Web検索チャット"
        description="Claudeを使用したリアルタイム検索機能付きチャット"
      />

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <ChatEmptyState
              title="何か質問してみてください"
              examples={['例: 「最新のAI技術について検索して」']}
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
