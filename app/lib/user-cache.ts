/**
 * ユーザーデータのキャッシュ取得ロジックをまとめたユーティリティ。
 */
import { unstable_cache } from "next/cache";

import { getUser } from "@/app/lib/user-store";
import type { UserRecord } from "@/types";

const getUserCachedFactory = (id: string) =>
  unstable_cache(async () => getUser(id), ["user", id], {
    tags: [`user:${id}`],
  });

/**
 * ユーザーデータをキャッシュ経由で取得する。
 * @param id - ユーザーID
 * @returns キャッシュ済みのユーザーレコード
 */
export async function getCachedUser(id: string): Promise<UserRecord> {
  return getUserCachedFactory(id)();
}
