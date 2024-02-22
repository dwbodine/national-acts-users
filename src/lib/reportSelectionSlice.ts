import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserReportSelection } from "../types/user";
import moment from 'moment';

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
            state.reloadEvents = (previousSellerId != state.sellerId);
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
            return state;
        },
        setShowDeleted: (state, action: PayloadAction<boolean>) => {
            const previousDeleted = state.showDeleted;
            const newDeleted = action.payload;
            state.showDeleted = newDeleted;
            state.reloadEvents = (previousDeleted != newDeleted);
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
            return state;
        },
    }
})

export const { setSellerId, setDateRange, setReloadEvents, setShowInactive, setShowDeleted, resetSelection } = userReportSelectionSlice.actions

export default userReportSelectionSlice.reducer