import { createSlice } from '@reduxjs/toolkit';

const initialState = {
};

const buisnessSlice = createSlice({
  name: 'buisness',
  initialState,
  reducers: {
    setBuisness: (state, action) => {
      return action.payload;
    }
  },
});

export const { setBuisness } = buisnessSlice.actions;
export default buisnessSlice.reducer;