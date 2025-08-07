import { AdminDashboardSelection, IDashboardData } from '../types/user';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const initialState: AdminDashboardSelection = {
  currentDashboardData: undefined,
  end: moment().endOf('day').unix(),
  reloadOrders: true,
  start: moment().startOf('month').unix(),
};

export const adminDashboardSelectionSlice = createSlice({
  initialState,
  name: 'adminDashboardSelection',
  reducers: {
    resetDashboard: (state) => {
      state.start = moment().startOf('month').unix();
      state.end = moment().endOf('day').unix();
      state.reloadOrders = true;
      state.dashboardTotals = undefined;
      state.currentDashboardData = undefined;
      return state;
    },
    setCurrentDashboardData: (state, action: PayloadAction<IDashboardData>) => {
      state.currentDashboardData = action.payload;
      return state;
    },
    setDashboardDateRange: (state, action: PayloadAction<AdminDashboardSelection>) => {
      state.start = action.payload.start;
      state.end = action.payload.end;
      state.reloadOrders = true;
      state.dashboardTotals = undefined;
      state.currentDashboardData = undefined;
      return state;
    },
    setReloadDashboardOrders: (state, action: PayloadAction<boolean>) => {
      state.reloadOrders = action.payload;
      return state;
    },
  },
});

export const {
  setDashboardDateRange,
  setReloadDashboardOrders,
  resetDashboard,
  setCurrentDashboardData,
} = adminDashboardSelectionSlice.actions;

export default adminDashboardSelectionSlice.reducer;
