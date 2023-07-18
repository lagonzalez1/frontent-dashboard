import { configureStore  } from '@reduxjs/toolkit';
import userReducer from '../reducers/user';
import businessReducer from '../reducers/business';


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
    business: businessReducer,
  },
  middleware:  (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(saveToLocalStorage),
});

export default store;