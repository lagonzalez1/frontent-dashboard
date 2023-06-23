import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  email: null,
  permisisons: null,
  isLoggedIn: false,
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

    setPermisisons: (state, action) =>{
      state.permisisons = action.payload;
    }
  },
});

export const { setUser, logoutUser, setPermisisons } = userSlice.actions;
export default userSlice.reducer;