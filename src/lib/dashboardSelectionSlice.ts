import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AdminDashboardSelection, IDashboardData } from "../types/user";
import moment from "moment";

const initialState: AdminDashboardSelection = {
    start: moment().startOf('month').unix(),
    end: moment().endOf('day').unix(),
    reloadOrders: true,
    currentDashboardData: undefined
};

export const adminDashboardSelectionSlice = createSlice({
    name: 'adminDashboardSelection',
    initialState,
    reducers: {
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
        setCurrentDashboardData: (state, action: PayloadAction<IDashboardData>) => {
            state.currentDashboardData = action.payload;
            return state;
        },
        resetDashboard: (state) => {
            state.start = moment().startOf('month').unix();
            state.end = moment().endOf('day').unix();
            state.reloadOrders = true;
            state.dashboardTotals = undefined;
            state.currentDashboardData = undefined;
            return state;
        }
    }
})

export const { setDashboardDateRange, 
               setReloadDashboardOrders,
               resetDashboard, 
               setCurrentDashboardData
             } = adminDashboardSelectionSlice.actions

export default adminDashboardSelectionSlice.reducer