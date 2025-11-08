import { unstable_cache } from 'next/cache';

import { getUser, type UserRecord } from '@/app/lib/user-store';

const getUserCachedFactory = (id: string) =>
  unstable_cache(async () => getUser(id), ['user', id], {
    tags: [`user:${id}`],
  });

export async function getCachedUser(id: string): Promise<UserRecord> {
  return getUserCachedFactory(id)();
}