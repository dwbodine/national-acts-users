import { configureStore } from '@reduxjs/toolkit'
import userReportSelectionReducer from './reportSelectionSlice';
import adminDashboardSelectionReducer from './dashboardSelectionSlice';
import adminSelectionReducer from './adminSelectionSlice';
import adminReportsSelectionReducer from './adminReportsSelectionSlice';
import userActivitySelectionReducer from './userActivitySelectionSlice';
import globalSelectionReducer from './globalSelectionSlice';

export const store = configureStore({
  reducer: {
    globalSelection: globalSelectionReducer,
    reportSelection: userReportSelectionReducer,
    dashboardSelecton: adminDashboardSelectionReducer,
    adminSelection: adminSelectionReducer,
    adminReportSelection: adminReportsSelectionReducer,
    userActivitySelection: userActivitySelectionReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch