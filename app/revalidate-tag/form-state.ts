import type { UpdateUserFormState } from './actions';

const baseState: UpdateUserFormState = {
  status: 'idle',
  message: '',
};

export function createInitialUpdateState(): UpdateUserFormState {
  return { ...baseState };
}