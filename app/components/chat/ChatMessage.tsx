import type { UIMessage } from 'ai';
import { MessagePart } from './MessagePart';

type ChatMessageProps = {
  message: UIMessage;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
        }`}
      >
        <div className="space-y-2">
          {message.parts.length > 0
            ? message.parts.map((part, index) => (
                <MessagePart key={index} part={part} />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

