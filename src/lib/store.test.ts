import { describe, expect, it } from 'vitest';

import { setIsLoading } from './globalSelectionSlice';
import { persistor, store } from './store';

describe('store', () => {
  it('creates the persisted redux store with all lib reducers', () => {
    store.dispatch(setIsLoading(true));

    const state = store.getState();

    expect(state.globalSelection.isLoading).toBe(true);
    expect(state).toEqual(
      expect.objectContaining({
        adminDataSelection: expect.any(Object),
        adminReportSelection: expect.any(Object),
        adminSelection: expect.any(Object),
        dashboardSelection: expect.any(Object),
        eventAdminSelection: expect.any(Object),
        globalSelection: expect.any(Object),
        reportSelection: expect.any(Object),
        userActivitySelection: expect.any(Object),
      }),
    );
    expect(typeof persistor.persist).toBe('function');
  });
});
