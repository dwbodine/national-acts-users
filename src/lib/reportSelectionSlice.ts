import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserReportSelection } from "../types/user";
import { VipEvent } from "@/types/event";

const initialState: UserReportSelection = {
    sellerId: 0,
    start: 0,
    end: 0,
    showDeleted: false,
    showInactive: false,
    reloadEvents: true
};

export const userReportSelectionSlice = createSlice({
    name: 'userReportSelection',
    initialState,
    reducers: {
        setSellerId: (state, action: PayloadAction<UserReportSelection>) => {
            const previousSellerId = state.sellerId;
            const newSellerId = action.payload.sellerId;
            state.sellerId = newSellerId;
            state.start = 0;
            state.end = 0;
            state.showDeleted = false;
            state.showInactive = false;
            state.retainDateSelection = false;
            state.reloadEvents = (previousSellerId != state.sellerId);
            if (state.reloadEvents) {
                state.currentEvents = [];
            }
            return state;
        },
        setDateRange: (state, action: PayloadAction<UserReportSelection>) => {
            state.start = action.payload.start;
            state.end = action.payload.end;
            return state;
        },
        setShowInactive: (state, action: PayloadAction<boolean>) => {
            const previousInactive = state.showInactive;
            const newInactive = action.payload;
            state.showInactive = newInactive;
            state.reloadEvents = (previousInactive != newInactive);
            if (!state.retainDateSelection) {
                state.start = 0;
                state.end = 0;
            }
            if (state.reloadEvents) {
                state.currentEvents = [];
            }
            return state;
        },
        setShowDeleted: (state, action: PayloadAction<boolean>) => {
            const previousDeleted = state.showDeleted;
            const newDeleted = action.payload;
            state.showDeleted = newDeleted;
            if (state.showDeleted) {
                state.showInactive = true;
            }
            state.reloadEvents = (previousDeleted != newDeleted);
            if (!state.retainDateSelection) {
                state.start = 0;
                state.end = 0;
            }
            if (state.reloadEvents) {
                state.currentEvents = [];
            }
            return state;
        },
        setEvents: (state, action: PayloadAction<VipEvent[]>) => {
            state.currentEvents = action.payload;
            state.reloadEvents = false;
            return state;
        },
        setReloadEvents: (state, action: PayloadAction<boolean>) => {
            state.reloadEvents = action.payload;
            return state;
        },
        resetSelection: (state, action: PayloadAction<UserReportSelection>) => {
            state.start = 0;
            state.end = 0;
            state.showDeleted = false;
            state.showInactive = false;
            state.reloadEvents = true;
            state.retainDateSelection = false;
            state.currentEvents = [];
            return state;
        },
    }
})

export const { setSellerId, setDateRange, setReloadEvents, setShowInactive, setShowDeleted, resetSelection, setEvents } = userReportSelectionSlice.actions

export default userReportSelectionSlice.reducer