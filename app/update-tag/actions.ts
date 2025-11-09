"use server";

import { updateTag } from "next/cache";
import {
  parseUpdateUserFormData,
  type UpdateUserFormState,
} from "@/app/lib/user-form";
import { updateUser } from "@/app/lib/user-store";

export async function updateUserWithUpdateTagAction(
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

    updateTag(`user:${id}`);

    return {
      status: "success",
      message: "ユーザー情報を更新しました。キャッシュは即時に更新されます。",
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
