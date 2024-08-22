import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AdminSelection, Role, User } from "../types/user";

const initialState: AdminSelection = {
    reloadUsers: true,
    selectedUser: undefined,
    reloadRoles: true,
    selectedRole: undefined
};

export const adminSelectionSlice = createSlice({
    name: 'adminSelection',
    initialState,
    reducers: {
        setReloadUsers: (state, action: PayloadAction<boolean>) =>{
            state.reloadUsers = action.payload;
            if (state.reloadUsers) {
                state.selectedUser = undefined;
                state.users = undefined;
            }
            return state;
        },
        setSelectedUser: (state, action: PayloadAction<User>) => {
            state.selectedUser = action.payload;
            return state;
        },
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
            state.reloadUsers = false;
            return state;
        },
        setReloadRoles: (state, action: PayloadAction<boolean>) =>{
            state.reloadRoles = action.payload;
            if (state.reloadRoles) {
                state.selectedRole = undefined;
                state.roles = undefined;
            }
            return state;
        },
        setSelectedRole: (state, action: PayloadAction<Role>) => {
            state.selectedRole = action.payload;
            return state;
        },
        setRoles: (state, action: PayloadAction<Role[]>) => {
            state.roles = action.payload;
            state.reloadRoles = false;
            return state;
        },
        resetAdmin: (state) => {
            state.reloadUsers = true;
            state.selectedUser = undefined;
            state.reloadRoles = true;
            state.selectedRole = undefined;
            state.roles = undefined;
            state.users = undefined;
            return state;
        }
    }
})

export const { setReloadUsers,
               setSelectedUser,
               setUsers,
               setReloadRoles,
               setSelectedRole,
               setRoles,
               resetAdmin
             } = adminSelectionSlice.actions

export default adminSelectionSlice.reducer