import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserActivity, UserActivitySelection } from '../types/user';

const initialState: UserActivitySelection = {
  currentActivities: [],
  currentLogins: 0,
  end: undefined,
  filterAdmins: true,
  reloadActivities: true,
  start: undefined,
};

export const userActivitySelectionSlice = createSlice({
  initialState,
  name: 'userActivitySelection',
  reducers: {
    resetUserActivity: (state) => {
      state.start = undefined;
      state.end = undefined;
      state.reloadActivities = true;
      state.filterAdmins = true;
      state.currentLogins = 0;
      state.currentActivities = [];
      return state;
    },
    setCurrentActivities: (state, action: PayloadAction<UserActivity[]>) => {
      state.currentActivities = action.payload ? [...action.payload] : [];
      return state;
    },
    setCurrentLogins: (state, action: PayloadAction<number>) => {
      state.currentLogins = action.payload;
      return state;
    },
    setFilterAdmins: (state, action: PayloadAction<boolean>) => {
      state.filterAdmins = action.payload;
      state.reloadActivities = true;
      return state;
    },
    setReloadActivities: (state, action: PayloadAction<boolean>) => {
      state.reloadActivities = action.payload;
      return state;
    },
    setUserActivityDateRange: (state, action: PayloadAction<UserActivitySelection>) => {
      state.start = action.payload.start;
      state.end = action.payload.end;
      state.reloadActivities = true;
      state.currentLogins = 0;
      state.currentActivities = [];
      return state;
    },
  },
});

export const {
  setUserActivityDateRange,
  setReloadActivities,
  setCurrentLogins,
  resetUserActivity,
  setFilterAdmins,
  setCurrentActivities,
} = userActivitySelectionSlice.actions;

export default userActivitySelectionSlice.reducer;
