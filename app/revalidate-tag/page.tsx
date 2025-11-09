/**
 * `revalidateTag` の挙動を検証するサンプルページ。
 */
import Link from "next/link";

import { UserUpdateForm } from "@/app/components/user-update-form";
import { updateUserAction } from "./actions";
import { getCachedUser } from "./data";

const USER_ID = "1";

export const metadata = {
  title: "revalidateTag 検証",
};

export default async function RevalidateTagDemoPage() {
  const user = await getCachedUser(USER_ID);
  const renderTimestamp = new Date().toISOString();

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-blue-600 hover:underline"
          >
            ← ダッシュボードに戻る
          </Link>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Cache Tag Demo
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              revalidateTag の検証
            </h1>
            <p className="text-sm text-gray-600">
              このページは <code>unstable_cache</code> と{" "}
              <code>revalidateTag</code>{" "}
              を組み合わせて、ユーザーデータのキャッシュを無効化する手順を検証するためのサンプルです。
            </p>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                キャッシュされたユーザー情報
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                タグ <code>{`user:${USER_ID}`}</code> に紐づいたデータを{" "}
                <code>unstable_cache</code>{" "}
                から取得し、サーバーレンダリング時刻を表示しています。
              </p>
            </div>

            <dl className="grid grid-cols-1 gap-4 text-sm text-gray-700 sm:grid-cols-2">
              <div>
                <dt className="font-medium text-gray-500">氏名</dt>
                <dd className="mt-1 text-base text-gray-900">{user.name}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">メール</dt>
                <dd className="mt-1 text-base text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">役割</dt>
                <dd className="mt-1 text-base text-gray-900">
                  {user.role === "admin" ? "管理者" : "メンバー"}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">最終更新</dt>
                <dd className="mt-1 text-base text-gray-900">
                  {new Date(user.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>

            <div>
              <h3 className="text-sm font-semibold text-gray-500">自己紹介</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                {user.bio}
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-4 text-xs text-gray-600">
              <p className="font-semibold text-gray-700">レンダリング情報</p>
              <p className="mt-1">
                サーバーでの再計算: {new Date(renderTimestamp).toLocaleString()}
              </p>
              <p>
                キャッシュキー: <code>{`['user', '${USER_ID}']`}</code>
              </p>
              <p>
                タグ: <code>{`user:${USER_ID}`}</code>
              </p>
            </div>
          </article>

          <aside className="space-y-4">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs text-blue-700">
              <p className="font-semibold">手順</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>フォームでユーザー情報を変更し送信</li>
                <li>
                  サーバーアクションが更新＆{" "}
                  <code>{`revalidateTag('user:${USER_ID}')`}</code> を実行
                </li>
                <li>
                  再レンダリング時にキャッシュが無効になり、新しい値が表示
                </li>
              </ol>
            </div>

            <UserUpdateForm
              action={updateUserAction}
              userId={user.id}
              defaults={{
                name: user.name,
                email: user.email,
                bio: user.bio,
                role: user.role,
              }}
            />
          </aside>
        </section>
      </div>
    </div>
  );
}
