'use client';
import { createSlice } from '@reduxjs/toolkit';

function loadFromStorage() {
  if (typeof window === 'undefined') return { reader: null, token: null, isLoggedIn: false };
  try {
    const token = localStorage.getItem('reader_token');
    const reader = localStorage.getItem('reader');
    if (token && reader) {
      return { reader: JSON.parse(reader), token, isLoggedIn: true };
    }
  } catch {}
  return { reader: null, token: null, isLoggedIn: false };
}

const initialState = loadFromStorage();

const readerSlice = createSlice({
  name: 'reader',
  initialState,
  reducers: {
    login(state, action) {
      state.reader = action.payload.reader;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('reader_token', action.payload.token);
        localStorage.setItem('reader', JSON.stringify(action.payload.reader));
      }
    },
    logout(state) {
      state.reader = null;
      state.token = null;
      state.isLoggedIn = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('reader_token');
        localStorage.removeItem('reader');
      }
    },
    updateProfile(state, action) {
      state.reader = { ...state.reader, ...action.payload };
      if (typeof window !== 'undefined') {
        localStorage.setItem('reader', JSON.stringify(state.reader));
      }
    },
  },
});

export const { login, logout, updateProfile } = readerSlice.actions;
export default readerSlice.reducer;
