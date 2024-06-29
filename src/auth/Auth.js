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
import { setIndex, setLocation, setOptions, setUser } from "../reducers/user";
import { useSelector } from "react-redux";
import { setAuthAccessToken, setAuthCookieToken } from "../reducers/tokens";
import Cookies from 'js-cookie'


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
      const token = localStorage.getItem(TOKEN_KEY);
      return { headers: { 'x-access-token': token } }
    }
    else { return {} }
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

  export const updateBusinessIndex = async (businessId) => {
    const header = getHeaders();
    const { user, _ } = getStateData();
    const [id, email] = [user.id, user.email];
    return new Promise((resolve, reject) => {
      axios.post('/api/internal/update_business_index', {id, email, businessId}, header)
      .then(response => {
        resolve(response.data.msg)
      })
      .catch(error => {
        reject(error);
      })
    })
  }
  
  export const authenticateUser = () => {
    
  }


  // MISSING ACCESS_TOKEN AND BID

  /**
   * 
   * @param {Redux Obj} dispatch  Sync available data to store. 
   * @returns                     Boolean: Aauthenticate state. 
   */
  export const isAuthenticated = async (dispatch, authId, authEmail) => {
    if (!checkLocalStorage()) {
      return false;
    }
    try {
      const status = await checkAccessToken(authId, authEmail);
      dispatch(setBusiness(status.business));
      // This is what im missing. Subscription details for SubscriptionContext
      dispatch(setUser({ id: status.id, email: status.email, permissions: status.permissions, subscription: status.subscription, 
        trial: status.trial, trialStatus: status.trialStatus, emailConfirm: status.emailConfirm }));
      dispatch(setIndex(status.defaultIndex)); 
      dispatch(setAuthAccessToken(status.accessToken)); // 
      dispatch(setAuthCookieToken(status.token)); // 
      dispatch(setLocation(0)); 
      dispatch(setOptions(status.businessOptions));
      return true;
    } catch (error) {
      return false;
    }
  };
  


  // Issue: The token being passed into function is not being utilized.
  //        The token used in cookie-parse rather.
  //        What i need to do: Configure a header object and pass it via Auth Bearer 'Token'
  async function checkAccessToken(authId, authEmail) {
    try {
      const all = Cookies.get();
      const access_token = Cookies.get('accessToken');
      console.log("Access token on file", access_token);
      const response = await axios.post('/api/internal/refresh_access', { id: authId, email: authEmail }, { headers: { 'x-access-token': access_token } });
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to refresh access token');
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error; // Re-throw the error to propagate it to the caller
    }
  }
  