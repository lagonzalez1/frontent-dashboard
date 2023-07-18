import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusiness: (state, action) => {
      return action.payload;
    }
  },
});

export const { setBusiness } = businessSlice.actions;
export default businessSlice.reducer;