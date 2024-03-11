import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserReportSelection, UserSeller } from "../types/user";
import { VipEvent } from "@/types/event";
import { act } from "react-dom/test-utils";

const initialState: UserReportSelection = {
    seller: {
        sellerId: 0,
        sellerName: ''
    },
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
        setSeller: (state, action: PayloadAction<UserSeller>) => {
            const previousSellerId = state.seller.sellerId;
            const newSellerId = action.payload.sellerId;
            if (previousSellerId != newSellerId) {
                state.seller = action.payload;
                state.reloadEvents = true;
            } else {
                state.reloadEvents = false;
            }
            state.seller = action.payload;
            state.start = 0;
            state.end = 0;
            state.showDeleted = false;
            state.showInactive = false;
            state.retainDateSelection = false;
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
        resetSelection: (state) => {
            state.start = 0;
            state.end = 0;
            state.showDeleted = false;
            state.showInactive = false;
            state.reloadEvents = true;
            state.retainDateSelection = false;
            state.currentEvents = [];
            return state;
        },
        resetAll: (state) => {
            state.seller = {
                sellerId: 0,
                sellerName: ''
            };
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

export const { setSeller, setDateRange, setReloadEvents, setShowInactive, setShowDeleted, resetSelection, setEvents, resetAll } = userReportSelectionSlice.actions

export default userReportSelectionSlice.reducer