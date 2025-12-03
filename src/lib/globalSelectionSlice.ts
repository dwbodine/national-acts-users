import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GlobalSelection, User } from '../types/user';

const initialState: GlobalSelection = {
  isLoading: false,
  saveInProgress: false,
  currentUser: undefined,
};

export const globalSelectionSlice = createSlice({
  initialState,
  name: 'userActivitySelection',
  reducers: {
    resetGlobalSettings: (state) => {
      state.isLoading = false;
      return state;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      return state;
    },
    setSaveInProgress: (state, action: PayloadAction<boolean>) => {
      state.saveInProgress = action.payload;
      return state;
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      return state;
    },
  },
});

export const { setCurrentUser, setIsLoading, setSaveInProgress, resetGlobalSettings } =
  globalSelectionSlice.actions;

export default globalSelectionSlice.reducer;
