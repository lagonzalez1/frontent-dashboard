import { createSlice } from '@reduxjs/toolkit';
import { setBusiness } from './business';

const initialState = {
  id: null,
  email: null,
  permissions: null,
  defaultIndex : null,
  isLoggedIn: false,
  reload: false,
  businessRef: null,
  requestStatus: false,
  requestMessage: null,
  requestType: null,
  location: null,
  searchDate: null,
  options: null,
};


// Dont set the location so many times to keep in the same page.
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.isLoggedIn = true;
      state.permissions = action.payload.permissions;
    },
    logoutUser: (state) => {
      state.email = null;
      state.id = null;
      state.isLoggedIn = false;
      state.permissions = null;
    },
    setIndex: (state, action) => {
      state.defaultIndex = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setSnackbar: (state, action) => {
      state.requestMessage = action.payload.requestMessage;
      state.requestStatus = action.payload.requestStatus;
      state.requestType = action.payload.requestType;
    },
    setBusinessRef: (state, action) => {
      state.businessRef = action.payload;
    },
    setReload: (state, action) => {
      state.reload = action.payload;
    },
    setOptions: (state, action) => {
      state.options = action.payload;
    }
    
  },
});

export const { setUser, logoutUser, setPermisisons, setIndex, setLocation, 
  setSnackbar, setBusinessRef, setReload, setSearchDate, setOptions } = userSlice.actions;
export default userSlice.reducer;