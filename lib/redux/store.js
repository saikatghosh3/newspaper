'use client';
import { configureStore } from '@reduxjs/toolkit';
import readerReducer from './readerSlice';

export const store = configureStore({
  reducer: {
    reader: readerReducer,
  },
});
