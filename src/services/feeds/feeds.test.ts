import { configureStore } from '@reduxjs/toolkit';
import * as api from '../../utils/burger-api';
import { expect, test, describe, jest, afterEach } from '@jest/globals';
import {
  feedsSlice,
  selectIsLoading,
  selectOrders,
  selectTotal,
  selectTotalToday
} from './slice';
import { getFeedsThunk } from './action';

jest.mock('../../utils/burger-api', () => ({
  getFeedsApi: jest.fn()
}));

const expectedOrders = [
  {
    _id: 'item-1',
    status: 'done',
    name: 'Test Item 1',
    createdAt: '01-01-1990',
    updatedAt: '02-01-1990',
    number: 1,
    ingredients: ['test-id-1', 'test-id-2']
  },
  {
    _id: 'item-2',
    status: 'done',
    name: 'Test Item 2',
    createdAt: '01-01-1990',
    updatedAt: '02-01-1990',
    number: 2,
    ingredients: ['test-id-1', 'test-id-2']
  }
];

const mockResult = {
  success: true,
  orders: expectedOrders,
  total: 2,
  totalToday: 2
};

describe('тесты асинхронных экшенов', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('состояние изменяется при успешном запросе', async () => {
    const store = configureStore({
      reducer: feedsSlice.reducer
    });
    const getFeedsMock = jest
      .spyOn(api, 'getFeedsApi')
      .mockResolvedValue(mockResult);

    await store.dispatch(getFeedsThunk());
    const state = store.getState();

    expect(getFeedsMock).toHaveBeenCalled();
    expect(state.orders).toEqual(mockResult.orders);
    expect(state.total).toEqual(mockResult.total);
    expect(state.totalToday).toEqual(mockResult.totalToday);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  test('обновление error при отклонении промиса', async () => {
    const store = configureStore({
      reducer: feedsSlice.reducer
    });
    const errorMessage = 'Ошибка загрузки';
    const getFeedsMock = jest
      .spyOn(api, 'getFeedsApi')
      .mockRejectedValue(new Error(errorMessage));

    await store.dispatch(getFeedsThunk());
    const state = store.getState();

    expect(getFeedsMock).toBeCalled();
    expect(state.error).toBe(errorMessage);
  });
});

describe('тесты селекторов', () => {
  const store = configureStore({
    reducer: feedsSlice.reducer
  });

  test('selectOrders должен возвращать пустой массив, если нет заказов', () => {
    const orders = selectOrders({ feeds: store.getState() });
    expect(orders).toEqual([]);
  });

  test('selectIsLoading должен возвращать состояние загрузки', () => {
    let isLoading = selectIsLoading({ feeds: store.getState() });
    expect(isLoading).toEqual(false);
    store.dispatch({ type: 'feeds/getAll/pending' });
    isLoading = selectIsLoading({ feeds: store.getState() });
    expect(isLoading).toEqual(true);
  });

  test('selectOrders должен возвращать заказы', () => {
    store.dispatch({
      type: 'feeds/getAll/fulfilled',
      payload: { orders: expectedOrders, total: 2, totalToday: 2 }
    });
    const orders = selectOrders({ feeds: store.getState() });
    expect(orders).toEqual(expectedOrders);
  });

  test('selectTotal должен возвращать общее количество', () => {
    store.dispatch({
      type: 'feeds/getAll/fulfilled',
      payload: { orders: expectedOrders, total: 2, totalToday: 2 }
    });
    const total = selectTotal({ feeds: store.getState() });
    expect(total).toBe(2);
  });

  test('selectTotalToday должен возвращать количество за сегодня', () => {
    store.dispatch({
      type: 'feeds/getAll/fulfilled',
      payload: { orders: expectedOrders, total: 2, totalToday: 2 }
    });
    const totalToday = selectTotalToday({ feeds: store.getState() });
    expect(totalToday).toBe(2);
  });
});
