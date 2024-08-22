import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User, UserReportSelection, UserSeller } from "../types/user";
import { SellerType, VipEvent } from "@/types/event";

const initialState: UserReportSelection = {
    seller: {
        sellerId: 0,
        sellerName: '',
        sellerType: SellerType.Artist
    },
    start: 0,
    end: 0,
    showDeleted: false,
    showDeletedOrders: false,
    showInactive: false,
    showInactiveOrders: false,
    reloadEvents: true,
    hideRevenue: true,
    hideServiceFees: true,
    currentEvents: [],
    focusControl: ''
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
                const currentUserStr = localStorage.getItem('currentUser') || undefined;
                if (currentUserStr) {
                    let currentUser = JSON.parse(currentUserStr) as User;
                    currentUser.selectedSellerId = action.payload.sellerId;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
            } else {
                state.reloadEvents = false;
            }
            state.seller = action.payload;
            state.start = 0;
            state.end = 0;
            state.showDeleted = false;
            state.showDeletedOrders = false;
            state.showInactive = false;
            state.showInactiveOrders = true;
            state.retainDateSelection = false;
            if (state.reloadEvents) {
                state.currentEvents = [];
            }
            return state;
        },
        setEventSeller: (state, action: PayloadAction<UserReportSelection>) => {
            state.seller = action.payload.seller;
            state.hideRevenue = action.payload.hideRevenue;
            state.hideServiceFees = action.payload.hideServiceFees;
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
        setShowInactiveOrders: (state, action: PayloadAction<boolean>) => {
            const previousInactive = state.showInactiveOrders;
            const newInactive = action.payload;
            state.showInactiveOrders = newInactive;
            state.reloadEvents = (previousInactive != newInactive);
            return state;
        },
        setShowDeleted: (state, action: PayloadAction<boolean>) => {
            const previousDeleted = state.showDeleted;
            const newDeleted = action.payload;
            state.showDeleted = newDeleted;
            state.showInactive = state.showDeleted;
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
        setShowDeletedOrders: (state, action: PayloadAction<boolean>) => {
            const previousDeleted = state.showDeletedOrders;
            const newDeleted = action.payload;
            state.showDeletedOrders = newDeleted;
            state.showInactiveOrders = state.showDeletedOrders;
            state.reloadEvents = (previousDeleted != newDeleted);
            return state;
        },
        setHideRevenue: (state, action: PayloadAction<boolean>) => {
            state.hideRevenue = action.payload;
            state.reloadEvents = false;
            const currentUserStr = localStorage.getItem('currentUser') || undefined;
            if (currentUserStr) {
                let currentUser = JSON.parse(currentUserStr) as User;
                currentUser.selectedHideRevenue = action.payload;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            return state;
        },
        setHideServiceFees: (state, action: PayloadAction<boolean>) => {
            state.hideServiceFees = action.payload;
            state.reloadEvents = false;
            const currentUserStr = localStorage.getItem('currentUser') || undefined;
            if (currentUserStr) {
                let currentUser = JSON.parse(currentUserStr) as User;
                currentUser.selectedHideServiceFees = action.payload;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
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
        setFocusControl: (state, action: PayloadAction<string>) => {
            state.focusControl = action.payload;
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
                sellerName: '',
                sellerType: SellerType.Artist
            };
            state.start = 0;
            state.end = 0;
            state.showDeleted = false;
            state.showInactive = false;
            state.reloadEvents = true;
            state.retainDateSelection = false;
            state.currentEvents = [];
            return state;
        }
    }
})

export const { setSeller, 
               setDateRange, 
               setReloadEvents, 
               setShowInactive, 
               setShowDeleted, 
               resetSelection, 
               setEvents, 
               resetAll, 
               setHideRevenue, 
               setHideServiceFees,
               setShowInactiveOrders,
               setShowDeletedOrders, 
               setFocusControl, 
               setEventSeller
             } = userReportSelectionSlice.actions

export default userReportSelectionSlice.reducer