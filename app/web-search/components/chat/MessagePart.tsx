import Link from "next/link";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";

import type { MessagePartProps } from "@/types";

const mergeClassName = (base: string, className?: string) =>
  className ? `${base} ${className}` : base;

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
    const content =
      typeof part.output === "string"
        ? part.output
        : JSON.stringify(part.output, null, 2);

    if (!content) {
      return null;
    }

    return (
      <pre className="whitespace-pre-wrap text-xs bg-gray-200 text-gray-800 rounded-md p-3 overflow-x-auto">
        {content}
      </pre>
    );
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
