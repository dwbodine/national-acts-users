import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AdminDashboardSelection } from "../types/user";
import moment from "moment";

const initialState: AdminDashboardSelection = {
    start: moment().unix(),
    end: moment().unix() + (24 * 60 * 60) - 1,
    reloadActivities: true
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
        resetSelection: (state) => {
            state.start = 0;
            state.end = 0;
            state.reloadActivities = true;
            state.retainDateSelection = false;
            return state;
        },
        resetAll: (state) => {
            state.start = 0;
            state.end = 0;
            state.reloadActivities = true;
            state.retainDateSelection = false;
            return state;
        }
    }
})

export const { setDashboardDateRange, 
               setReloadActivities, 
               resetSelection,
               resetAll
             } = adminDashboardSelectionSlice.actions

export default adminDashboardSelectionSlice.reducer