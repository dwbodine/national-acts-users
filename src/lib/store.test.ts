import { describe, expect, it } from 'vitest';

import { setIsLoading } from './globalSelectionSlice';
import { persistor, store } from './store';

describe('store', () => {
  it('creates the persisted redux store with all lib reducers', () => {
    store.dispatch(setIsLoading(true));

    const state = store.getState();

    expect(state.globalSelection.isLoading).toBe(true);
    expect(state.adminDataSelection).toBeDefined();
    expect(state.adminReportSelection).toBeDefined();
    expect(state.adminSelection).toBeDefined();
    expect(state.dashboardSelection).toBeDefined();
    expect(state.eventAdminSelection).toBeDefined();
    expect(state.globalSelection).toBeDefined();
    expect(state.reportSelection).toBeDefined();
    expect(state.userActivitySelection).toBeDefined();
    expect(typeof persistor.persist).toBe('function');
  });
});
