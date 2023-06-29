import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  email: null,
  permisisons: null,
  defaultIndex : null,
  isLoggedIn: false,
  location: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.isLoggedIn = true;
    },
    logoutUser: (state) => {
      state.email = null;
      state.id = null;
      state.isLoggedIn = false;
    },
    setIndex: (state, action) => {
      state.defaultIndex = action.payload;
    },
    setPermisisons: (state, action) => {
      state.permisisons = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    }
  },
});

export const { setUser, logoutUser, setPermisisons, setIndex, setLocation } = userSlice.actions;
export default userSlice.reducer;