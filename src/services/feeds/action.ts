import { getFeedsApi } from '../../utils/burger-api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getFeedsThunk = createAsyncThunk('feeds/getAll', getFeedsApi);
