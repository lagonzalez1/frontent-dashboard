/**
 * Purpose:     Auth state for access token.
 * 
 * Description: This class serves the puspose of managing access token for API calls to server.
 *              Short expiration time (30min) helps with security, primaraly by relying on 2 tokens, 
 *              rather than a single. 
 *
 *              
 */
import axios from "axios";
import { setBuisness } from "../reducers/buisness";
import { setIndex, setUser } from "../reducers/user";
const TOKEN_KEY = 'access_token';
const BUISNESS = 'buisness';
const USER = 'user';


  export const getStateData = () => {
    const buisness = JSON.parse(localStorage.getItem(BUISNESS));
    const user = JSON.parse(localStorage.getItem(USER));
    return { user, buisness };
  }

export const setAccessToken = (accessToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  };
  
  export const getAccessToken = () => {
    return localStorage.getItem(TOKEN_KEY);
  };
  
  export const removeAccessToken = () => {
    localStorage.removeItem(TOKEN_KEY);
  };

  export const removeBuisnessState = () => {
    localStorage.removeItem(BUISNESS);
  }

  export const removeUser = () => {
    localStorage.removeItem(USER);
  }
  
  export const removeUserState = () => {
    removeUser();
    removeAccessToken();
    removeBuisnessState();
  }
  
  export const isAuthenticated = async (dispatch) => {
    
    try {
      const status = await checkAccessToken();
      dispatch(setBuisness(status.buisness));
      dispatch(setUser({ id: status.id, email: status.email}))
      dispatch(setIndex(status.defaultIndex))
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  

  // Issue: The token being passed into function is not being utilized.
  //        The token used in cookie-parse rather.
  //        What i need to do: Configure a header object and pass it via Auth Bearer 'Token'
  async function checkAccessToken() {
    const token = getAccessToken();
    const { user, _ } = getStateData();
    const id = user.id;
    const email = user.email;
    try {
      const response = await axios.post('/api/internal/refresh_access', { id, email }, { headers: {'x-access-token': token} });
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }