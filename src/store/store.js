import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/user';
import buisnessReducer from '../reducers/buisness';

const store = configureStore({
  reducer: {
    user: userReducer,
    buisness: buisnessReducer,
  },
});

export default store;