"use client";

/**
 * ユーザー情報更新フォームを表示し、結果メッセージを制御するクライアントコンポーネント。
 */
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createInitialUpdateState } from "@/app/lib/user-form";
import type {
  UpdateUserAction,
  UpdateUserFormState,
  UserUpdateFormProps,
} from "@/types";

const fieldClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

/**
 * ユーザー情報を編集するフォーム。
 * @remarks `useActionState` を用いてサーバーアクションの結果を受け取り、メッセージを表示する。
 */
export function UserUpdateForm({
  userId,
  defaults,
  action,
}: UserUpdateFormProps) {
  const [state, formAction] = useActionState<UpdateUserFormState, FormData>(
    action,
    createInitialUpdateState(),
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="id" value={userId} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          <span>氏名</span>
          <input
            defaultValue={defaults.name}
            name="name"
            placeholder="山田 太郎"
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-700">
          <span>メールアドレス</span>
          <input
            defaultValue={defaults.email}
            name="email"
            placeholder="taro@example.com"
            className={fieldClass}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          <span>役割</span>
          <select
            defaultValue={defaults.role}
            name="role"
            className={fieldClass}
          >
            <option value="member">メンバー</option>
            <option value="admin">管理者</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-700 md:col-span-2">
          <span>自己紹介</span>
          <textarea
            defaultValue={defaults.bio}
            name="bio"
            placeholder="最近取り組んでいることなど"
            className={`${fieldClass} h-24 resize-none`}
          />
        </label>
      </div>

      <div className="flex items-center justify-between">
        <FormMessage state={state} />
        <SubmitButton />
      </div>
    </form>
  );
}

function FormMessage({ state }: { state: UpdateUserFormState }) {
  if (!state.message) return null;

  const color = state.status === "success" ? "text-green-600" : "text-rose-600";

  return (
    <p className={`text-sm font-medium ${color}`}>
      {state.message}
      {state.status === "success" && state.refreshedAt
        ? `（${new Date(state.refreshedAt).toLocaleString()}）`
        : ""}
    </p>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      {pending ? "更新中…" : "ユーザー情報を更新"}
    </button>
  );
}
