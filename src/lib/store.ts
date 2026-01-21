import { configureStore } from '@reduxjs/toolkit';

import eventAdminSelectionReducer from './adminEventsSelectionSlice';
import adminReportsSelectionReducer from './adminReportsSelectionSlice';
import adminSelectionReducer from './adminSelectionSlice';
import adminDashboardSelectionReducer from './dashboardSelectionSlice';
import globalSelectionReducer from './globalSelectionSlice';
import userReportSelectionReducer from './reportSelectionSlice';
import userActivitySelectionReducer from './userActivitySelectionSlice';

export const store = configureStore({
  reducer: {
    adminReportSelection: adminReportsSelectionReducer,
    adminSelection: adminSelectionReducer,
    dashboardSelecton: adminDashboardSelectionReducer,
    eventAdminSelection: eventAdminSelectionReducer,
    globalSelection: globalSelectionReducer,
    reportSelection: userReportSelectionReducer,
    userActivitySelection: userActivitySelectionReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
