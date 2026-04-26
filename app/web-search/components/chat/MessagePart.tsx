import Link from "next/link";
import type { ReactNode } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";

import type { MessagePartProps } from "@/types";

const mergeClassName = (base: string, className?: string) =>
  className ? `${base} ${className}` : base;

type WeatherToolOutput = {
  location: string;
  condition: string;
  temperature: number;
  unit: "C" | "F";
};

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  stock: number;
};

type InventoryToolOutput = {
  query: string;
  count: number;
  results: InventoryItem[];
};

const outputLabelMap: Record<string, string> = {
  location: "場所",
  condition: "天気",
  temperature: "気温",
  unit: "単位",
  query: "検索キーワード",
  count: "ヒット件数",
  id: "商品ID",
  name: "商品名",
  category: "カテゴリ",
  stock: "在庫数",
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isWeatherToolOutput(value: unknown): value is WeatherToolOutput {
  if (!isObjectRecord(value)) {
    return false;
  }

  return (
    typeof value.location === "string" &&
    typeof value.condition === "string" &&
    typeof value.temperature === "number" &&
    (value.unit === "C" || value.unit === "F")
  );
}

function isInventoryItem(value: unknown): value is InventoryItem {
  if (!isObjectRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.category === "string" &&
    typeof value.stock === "number"
  );
}

function isInventoryToolOutput(value: unknown): value is InventoryToolOutput {
  if (!isObjectRecord(value)) {
    return false;
  }

  return (
    typeof value.query === "string" &&
    typeof value.count === "number" &&
    Array.isArray(value.results) &&
    value.results.every(isInventoryItem)
  );
}

function formatValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    const scalarValues = value.filter(
      (item) =>
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean",
    );
    if (scalarValues.length === value.length) {
      return scalarValues.map((item) => String(item)).join(", ");
    }

    return `${value.length}件`;
  }

  if (isObjectRecord(value)) {
    return `${Object.keys(value).length}項目`;
  }

  return "不明";
}

function renderWeatherOutput(output: WeatherToolOutput) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
      <p className="text-sm text-gray-800">
        {output.location}の現在の天気は{output.condition}、気温は
        {output.temperature}°{output.unit}です。
      </p>
    </div>
  );
}

function renderInventoryOutput(output: InventoryToolOutput) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
      <p className="text-sm font-medium text-gray-900">
        「{output.query}」の検索結果: {output.count}件
      </p>
      {output.results.length > 0 ? (
        <ul className="mt-2 space-y-1 text-sm text-gray-700">
          {output.results.map((item) => (
            <li
              key={item.id}
              className="rounded border border-gray-200 bg-white p-2"
            >
              {item.name}（{item.category}） - 在庫 {item.stock} / ID: {item.id}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-gray-600">該当する商品はありません。</p>
      )}
    </div>
  );
}

function renderKeyValueOutput(output: Record<string, unknown>) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
      <dl className="space-y-1 text-sm">
        {Object.entries(output).map(([key, value]) => (
          <div key={key} className="flex items-start gap-2">
            <dt className="min-w-24 font-medium text-gray-700">
              {outputLabelMap[key] ?? key}
            </dt>
            <dd className="text-gray-900">{formatValue(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function renderToolOutput(output: unknown): ReactNode {
  if (isWeatherToolOutput(output)) {
    return renderWeatherOutput(output);
  }

  if (isInventoryToolOutput(output)) {
    return renderInventoryOutput(output);
  }

  if (isObjectRecord(output)) {
    return renderKeyValueOutput(output);
  }

  if (typeof output === "string" && output.trim().length > 0) {
    return <p className="text-sm text-gray-800">{output}</p>;
  }

  if (typeof output === "number" || typeof output === "boolean") {
    return <p className="text-sm text-gray-800">{String(output)}</p>;
  }

  return <p className="text-sm text-gray-500">結果を表示できませんでした。</p>;
}

const markdownComponents: Components = {
  h1({ children, className, ...props }) {
    return (
      <h1
        {...props}
        className={mergeClassName(
          "text-2xl font-bold mb-4 mt-6 first:mt-0",
          className,
        )}
      >
        {children}
      </h1>
    );
  },
  h2({ children, className, ...props }) {
    return (
      <h2
        {...props}
        className={mergeClassName(
          "text-xl font-bold mb-3 mt-5 first:mt-0",
          className,
        )}
      >
        {children}
      </h2>
    );
  },
  h3({ children, className, ...props }) {
    return (
      <h3
        {...props}
        className={mergeClassName(
          "text-lg font-semibold mb-2 mt-4 first:mt-0",
          className,
        )}
      >
        {children}
      </h3>
    );
  },
  p({ children, className, ...props }) {
    return (
      <p
        {...props}
        className={mergeClassName("mb-3 last:mb-0 leading-relaxed", className)}
      >
        {children}
      </p>
    );
  },
  ul({ children, className, ...props }) {
    return (
      <ul
        {...props}
        className={mergeClassName(
          "list-disc list-inside mb-3 space-y-1 ml-4",
          className,
        )}
      >
        {children}
      </ul>
    );
  },
  ol({ children, className, ...props }) {
    return (
      <ol
        {...props}
        className={mergeClassName(
          "list-decimal list-inside mb-3 space-y-1 ml-4",
          className,
        )}
      >
        {children}
      </ol>
    );
  },
  li({ children, className, ...props }) {
    return (
      <li {...props} className={mergeClassName("leading-relaxed", className)}>
        {children}
      </li>
    );
  },
  strong({ children, className, ...props }) {
    return (
      <strong {...props} className={mergeClassName("font-semibold", className)}>
        {children}
      </strong>
    );
  },
  em({ children, className, ...props }) {
    return (
      <em {...props} className={mergeClassName("italic", className)}>
        {children}
      </em>
    );
  },
  code(props) {
    const { inline, className, children, ...rest } = props as {
      inline?: boolean;
      className?: string;
      children?: React.ReactNode;
    };

    if (inline) {
      return (
        <code
          {...rest}
          className={mergeClassName(
            "bg-gray-200 px-1.5 py-0.5 rounded text-sm font-mono",
            className,
          )}
        >
          {children}
        </code>
      );
    }

    return (
      <code {...rest} className={className}>
        {children}
      </code>
    );
  },
  pre({ children, className, ...props }) {
    return (
      <pre
        {...props}
        className={mergeClassName(
          "bg-gray-200 rounded-md p-3 overflow-x-auto mb-3 text-sm",
          className,
        )}
      >
        {children}
      </pre>
    );
  },
  blockquote({ children, className, ...props }) {
    return (
      <blockquote
        {...props}
        className={mergeClassName(
          "border-l-4 border-gray-300 pl-4 italic my-3",
          className,
        )}
      >
        {children}
      </blockquote>
    );
  },
  a({ node: _node, href, className, children, ...rest }) {
    if (!href) {
      return <span className="text-blue-600 underline">{children}</span>;
    }

    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={mergeClassName(
          "text-blue-600 underline hover:text-blue-800",
          className,
        )}
        {...rest}
      >
        {children}
      </Link>
    );
  },
  hr({ className, ...props }) {
    return (
      <hr
        {...props}
        className={mergeClassName("my-4 border-gray-300", className)}
      />
    );
  },
};

export function MessagePart({ part }: MessagePartProps) {
  // 表示不要な内部イベント（ストリームのステップ情報など）はUIに出さない
  if (typeof part.type === "string" && part.type.startsWith("step-")) {
    return null;
  }

  if (part.type === "text" || part.type === "reasoning") {
    return (
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown components={markdownComponents}>
          {part.text}
        </ReactMarkdown>
      </div>
    );
  }

  if (part.type === "source-url") {
    if (!part.url) {
      return null;
    }

    return (
      <Link
        href={part.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-fit text-sm text-blue-600 underline wrap-break-word"
      >
        {part.title ?? part.url}
      </Link>
    );
  }

  if (part.type === "source-document") {
    return <div className="text-sm">{part.title}</div>;
  }

  if ("output" in part && part.output !== undefined) {
    return <div>{renderToolOutput(part.output)}</div>;
  }

  if (part.type === "file") {
    return (
      <div className="text-sm text-gray-600 wrap-break-word">
        ファイル: {part.filename ?? part.url}
      </div>
    );
  }

  return (
    <pre className="whitespace-pre-wrap text-xs text-gray-500 bg-gray-100 rounded-md p-3 overflow-x-auto">
      {JSON.stringify(part, null, 2)}
    </pre>
  );
}
