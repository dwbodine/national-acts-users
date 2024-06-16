import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AdminDashboardSelection } from "../types/user";
import { VipEvent } from "@/types/event";
import moment from "moment";

const initialState: AdminDashboardSelection = {
    start: moment().unix() - (30 * 24 * 60 * 60),
    end: moment().unix(),
    reloadEvents: true,
    currentEvents: []
};

export const adminDashboardSelectionSlice = createSlice({
    name: 'adminDashboardSelection',
    initialState,
    reducers: {
        setDateRange: (state, action: PayloadAction<AdminDashboardSelection>) => {
            state.start = action.payload.start;
            state.end = action.payload.end;
            return state;
        },
        setEvents: (state, action: PayloadAction<VipEvent[] | undefined>) => {
            if (action.payload) {
                state.currentEvents = action.payload;
                state.reloadEvents = false;
            } else {
                state.currentEvents = [];
                state.reloadEvents = true;
            }
            
            return state;
        },
        setReloadEvents: (state, action: PayloadAction<boolean>) => {
            state.reloadEvents = action.payload;
            return state;
        },
        resetSelection: (state) => {
            state.start = 0;
            state.end = 0;
            state.reloadEvents = true;
            state.retainDateSelection = false;
            state.currentEvents = [];
            return state;
        },
        resetAll: (state) => {
            state.start = 0;
            state.end = 0;
            state.reloadEvents = true;
            state.retainDateSelection = false;
            state.currentEvents = [];
            return state;
        }
    }
})

export const { setDateRange, 
               setEvents, 
               setReloadEvents, 
               resetSelection,
               resetAll
             } = adminDashboardSelectionSlice.actions

export default adminDashboardSelectionSlice.reducer