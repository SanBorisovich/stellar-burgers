import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  burgerConstructorSlice,
  addItem,
  removeItem,
  moveDown,
  moveUp,
  clearConstructor,
  selectConstructorItems
} from './slice';
import { nanoid } from '@reduxjs/toolkit';

const initialState = {
  bun: null,
  ingredients: []
};
const bun = {
  _id: nanoid(),
  name: 'Test Bun',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 10,
  calories: 30,
  price: 200,
  image: 'test-image.jpg',
  image_large: 'test-image-large.jpg',
  image_mobile: 'test-image-mobile.jpg'
};
const ingredient = {
  _id: nanoid(),
  name: 'Test Ingredient',
  type: 'main',
  proteins: 20,
  fat: 15,
  carbohydrates: 12,
  calories: 37,
  price: 270,
  image: 'test-image.jpg',
  image_large: 'test-image-large.jpg',
  image_mobile: 'test-image-mobile.jpg'
};

describe('тесты реддюсеров', () => {
  beforeEach(() => {
    initialState.bun = null;
    initialState.ingredients = [];
  });

  test('возврат состояния при передаче некорректного экшена', () => {
    const state = burgerConstructorSlice.reducer(initialState, {
      type: '',
      payload: ''
    });
    expect(state).toEqual(initialState);
  });

  test('добавление булки в конструктор', () => {
    const state = burgerConstructorSlice.reducer(initialState, addItem(bun));
    expect(state.bun).toEqual({ ...bun, id: expect.any(String) });
  });

  test('добавление ингредиента в конструктор', () => {
    const state = burgerConstructorSlice.reducer(
      initialState,
      addItem(ingredient)
    );
    expect(state.ingredients[0]).toEqual({
      ...ingredient,
      id: expect.any(String)
    });
  });

  test('удаление ингредиента из конструктора', () => {
    let state = burgerConstructorSlice.reducer(
      initialState,
      addItem(ingredient)
    );
    const removedItem = state.ingredients[0];
    state = burgerConstructorSlice.reducer(state, removeItem(removedItem.id));
    expect(state.ingredients).toEqual([]);
  });

  test('перемещение ингредиента вниз', () => {
    let state = burgerConstructorSlice.reducer(
      initialState,
      addItem(ingredient)
    );
    state = burgerConstructorSlice.reducer(
      state,
      addItem({ ...ingredient, _id: nanoid() })
    );
    state = burgerConstructorSlice.reducer(state, moveDown(0));
    expect(state.ingredients[1]).toEqual(expect.objectContaining(ingredient));
  });

  test('перемещение ингредиента вверх', () => {
    let state = burgerConstructorSlice.reducer(
      initialState,
      addItem({ ...ingredient, _id: nanoid() })
    );
    state = burgerConstructorSlice.reducer(state, addItem(ingredient));
    state = burgerConstructorSlice.reducer(state, moveUp(1));
    expect(state.ingredients[0]).toEqual(expect.objectContaining(ingredient));
  });

  test('очистка конструктора', () => {
    let state = burgerConstructorSlice.reducer(initialState, addItem(bun));
    state = burgerConstructorSlice.reducer(state, addItem(ingredient));
    state = burgerConstructorSlice.reducer(state, clearConstructor());
    expect(state).toEqual(initialState);
  });
});

describe('тесты селекторов', () => {
  test('получение состояния', () => {
    const constructorItems = selectConstructorItems({
      burgerConstructor: initialState
    });
    expect(constructorItems).toEqual(initialState);
  });
});
