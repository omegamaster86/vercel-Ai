/**
 * ユーザーデータのキャッシュ取得ロジックをまとめたユーティリティ。
 * 
 * Next.js 16 の `use cache` ディレクティブと `cacheTag` API を使用して
 * タグ機能（`revalidateTag` / `updateTag`）をサポートしています。
 */
import { cacheTag } from "next/cache";

import { getUser } from "@/app/lib/user-store";
import type { UserRecord } from "@/types";

/**
 * ユーザーデータをキャッシュ経由で取得する。
 * 
 * `use cache` ディレクティブを使用してキャッシュし、
 * `cacheTag` でタグを設定することで、`revalidateTag` や `updateTag` と
 * 統合されたキャッシュ無効化をサポートしています。
 * 
 * @param id - ユーザーID
 * @returns キャッシュ済みのユーザーレコード
 */
export async function getCachedUser(id: string): Promise<UserRecord> {
  "use cache";
  
  cacheTag(`user:${id}`);
  
  return getUser(id);
}
