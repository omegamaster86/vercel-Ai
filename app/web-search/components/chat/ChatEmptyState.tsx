import type { ChatEmptyStateProps } from "@/types";

export function ChatEmptyState({ title, examples }: ChatEmptyStateProps) {
  return (
    <div className="text-center mt-12">
      <h1 className="text-lg">{title}</h1>
        <p>{examples}</p>
    </div>
  );
}

