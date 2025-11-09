import type { ChatHeaderProps } from '@/types';

export function ChatHeader({ title, description }: ChatHeaderProps) {
  return (
    <header className="border-b bg-white p-4 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {description ? (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      ) : null}
    </header>
  );
}

