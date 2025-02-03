import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AdminSelection, Role, User } from '../types/user';
import { Order, Seller, Tour, VipEvent } from '@/types/event';
import { SiteSetting } from '@/types/public';

const initialState: AdminSelection = {
  sellerId: undefined,
  start: undefined,
  end: undefined,
  reloadUsers: true,
  reloadEvents: true,
  reloadRoles: true,
  reloadTours: true,
  reloadSettings: true,
  selectedEvent: undefined,
  selectedOrder: undefined,
  selectedUser: undefined,
  selectedRole: undefined,
  selectedTour: undefined,
  allSellers: undefined,
  allSettings: undefined,
  roles: undefined,
  users: undefined,
  events: undefined,
  tours: undefined,
  mustSaveEvent: false,
  mustSaveOrder: false,
  uploadedFile: undefined
};

export const adminSelectionSlice = createSlice({
  name: 'adminSelection',
  initialState,
  reducers: {
    setAdminDates: (state, action: PayloadAction<AdminSelection>) => {
      state.start = action.payload.start;
      state.end = action.payload.end;
      return state;
    },
    setAdminSellerId: (state, action: PayloadAction<number | undefined>) => {
      state.sellerId = action.payload;
      return state;
    },
    setAllSellers: (state, action: PayloadAction<Seller[] | undefined>) => {
      state.allSellers = action.payload;
      return state;
    },
    setAllSettings: (state, action: PayloadAction<SiteSetting[] | undefined>) => {
      state.allSettings = action.payload;
      return state;
    },
    setAdminEvent: (state, action: PayloadAction<VipEvent | undefined>) => {
      state.selectedEvent = action.payload;
      return state;
    },
    setAdminOrder: (state, action: PayloadAction<Order | undefined>) => {
      state.selectedOrder = action.payload;
      return state;
    },
    setAdminTour: (state, action: PayloadAction<Tour | undefined>) => {
      state.selectedTour = action.payload;
      state.start = undefined;
      state.end = undefined;
      return state;
    },
    setReloadUsers: (state, action: PayloadAction<boolean>) => {
      state.reloadUsers = action.payload;
      if (state.reloadUsers) {
        state.selectedUser = undefined;
        state.users = undefined;
      }
      return state;
    },
    setReloadTours: (state, action: PayloadAction<boolean>) => {
      state.reloadTours = action.payload;
      if (state.reloadTours) {
        state.selectedTour = undefined;
        state.tours = undefined;
      }
      return state;
    },
    setReloadSettings: (state, action: PayloadAction<boolean>) => {
      state.reloadSettings = action.payload;
      if (state.reloadSettings) {
        state.allSettings = undefined;
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
    setTours: (state, action: PayloadAction<Tour[]>) => {
      state.tours = action.payload;
      state.reloadTours = false;
      return state;
    },
    setReloadRoles: (state, action: PayloadAction<boolean>) => {
      state.reloadRoles = action.payload;
      if (state.reloadRoles) {
        state.selectedRole = undefined;
        state.roles = undefined;
      }
      return state;
    },
    setAdminEvents: (state, action: PayloadAction<VipEvent[]>) => {
      state.events = action.payload;
      state.selectedEvent = undefined;
      state.selectedOrder = undefined;
      state.reloadEvents = false;
      return state;
    },
    setReloadEvents: (state, action: PayloadAction<boolean>) => {
      state.reloadEvents = action.payload;
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
    setMustSaveEvent: (state, action: PayloadAction<boolean>) => {
      state.mustSaveEvent = action.payload;
      return state;
    },
    setMustSaveOrder: (state, action: PayloadAction<boolean>) => {
      state.mustSaveOrder = action.payload;
      return state;
    },
    setUploadedFile: (state, action: PayloadAction<string | undefined>) => {
      state.uploadedFile = action.payload;
      return state;
    },
    resetAdmin: (state) => {
      state.sellerId = undefined;
      state.start = undefined;
      state.end = undefined;
      state.reloadUsers = true;
      state.reloadRoles = true;
      state.reloadEvents = true;
      state.reloadTours = true;
      state.selectedUser = undefined;
      state.selectedRole = undefined;
      state.selectedEvent = undefined;
      state.selectedOrder = undefined;
      state.selectedTour = undefined;
      state.roles = undefined;
      state.users = undefined;
      state.events = undefined;
      state.tours = undefined;
      state.mustSaveEvent = false;
      state.mustSaveOrder = false;
      state.allSettings = undefined;
      state.reloadSettings = true;
      state.uploadedFile = undefined;
      return state;
    },
  },
});

export const {
  setAdminDates,
  setAdminSellerId,
  setReloadUsers,
  setSelectedUser,
  setUsers,
  setReloadRoles,
  setSelectedRole,
  setRoles,
  resetAdmin,
  setAdminEvent,
  setAdminOrder,
  setReloadEvents,
  setAllSellers,
  setAdminEvents,
  setMustSaveEvent,
  setMustSaveOrder,
  setTours,
  setAdminTour,
  setReloadTours,
  setReloadSettings,
  setAllSettings,
} = adminSelectionSlice.actions;

export default adminSelectionSlice.reducer;
