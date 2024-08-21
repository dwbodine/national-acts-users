import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ActiveAdminComponent, AdminSelection } from "../types/user";
import moment from "moment";

const initialState: AdminSelection = {
    activeComponent: ActiveAdminComponent.Index,
    reloadUsers: false,
    selectedUserId: 0,
    reloadRoles: false,
    selectedRoleId: 0
};

export const adminSelectionSlice = createSlice({
    name: 'adminSelection',
    initialState,
    reducers: {
        setActiveComponent: (state, action: PayloadAction<ActiveAdminComponent>) => {
            state.activeComponent = action.payload;
            return state;
        },
        setReloadUsers: (state, action: PayloadAction<boolean>) =>{
            state.reloadUsers = action.payload;
            return state;
        },
        setSelectedUserId: (state, action: PayloadAction<number>) => {
            state.selectedUserId = action.payload;
            return state;
        },
        setReloadRoles: (state, action: PayloadAction<boolean>) =>{
            state.reloadRoles = action.payload;
            return state;
        },
        setSelectedRoleId: (state, action: PayloadAction<number>) => {
            state.selectedRoleId = action.payload;
            return state;
        },
        resetAdmin: (state) => {
            state.activeComponent = ActiveAdminComponent.Index;
            state.reloadUsers = false;
            state.selectedUserId = 0;
            state.reloadRoles = false;
            state.selectedRoleId = 0;
            return state;
        }
    }
})

export const { setActiveComponent, 
               setReloadUsers,
               setSelectedUserId,
               setReloadRoles,
               setSelectedRoleId,
               resetAdmin
             } = adminSelectionSlice.actions

export default adminSelectionSlice.reducer