'use server';

import { revalidateTag } from 'next/cache';

import { updateUser } from '@/app/lib/user-store';

export type UpdateUserFormState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  refreshedAt?: string;
};

const trimString = (value: FormDataEntryValue | null) => {
  return typeof value === 'string' ? value.trim() : '';
};

export async function updateUserAction(
  _prevState: UpdateUserFormState | undefined,
  formData: FormData,
): Promise<UpdateUserFormState> {
  const id = trimString(formData.get('id'));
  const name = trimString(formData.get('name'));
  const email = trimString(formData.get('email'));
  const bio = trimString(formData.get('bio'));
  const role = trimString(formData.get('role'));

  if (!id) {
    return {
      status: 'error',
      message: 'ユーザーIDが取得できませんでした。',
    };
  }

  const payload: Parameters<typeof updateUser>[1] = {};

  if (name) payload.name = name;
  if (email) payload.email = email;
  if (bio) payload.bio = bio;
  if (role === 'admin' || role === 'member') payload.role = role;

  if (Object.keys(payload).length === 0) {
    return {
      status: 'error',
      message: '変更内容を入力してください。',
    };
  }

  try {
    const result = await updateUser(id, payload);

    revalidateTag(`user:${id}`, 'max');

    return {
      status: 'success',
      message: 'ユーザー情報を更新しました。',
      refreshedAt: result.updatedAt,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      message: '更新処理でエラーが発生しました。',
    };
  }
}