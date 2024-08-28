import { createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import {
  createOrderThunk,
  getOrderByNumberThunk,
  getUserOrdersThunk,
  getUserThunk,
  loginUserThunk,
  logoutUserThunk,
  updateUserThunk
} from './actions';

export type TAuthState = {
  data: TUser | null;
  order: TOrder | null;
  orders: Array<TOrder>;
  orderModalData: TOrder | null;
  orderRequest: boolean;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginUserRequest: boolean;
  error: any;
};

const initialState: TAuthState = {
  data: null,
  order: null,
  orders: [],
  orderModalData: null,
  orderRequest: false,
  isAuthChecked: false,
  isAuthenticated: false,
  loginUserRequest: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    resetOrderState: (state) => {
      state.orders = [];
      state.orderModalData = null;
    }
  },
  selectors: {
    selectUser: (state) => state.data,
    selectAuthChecked: (state) => state.isAuthChecked,
    selectError: (state) => state.error,
    selectIsLoading: (state) => state.loginUserRequest,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderRequest: (state) => state.orderRequest,
    selectUserOrders: (state) => state.orders,
    selectOrder: (state) => state.order
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message;
        state.isAuthChecked = true;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.data = action.payload.user;
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.data = null;
        state.isAuthenticated = false;
      })
      .addCase(createOrderThunk.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(getUserOrdersThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message;
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.order = action.payload.orders[0];
      });
  }
});

export const { authChecked, resetOrderState } = userSlice.actions;
export const {
  selectUser,
  selectAuthChecked,
  selectError,
  selectIsLoading,
  selectIsAuthenticated,
  selectOrderModalData,
  selectOrderRequest,
  selectUserOrders,
  selectOrder
} = userSlice.selectors;
