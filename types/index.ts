import type { UIMessage } from 'ai';

// Sidebar関連の型
export type SidebarItem = {
  title: string;
  description?: string;
  href: string;
};

export type SidebarProps = {
  heading: string;
  subheading: string;
  items: SidebarItem[];
  className?: string;
};

// ユーザー関連の型
export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  bio: string;
  updatedAt: string;
};

export type UserUpdateInput = Partial<Omit<UserRecord, 'id' | 'updatedAt'>>;

// ユーザー更新フォーム関連の型
export type UpdateUserFormState = {
  status: "idle" | "success" | "error";
  message: string;
  refreshedAt?: string;
};

export type UpdateUserFormValidationSuccess = {
  kind: "success";
  id: string;
  payload: UserUpdateInput;
};

export type UpdateUserFormValidationError = {
  kind: "error";
  formState: UpdateUserFormState;
};

export type UpdateUserFormValidationResult =
  | UpdateUserFormValidationSuccess
  | UpdateUserFormValidationError;

export type UpdateUserAction = (
  prevState: UpdateUserFormState | undefined,
  formData: FormData,
) => Promise<UpdateUserFormState>;

export type UserUpdateFormProps = {
  userId: string;
  defaults: {
    name: string;
    email: string;
    bio: string;
    role: "admin" | "member";
  };
  action: UpdateUserAction;
};

// Chat関連の型
export type ChatEmptyStateProps = {
  title: string;
  examples?: string[];
};

export type MessagePartProps = {
  part: UIMessage['parts'][number];
};

export type ChatInputFormProps = {
  input: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  errorMessage?: string;
};

export type ChatHeaderProps = {
  title: string;
  description?: string;
};

export type ChatMessageProps = {
  message: UIMessage;
};