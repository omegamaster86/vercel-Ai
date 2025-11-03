'use client';

import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called', { input, isLoading, inputTrim: input.trim() });
    
    if (!input.trim() || isLoading) {
      console.log('Early return:', { inputEmpty: !input.trim(), isLoading });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    console.log('Sending message:', userMessage);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const requestBody = {
        messages: [...messages, userMessage].map(({ role, content }) => ({
          role,
          content,
        })),
      };
      console.log('Fetching /api/chat with:', requestBody);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Response received:', response.status, response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} ${errorText}`);
      }

      if (!response.body) {
        console.error('Response body is null!');
        throw new Error('Response body is null');
      }

      console.log('Response body exists, starting to read stream...');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      };

      setMessages((prev) => [...prev, assistantMessage]);

      let chunkCount = 0;
      while (true) {
        console.log(`Reading chunk ${chunkCount}...`);
        const { done, value } = await reader.read();
        console.log(`Chunk ${chunkCount} read:`, { done, valueLength: value?.length });
        
        if (done) {
          console.log('Stream finished');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log(`Raw chunk ${chunkCount}:`, JSON.stringify(chunk));
        chunkCount++;
        
        // AI SDKのtoTextStreamResponseは、各行が直接テキストデータか、SSEフォーマット
        // まず、SSEフォーマット (data: で始まる) を試す
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (!line.trim()) continue;
          
          console.log('Processing line:', line);
          
          // SSEフォーマット: "data: 0:テキスト"
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // "data: "を削除
            if (data.startsWith('0:')) {
              const text = data.slice(2);
              assistantContent += text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: assistantContent,
                };
                return updated;
              });
            }
          }
          // 直接フォーマット: "0:テキスト"
          else if (line.startsWith('0:')) {
            const text = line.slice(2);
            assistantContent += text;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: assistantContent,
              };
              return updated;
            });
          }
          // プレーンテキストの可能性
          else if (!line.startsWith(':') && !line.startsWith('event:')) {
            // テキストデータの可能性
            assistantContent += line;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: assistantContent,
              };
              return updated;
            });
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'エラーが発生しました。もう一度お試しください。',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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

          {messages.map((message) => (
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
                <div className="whitespace-pre-wrap">{message.content}</div>
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
              onChange={(e) => {
                console.log('Input changed:', e.target.value);
                setInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }}
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
        </form>
      </footer>
    </div>
  );
}
