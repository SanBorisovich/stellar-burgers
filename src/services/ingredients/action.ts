import { getIngredientsApi } from '../../utils/burger-api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);
