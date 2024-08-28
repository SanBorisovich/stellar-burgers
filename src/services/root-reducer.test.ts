import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';
import { describe, test, expect } from '@jest/globals';

describe('rootReducer', () => {
  const store = configureStore({
    reducer: rootReducer
  });

  test('должен корректно инициализировать начальное состояние', () => {
    const state = store.getState();
    expect(state.ingredients).toEqual({
      error: null,
      ingredients: [],
      isLoading: false
    });
    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
    expect(state.feeds).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    });
    expect(state.user).toEqual({
      data: null,
      order: null,
      orders: [],
      orderModalData: null,
      orderRequest: false,
      isAuthChecked: false,
      isAuthenticated: false,
      loginUserRequest: false,
      error: null
    });
  });
});
