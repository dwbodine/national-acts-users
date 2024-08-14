import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ActiveAdminComponent, AdminSelection } from "../types/user";
import moment from "moment";

const initialState: AdminSelection = {
    activeComponent: ActiveAdminComponent.Index
};

export const adminSelectionSlice = createSlice({
    name: 'adminSelection',
    initialState,
    reducers: {
        setActiveComponent: (state, action: PayloadAction<ActiveAdminComponent>) => {
            state.activeComponent = action.payload;
            return state;
        },
        reset: (state) => {
            state.activeComponent = ActiveAdminComponent.Index
            return state;
        }
    }
})

export const { setActiveComponent, 
               reset
             } = adminSelectionSlice.actions

export default adminSelectionSlice.reducer