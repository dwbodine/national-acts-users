import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage for web

import eventAdminSelectionReducer from './adminEventsSelectionSlice';
import adminReportsSelectionReducer from './adminReportsSelectionSlice';
import adminSelectionReducer from './adminSelectionSlice';
import adminDashboardSelectionReducer from './dashboardSelectionSlice';
import globalSelectionReducer from './globalSelectionSlice';
import userReportSelectionReducer from './reportSelectionSlice';
import userActivitySelectionReducer from './userActivitySelectionSlice';

const rootReducer = combineReducers({
  adminReportSelection: adminReportsSelectionReducer,
  adminSelection: adminSelectionReducer,
  dashboardSelecton: adminDashboardSelectionReducer, // typo? (selecton)
  eventAdminSelection: eventAdminSelectionReducer,
  globalSelection: globalSelectionReducer,
  reportSelection: userReportSelectionReducer,
  userActivitySelection: userActivitySelectionReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches these action types with non-serializable values
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
