"use client";

type ChatHistoryItem = {
  id: string;
  title: string;
  preview: string;
  updatedAt: number;
};

type ChatHistorySidebarProps = {
  items: ChatHistoryItem[];
  activeId: string | null;
  onSelect: (chatId: string) => void;
  onCreate: () => void;
  disabled?: boolean;
};

function formatUpdatedAt(timestamp: number): string {
  return new Date(timestamp).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatHistorySidebar({
  items,
  activeId,
  onSelect,
  onCreate,
  disabled = false,
}: ChatHistorySidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-gray-200 bg-white md:flex md:flex-col">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-900">履歴</h2>
        <button
          type="button"
          onClick={onCreate}
          disabled={disabled}
          className="mt-3 w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          新規チャット
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-3">
        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-200 px-3 py-4 text-xs text-gray-500">
            履歴はまだありません
          </p>
        ) : null}

        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              disabled={disabled}
              className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                isActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              } disabled:cursor-not-allowed disabled:opacity-70`}
            >
              <p className="truncate text-sm font-semibold text-gray-900">
                {item.title}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                {item.preview}
              </p>
              <p className="mt-2 text-[11px] text-gray-500">
                {formatUpdatedAt(item.updatedAt)}
              </p>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
