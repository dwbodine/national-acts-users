import { describe, expect, it } from 'vitest';

import adminDataReducer from './adminDataSelectionSlice';
import adminEventsReducer from './adminEventsSelectionSlice';
import adminReportsReducer from './adminReportsSelectionSlice';
import adminReducer from './adminSelectionSlice';
import dashboardReducer from './dashboardSelectionSlice';
import globalReducer from './globalSelectionSlice';
import reportReducer from './reportSelectionSlice';
import userActivityReducer from './userActivitySelectionSlice';

describe('selection slice reducers', () => {
  it('returns initial state for each reducer', () => {
    expect(adminDataReducer(undefined, { type: 'test/init' })).toBeDefined();
    expect(adminEventsReducer(undefined, { type: 'test/init' })).toBeDefined();
    expect(adminReportsReducer(undefined, { type: 'test/init' })).toBeDefined();
    expect(adminReducer(undefined, { type: 'test/init' })).toBeDefined();
    expect(dashboardReducer(undefined, { type: 'test/init' })).toBeDefined();
    expect(globalReducer(undefined, { type: 'test/init' })).toEqual({
      isLoading: false,
      saveInProgress: false,
    });
    expect(reportReducer(undefined, { type: 'test/init' })).toBeDefined();
    expect(userActivityReducer(undefined, { type: 'test/init' })).toBeDefined();
  });
});
