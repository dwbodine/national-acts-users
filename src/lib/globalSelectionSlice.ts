import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { GlobalSelection } from '../types/user';

const initialState: GlobalSelection = {
  isLoading: false,
};

export const globalSelectionSlice = createSlice({
  name: 'userActivitySelection',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      return state;
    },
    resetGlobalSettings: (state) => {
      state.isLoading = false;
      return state;
    },
  },
});

export const { setIsLoading, resetGlobalSettings } = globalSelectionSlice.actions;

export default globalSelectionSlice.reducer;
