export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  bio: string;
  updatedAt: string;
};

export type UserUpdateInput = Partial<Omit<UserRecord, 'id' | 'updatedAt'>>;

const seedUser: UserRecord = {
  id: '1',
  name: '山田 太郎',
  email: 'taro@example.com',
  role: 'member',
  bio: 'Next.js と AI を触っているフロントエンドエンジニアです。',
  updatedAt: new Date().toISOString(),
};

const userTable = new Map<string, UserRecord>([[seedUser.id, seedUser]]);

const clone = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value)) as T;
};

export async function getUser(id: string): Promise<UserRecord> {
  const row = userTable.get(id);

  if (!row) {
    throw new Error(`User ${id} was not found.`);
  }

  return clone(row);
}

export async function updateUser(id: string, input: UserUpdateInput) {
  const current = userTable.get(id);

  if (!current) {
    throw new Error(`User ${id} was not found.`);
  }

  const next: UserRecord = {
    ...current,
    ...input,
    updatedAt: new Date().toISOString(),
  };

  userTable.set(id, next);

  return clone(next);
}