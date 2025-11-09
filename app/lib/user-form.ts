/**
 * ユーザー更新フォームのバリデーションと初期状態を提供するユーティリティ。
 */
import type {
  UpdateUserFormState,
  UpdateUserFormValidationResult,
  UserUpdateInput,
} from "@/types";

const ALLOWED_ROLES = new Set<UserUpdateInput["role"]>(["admin", "member"]);

const baseState: UpdateUserFormState = {
  status: "idle",
  message: "",
};

const trimFormField = (value: FormDataEntryValue | null) => {
  return typeof value === "string" ? value.trim() : "";
};

/**
 * フォーム表示時の初期状態を生成する。
 */
export function createInitialUpdateState(): UpdateUserFormState {
  return { ...baseState };
}

/**
 * ユーザー更新フォームをバリデーションし、更新入力を構築する。
 * @param formData - フォーム送信で受け取った `FormData`
 * @returns 成功時は更新対象IDと入力内容、エラー時はフォーム表示用の状態
 */
export function parseUpdateUserFormData(
  formData: FormData,
): UpdateUserFormValidationResult {
  const id = trimFormField(formData.get("id"));
  const name = trimFormField(formData.get("name"));
  const email = trimFormField(formData.get("email"));
  const bio = trimFormField(formData.get("bio"));
  const role = trimFormField(formData.get("role"));

  if (!id) {
    return {
      kind: "error",
      formState: {
        status: "error",
        message: "ユーザーIDが取得できませんでした。",
      },
    };
  }

  const payload: UserUpdateInput = {};

  if (name) payload.name = name;
  if (email) payload.email = email;
  if (bio) payload.bio = bio;
  if (role && ALLOWED_ROLES.has(role as UserUpdateInput["role"])) {
    payload.role = role as UserUpdateInput["role"];
  }

  if (Object.keys(payload).length === 0) {
    return {
      kind: "error",
      formState: {
        status: "error",
        message: "変更内容を入力してください。",
      },
    };
  }

  return {
    kind: "success",
    id,
    payload,
  };
}
