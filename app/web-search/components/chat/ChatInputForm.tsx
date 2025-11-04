import type { ChangeEvent, FormEvent } from 'react';

type ChatInputFormProps = {
  input: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  errorMessage?: string;
};

export function ChatInputForm({
  input,
  onSubmit,
  onChange,
  isLoading,
  errorMessage,
}: ChatInputFormProps) {
  return (
    <footer className="border-t bg-white p-4">
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={onChange}
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
        {errorMessage ? (
          <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
        ) : null}
      </form>
    </footer>
  );
}

