import type { PersistedState } from 'redux-persist';

export const discardLegacySelections = (state: PersistedState): PersistedState => {
  if (!state) return state;

  // Legacy IDs cannot be converted to partner mapping IDs in the browser.
  const next: NonNullable<PersistedState> & Record<string, unknown> = { ...state };
  delete next['adminSelection'];
  delete next['reportSelection'];
  return next;
};
