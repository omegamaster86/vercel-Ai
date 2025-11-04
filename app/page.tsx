import Link from 'next/link';

const tools = [
  {
    title: 'Web検索チャット',
    description: 'Claudeを使ってリアルタイム検索しながら会話できます',
    href: '/web-search',
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-72 flex-col border-r border-gray-200 bg-white md:flex">
        <div className="border-b border-gray-200 px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            AIツール
          </p>
          <h1 className="mt-2 text-xl font-bold text-gray-900">ダッシュボード</h1>
        </div>
        <nav className="flex-1 space-y-2 px-4 py-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="block rounded-xl border border-transparent px-4 py-3 transition hover:border-gray-300 hover:bg-gray-50"
            >
              <span className="text-sm font-semibold text-gray-900">
                {tool.title}
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                {tool.description}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-gray-200 bg-white px-4 py-4 md:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                AIツール
              </p>
              <h1 className="text-lg font-bold text-gray-900">ダッシュボード</h1>
            </div>
            <Link
              href="/web-search"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Web検索チャット
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6">
          <section className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900">はじめましょう</h2>
            <p className="mt-2 text-sm text-gray-600">
              サイドバーかカードをクリックすると対応する体験へ移動できます。
            </p>
          </section>

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
                  <p className="mt-3 text-sm text-gray-600">{tool.description}</p>
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
