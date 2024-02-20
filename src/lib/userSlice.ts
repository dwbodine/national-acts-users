import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/user";

const initialState: User = {
    userId: 0,
    username: '',
    isAdmin: false,
    isActive: true,
    showInactiveEvents: false,
    isAuthenticated: false,
    token: ''
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state =  { ...action.payload};
            return state;
        },
        clearUser: (state) => {
            state = {...initialState};
            return state;
        }
    }
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer