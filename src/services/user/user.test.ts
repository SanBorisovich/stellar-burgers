import { configureStore } from '@reduxjs/toolkit';
import * as api from '../../utils/burger-api';
import { expect, test, describe, jest, afterEach } from '@jest/globals';
import * as actions from './actions';
import {
  selectAuthChecked,
  selectError,
  selectIsAuthenticated,
  selectIsLoading,
  selectOrder,
  selectOrderModalData,
  selectOrderRequest,
  selectUser,
  selectUserOrders,
  userSlice
} from './slice';

jest.mock('../../utils/burger-api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  forgotPasswordApi: jest.fn(),
  resetPasswordApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn()
}));

const userData = {
  email: 'test@test.com',
  name: 'Test User'
};
const loginUserData = {
  email: 'test@test.com',
  password: 'password'
};

describe('тесты асинхронных экшенов', () => {
  let store = configureStore({
    reducer: userSlice.reducer
  });

  beforeEach(() => {
    store = configureStore({
      reducer: userSlice.reducer
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('регистрация пользователя', async () => {
    const registerUserMock = jest
      .spyOn(api, 'registerUserApi')
      .mockResolvedValue({
        success: true,
        refreshToken: 'test-refresh-token',
        accessToken: 'test-access-token',
        user: userData
      });

    const result = api.registerUserApi({
      name: userData.name,
      email: userData.email,
      password: 'password'
    });

    expect(registerUserMock).toBeCalled();
    expect(result).toEqual(
      Promise.resolve({
        success: true,
        refreshToken: 'test-refresh-token',
        accessToken: 'test-access-token',
        user: userData
      })
    );
  });

  test('логин пользователя', async () => {
    const loginUserMock = jest.spyOn(api, 'loginUserApi').mockResolvedValue({
      success: true,
      refreshToken: 'test-refresh-token',
      accessToken: 'test-access-token',
      user: userData
    });

    await store.dispatch(actions.loginUserThunk(loginUserData));
    const state = store.getState();
    expect(loginUserMock).toBeCalled();
    expect(state.data).toEqual(userData);
  });

  test('должен вернуться success при успешном восствновлени пароля', async () => {
    const forgotPasswordMock = jest
      .spyOn(api, 'forgotPasswordApi')
      .mockResolvedValue({ success: true });

    const result = await api.forgotPasswordApi({ email: userData.email });

    expect(forgotPasswordMock).toBeCalled();
    expect(result.success).toBe(true);
  });

  test('должен вернуться success при успешном сбросе пароля', async () => {
    const resetPasswordMock = jest
      .spyOn(api, 'resetPasswordApi')
      .mockResolvedValue({ success: true });

    const result = await api.resetPasswordApi({
      password: 'password',
      token: 'test-token'
    });

    expect(resetPasswordMock).toBeCalled();
    expect(result.success).toBe(true);
  });

  test('получение данных пользователя', async () => {
    const getUserMock = jest
      .spyOn(api, 'getUserApi')
      .mockResolvedValue({ success: true, user: userData });

    await store.dispatch(actions.getUserThunk());
    const state = store.getState();

    expect(getUserMock).toBeCalled();
    expect(state.data).toEqual(userData);
  });

  test('обновление данных пользователя', async () => {
    const updateUserMock = jest
      .spyOn(api, 'updateUserApi')
      .mockResolvedValue({ success: true, user: userData });

    await store.dispatch(
      actions.updateUserThunk({ ...userData, password: 'password' })
    );
    const state = store.getState();

    expect(updateUserMock).toBeCalled();
    expect(state.data).toEqual(userData);
  });

  test('очистка всех данных пользователя при логауте', async () => {
    const loginUserMock = jest.spyOn(api, 'loginUserApi').mockResolvedValue({
      success: true,
      refreshToken: 'test-refresh-token',
      accessToken: 'test-access-token',
      user: userData
    });
    const logoutMock = jest
      .spyOn(api, 'logoutApi')
      .mockResolvedValue({ success: true });

    await store.dispatch(actions.loginUserThunk(loginUserData));
    await store.dispatch(actions.logoutUserThunk());
    const state = store.getState();

    expect(logoutMock).toBeCalled();
    expect(state.data).toEqual(null);
  });
});

describe('тесты селекторов', () => {
  const store = configureStore({
    reducer: userSlice.reducer
  });

  test('селекторы должны возвращать соответствующие поля', () => {
    const state = { user: store.getState() };

    const user = selectUser(state);
    const authChecked = selectAuthChecked(state);
    const error = selectError(state);
    const isLoading = selectIsLoading(state);
    const isAuthenticated = selectIsAuthenticated(state);
    const orderModalData = selectOrderModalData(state);
    const orderRequest = selectOrderRequest(state);
    const orders = selectUserOrders(state);
    const order = selectOrder(state);

    expect(user).toBeNull();
    expect(authChecked).toBeFalsy();
    expect(error).toBeNull();
    expect(isLoading).toBeFalsy();
    expect(isAuthenticated).toBeFalsy();
    expect(orderModalData).toBeNull();
    expect(orderRequest).toBeFalsy();
    expect(orders).toEqual([]);
    expect(order).toBeNull();
  });
});
