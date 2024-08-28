import { burgerConstructorSlice } from './burger-constructor/slice';
import { feedsSlice } from './feeds/slice';
import { combineReducers } from '@reduxjs/toolkit';
import { userSlice } from './user/slice';
import { ingredientsSlice } from './ingredients/slice';

export const rootReducer = combineReducers({
  [ingredientsSlice.reducerPath]: ingredientsSlice.reducer,
  [burgerConstructorSlice.reducerPath]: burgerConstructorSlice.reducer,
  [feedsSlice.reducerPath]: feedsSlice.reducer,
  [userSlice.reducerPath]: userSlice.reducer
});
