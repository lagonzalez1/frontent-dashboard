import { configureStore  } from '@reduxjs/toolkit';
import userReducer from '../reducers/user';
import businessReducer from '../reducers/business';
import tokensReducer from '../reducers/tokens';
import chatterReducer from "../reducers/chatter";
import businessChatter from '../reducers/businessChatter';


const saveToLocalStorage = (store) => (next) => (action) => {
  const result = next(action); // Call the next middleware or reducer

  // Load or refresh access evvery time -> User (tokens, permissions, email, ids) 
  // Keep and reload based Business info based on localstorage
  // Business keep and use the same state unless reloadBusiness is called and or ws reloads

  // Save user and business data to local storage
  const { user, business, tokens, chatter, businessChatter } = store.getState();
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('business', JSON.stringify(business));
  localStorage.setItem('tokens',JSON.stringify(tokens))
  localStorage.setItem('chatter',JSON.stringify(chatter))
  localStorage.setItem('businessChatter',JSON.stringify(businessChatter))

  return result;
};

const store = configureStore({
  reducer: {
    user: userReducer,
    business: businessReducer,
    tokens: tokensReducer,
    chatter: chatterReducer,
    businessChatter: businessChatter

  },
  middleware:  (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(saveToLocalStorage),
});

export default store;