/**
 * ダッシュボードトップページ。各種デモ機能へのリンクを表示する。
 */
import Link from "next/link";
import type { SidebarItem } from "@/types";
import { Sidebar } from "./components/Sidebar";

const tools: SidebarItem[] = [
  {
    title: "Web検索チャット",
    description: "Claudeを使ってリアルタイム検索しながら会話できます",
    href: "/web-search",
  },
  {
    title: "revalidateTag 検証",
    description:
      "キャッシュタグの再検証とサーバーアクションの挙動を確認するデモ",
    href: "/revalidate-tag",
  },
  {
    title: "updateTag 検証",
    description: "updateTag を使った read-your-own-writes を確認するデモ",
    href: "/update-tag",
  },
  {
    title: "Function/Tool calling",
    description: "天気取得や在庫検索をツールで実行するデモ",
    href: "/tool-calling",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar heading="AIツール" subheading="ダッシュボード" items={tools} />

      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-6">
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900">
                    {tool.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-600">
                    {tool.description}
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600 transition group-hover:text-blue-700">
                  使ってみる
                  <svg
                    aria-hidden="true"
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
