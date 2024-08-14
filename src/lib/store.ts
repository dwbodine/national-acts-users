import { configureStore } from '@reduxjs/toolkit'
import userReportSelectionReducer from './reportSelectionSlice';
import adminDashboardSelectionReducer from './dashboardSelectionSlice';
import adminSelectionReducer from './adminSelectionSlice';

export const store = configureStore({
  reducer: {
    reportSelection: userReportSelectionReducer,
    dashboardSelecton: adminDashboardSelectionReducer,
    adminSelection: adminSelectionReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch