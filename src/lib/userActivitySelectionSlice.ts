import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserActivity, UserActivitySelection } from "../types/user";
import moment from "moment";

const initialState: UserActivitySelection = {
    start: moment().startOf('month').unix(),
    end: moment().endOf('day').unix(),
    reloadActivities: true,
    filterAdmins: true,
    currentLogins: 0,
    currentActivities: []
};

export const userActivitySelectionSlice = createSlice({
    name: 'userActivitySelection',
    initialState,
    reducers: {
        setUserActivityDateRange: (state, action: PayloadAction<UserActivitySelection>) => {
            state.start = action.payload.start;
            state.end = action.payload.end;
            state.reloadActivities = true;
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
        setCurrentActivities: (state, action: PayloadAction<UserActivity[]>) => {
            state.currentActivities = action.payload;
            return state;
        },
        setFilterAdmins: (state, action: PayloadAction<boolean>) => {
            state.filterAdmins = action.payload;
            state.reloadActivities = true;
            return state;
        },
        resetUserActivity: (state) => {
            state.start = moment().startOf('month').unix();
            state.end = moment().endOf('day').unix();
            state.reloadActivities = true;
            state.filterAdmins = true;
            state.currentLogins = 0;
            return state;
        }
    }
})

export const { setUserActivityDateRange, 
               setReloadActivities, 
               setCurrentLogins,
               resetUserActivity, 
               setFilterAdmins, 
               setCurrentActivities
             } = userActivitySelectionSlice.actions

export default userActivitySelectionSlice.reducer