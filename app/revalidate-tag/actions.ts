/**
 * `revalidateTag` デモ用のサーバーアクションを定義するモジュール。
 */
"use server";

import { revalidateTag } from "next/cache";

import {
  parseUpdateUserFormData,
  type UpdateUserFormState,
} from "@/app/lib/user-form";
import { updateUser } from "@/app/lib/user-store";

export type { UpdateUserFormState };

export async function updateUserAction(
  _prevState: UpdateUserFormState | undefined,
  formData: FormData,
): Promise<UpdateUserFormState> {
  const parsed = parseUpdateUserFormData(formData);

  if (parsed.kind === "error") {
    return parsed.formState;
  }

  const { id, payload } = parsed;

  try {
    const result = await updateUser(id, payload);

    revalidateTag(`user:${id}`, "max");

    return {
      status: "success",
      message: "ユーザー情報を更新しました。",
      refreshedAt: result.updatedAt,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "更新処理でエラーが発生しました。",
    };
  }
}
