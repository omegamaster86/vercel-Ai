'use client';

import { DefaultChatTransport, type UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState, type ChangeEvent, type FormEvent } from 'react';

const transport = new DefaultChatTransport({
  api: '/api/chat',
});

const renderPart = (part: UIMessage['parts'][number], index: number) => {
  if (part.type === 'text' || part.type === 'reasoning') {
    return (
      <p key={index} className="whitespace-pre-wrap">
        {part.text}
      </p>
    );
  }

  if (part.type === 'source-url') {
    return (
      <a
        key={index}
        href={part.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-sm text-blue-600 underline wrap-break-word"
      >
        {part.title ?? part.url}
      </a>
    );
  }

  if (part.type === 'source-document') {
    return (
      <div key={index} className="text-sm">
        {part.title}
      </div>
    );
  }

  if ('output' in part && part.output !== undefined) {
    const content =
      typeof part.output === 'string'
        ? part.output
        : JSON.stringify(part.output, null, 2);

    if (!content) {
      return null;
    }

    return (
      <pre
        key={index}
        className="whitespace-pre-wrap text-xs bg-gray-200 text-gray-800 rounded-md p-3 overflow-x-auto"
      >
        {content}
      </pre>
    );
  }

  if (part.type === 'file') {
    return (
      <div key={index} className="text-sm text-gray-600 wrap-break-word">
        ファイル: {part.filename ?? part.url}
      </div>
    );
  }

  return (
    <pre
      key={index}
      className="whitespace-pre-wrap text-xs text-gray-500 bg-gray-100 rounded-md p-3 overflow-x-auto"
    >
      {JSON.stringify(part, null, 2)}
    </pre>
  );
};

export default function Home() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error, clearError } = useChat({
    transport,
  });

  const isLoading = status === 'submitted' || status === 'streaming';

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
      <header className="border-b bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Claude Web検索チャット
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Claudeを使用したリアルタイム検索機能付きチャット
        </p>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-12">
              <p className="text-lg">何か質問してみてください</p>
              <p className="text-sm mt-2">
                例: 「最新のAI技術について検索して」
              </p>
            </div>
          )}

          {messages.map((message: UIMessage) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="space-y-2">
                  {message.parts.length > 0
                    ? message.parts.map((part, index) => renderPart(part, index))
                    : null}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="メッセージを入力..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-blue-500 px-6 py-2 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              送信
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-500">
              {error instanceof Error ? error.message : 'エラーが発生しました。'}
            </p>
          )}
        </form>
      </footer>
    </div>
  );
}
