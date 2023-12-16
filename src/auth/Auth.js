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
import { setBusiness } from "../reducers/business";
import { setIndex, setLocation, setUser } from "../reducers/user";
import { useSelector } from "react-redux";
const TOKEN_KEY = 'access_token';
const BUSINESS = 'business';
const USER = 'user';


  export const getStateData = () => {
    const business = JSON.parse(localStorage.getItem(BUSINESS));
    const user = JSON.parse(localStorage.getItem(USER));
    
    return { user, business };
  }

  const checkLocalStorage = () => {
    const user = localStorage.getItem(USER);
    const business = localStorage.getItem(BUSINESS);
    if (!user || !business) {
      return false
    }
    return true;
  }

  export const setAccessToken = (accessToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  };
  
  export const getAccessToken = () => {
    return localStorage.getItem(TOKEN_KEY);
  };

  export const getHeaders = () => {
    if (localStorage.getItem(TOKEN_KEY)){
      const token = localStorage.getItem(TOKEN_KEY)
      return {header: {'x-access-token': token }}
    }
  }
  
  export const removeAccessToken = () => {
    localStorage.removeItem(TOKEN_KEY);
  };

  export const removeBusinessState = () => {
    localStorage.removeItem(BUSINESS);
  }

  export const removeUser = () => {
    localStorage.removeItem(USER);
  }
  
  export const removeUserState = () => {
    removeUser();
    removeAccessToken();
    removeBusinessState();
  }
  

  /**
   * 
   * @param {Redux Obj} dispatch  Sync available data to store. 
   * @returns                     Boolean: Aauthenticate state. 
   */
  export const isAuthenticated = async (dispatch) => {
    if (!checkLocalStorage()) {
      return false;
    }
    try {
      const status = await checkAccessToken();
      dispatch(setBusiness(status.business));
      dispatch(setUser({ id: status.id, email: status.email, permissions: status.permissions}))
      dispatch(setIndex(status.defaultIndex));
      dispatch(setLocation(0));
      return true;
    } catch (error) {
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
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }