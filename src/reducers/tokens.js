import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    access_token: null,
    cookie_token: null
};

const authTokens = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    // Short term token used to give access.
    setAuthAccessToken: (state, action) => {
      state.access_token = action.payload;
    },
    // Long duration token used for verification
    setAuthCookieToken: (state, action) => {
        state.cookie_token = action.payload;
    }
  },
});

export const { setAuthAccessToken, setAuthCookieToken } = authTokens.actions;
export default authTokens.reducer;