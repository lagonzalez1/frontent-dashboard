import { configureStore, applyMiddleware  } from '@reduxjs/toolkit';
import userReducer from '../reducers/user';
import buisnessReducer from '../reducers/buisness';


const saveToLocalStorage = (store) => (next) => (action) => {
  const result = next(action); // Call the next middleware or reducer

  // Save user and business data to local storage
  const { user, business } = store.getState();
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('business', JSON.stringify(business));

  return result;
};

const store = configureStore({
  reducer: {
    user: userReducer,
    buisness: buisnessReducer,
  },
  middleware:  (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(saveToLocalStorage),
});

export default store;