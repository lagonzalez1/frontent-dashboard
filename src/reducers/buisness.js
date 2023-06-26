import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  buisness: null,
};

const buisnessSlice = createSlice({
  name: 'buisness',
  initialState,
  reducers: {
    setBuisness: (state, action) => {
      state.buisness = action.payload;
    }
  },
});

export const { setBuisness} = buisnessSlice.actions;
export default buisnessSlice.reducer;