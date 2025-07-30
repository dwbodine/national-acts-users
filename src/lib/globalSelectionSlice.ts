import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { GlobalSelection } from '../types/user';

const initialState: GlobalSelection = {
  isLoading: false,
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
  },
});

export const { setIsLoading, resetGlobalSettings } = globalSelectionSlice.actions;

export default globalSelectionSlice.reducer;
