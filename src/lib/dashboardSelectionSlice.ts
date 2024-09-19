import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AdminDashboardSelection, IDashboardData } from "../types/user";
import moment from "moment";

const initialState: AdminDashboardSelection = {
    start: moment().startOf('month').unix(),
    end: moment().endOf('day').unix(),
    reloadActivities: true,
    reloadOrders: true,
    getYearToDateTotals: true,
    filterAdmins: true,
    currentDashboardData: undefined, 
    currentLogins: 0
};

export const adminDashboardSelectionSlice = createSlice({
    name: 'adminDashboardSelection',
    initialState,
    reducers: {
        setDashboardDateRange: (state, action: PayloadAction<AdminDashboardSelection>) => {
            state.start = action.payload.start;
            state.end = action.payload.end;
            state.reloadActivities = true;
            state.reloadOrders = true;
            state.getYearToDateTotals = true;
            state.currentDashboardData = undefined;
            state.currentLogins = 0;
            return state;
        },
        setReloadActivities: (state, action: PayloadAction<boolean>) => {
            state.reloadActivities = action.payload;
            return state;
        },
        setCurrentLogins: (state, action: PayloadAction<number>) => {
            state.currentLogins = action.payload;
            return state;
        },
        setReloadDashboardOrders: (state, action: PayloadAction<boolean>) => {
            state.reloadOrders = action.payload;
            state.getYearToDateTotals = false;
            return state;
        },
        setCurrentDashboardData: (state, action: PayloadAction<IDashboardData>) => {
            state.currentDashboardData = action.payload;
            return state;
        },
        setFilterAdmins: (state, action: PayloadAction<boolean>) => {
            state.filterAdmins = action.payload;
            state.reloadActivities = true;
            return state;
        },
        resetDashboard: (state) => {
            state.start = moment().startOf('month').unix();
            state.end = moment().endOf('day').unix();
            state.reloadActivities = true;
            state.getYearToDateTotals = true;
            state.filterAdmins = true;
            state.reloadOrders = true;
            state.currentDashboardData = undefined;
            state.currentLogins = 0;
            return state;
        }
    }
})

export const { setDashboardDateRange, 
               setReloadActivities, 
               setReloadDashboardOrders,
               setCurrentLogins,
               resetDashboard, 
               setFilterAdmins, 
               setCurrentDashboardData
             } = adminDashboardSelectionSlice.actions

export default adminDashboardSelectionSlice.reducer