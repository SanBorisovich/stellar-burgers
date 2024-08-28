import { configureStore } from '@reduxjs/toolkit';
import * as api from '../../utils/burger-api';
import { expect, test, describe, jest, afterEach } from '@jest/globals';
import { getIngredientsThunk } from './action';
import { ingredientsSlice, selectIngredients, selectIsLoading } from './slice';

jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

const expectedIngredients = [
  {
    _id: 'item-1',
    name: 'Test Item 1',
    type: 'sauce',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 60,
    price: 180,
    image: 'test-image.jpg',
    image_large: 'test-image-large.jpg',
    image_mobile: 'test-image-mobile.jpg'
  },
  {
    _id: 'item-2',
    name: 'Test Item 2',
    type: 'bun',
    proteins: 20,
    fat: 10,
    carbohydrates: 20,
    calories: 50,
    price: 180,
    image: 'test-image.jpg',
    image_large: 'test-image-large.jpg',
    image_mobile: 'test-image-mobile.jpg'
  }
];

describe('тесты асинхронных экшенов', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('состояние изменяется при успешном запросе', async () => {
    const store = configureStore({
      reducer: ingredientsSlice.reducer
    });
    const getIngredientsMock = jest
      .spyOn(api, 'getIngredientsApi')
      .mockResolvedValue(expectedIngredients);

    await store.dispatch(getIngredientsThunk());
    const state = store.getState();

    expect(getIngredientsMock).toHaveBeenCalled();
    expect(state.ingredients).toEqual(expectedIngredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  test('обновление error при отклонении промиса', async () => {
    const store = configureStore({
      reducer: ingredientsSlice.reducer
    });
    const errorMessage = 'Ошибка загрузки';
    const getIngredientsMock = jest
      .spyOn(api, 'getIngredientsApi')
      .mockRejectedValue(new Error(errorMessage));

    await store.dispatch(getIngredientsThunk());
    const state = store.getState();

    expect(getIngredientsMock).toBeCalled();
    expect(state.error).toBe(errorMessage);
  });
});

describe('тесты селекторов', () => {
  const store = configureStore({
    reducer: ingredientsSlice.reducer
  });

  test('selectIsLoading должен возвращать состояние загрузки', () => {
    let isLoading = selectIsLoading({ ingredients: store.getState() });
    expect(isLoading).toEqual(false);
    store.dispatch({ type: 'ingredients/getAll/pending' });
    isLoading = selectIsLoading({ ingredients: store.getState() });
    expect(isLoading).toBe(true);
  });

  test('selectIngredients должен возвращать ингредиенты', () => {
    store.dispatch({
      type: 'ingredients/getAll/fulfilled',
      payload: expectedIngredients
    });
    const ingredients = selectIngredients({ ingredients: store.getState() });
    expect(ingredients).toEqual(expectedIngredients);
  });
});
