import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import datasetReducer from './datasetSlice';
import uiReducer from './uiSlice';
import statsReducer from './statsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    datasets: datasetReducer,
    ui: uiReducer,
    stats: statsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
