import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AdminDashboardSelection } from "../types/user";
import moment from "moment";

const initialState: AdminDashboardSelection = {
    start: moment().unix(),
    end: moment().unix() + (24 * 60 * 60),
    reloadActivities: true,
    filterAdmins: true
};

export const adminDashboardSelectionSlice = createSlice({
    name: 'adminDashboardSelection',
    initialState,
    reducers: {
        setDashboardDateRange: (state, action: PayloadAction<AdminDashboardSelection>) => {
            state.start = action.payload.start;
            state.end = action.payload.end;
            state.reloadActivities = true;
            return state;
        },
        setReloadActivities: (state, action: PayloadAction<boolean>) => {
            state.reloadActivities = action.payload;
            return state;
        },
        setFilterAdmins: (state, action: PayloadAction<boolean>) => {
            state.filterAdmins = action.payload;
            state.reloadActivities = true;
            return state;
        },
        resetDashboard: (state) => {
            state.start = moment().unix();
            state.end = moment().unix() + (24 * 60 * 60);
            state.reloadActivities = true;
            state.filterAdmins = true;
            return state;
        }
    }
})

export const { setDashboardDateRange, 
               setReloadActivities, 
               resetDashboard, 
               setFilterAdmins
             } = adminDashboardSelectionSlice.actions

export default adminDashboardSelectionSlice.reducer