/**
 * 
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
const TOKEN_KEY = 'access_token';



export const setAccessToken = (accessToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  };
  
  export const getAccessToken = () => {
    return localStorage.getItem(TOKEN_KEY);
  };
  
  export const removeAccessToken = () => {
    localStorage.removeItem(TOKEN_KEY);
  };
  
  export const isAuthenticated = async (id,email, dispatch) => {
    try {
      const status = await checkAccessToken(id,email);
      dispatch(setBuisness(status.data.buisness));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  

  // Issue: The token being passed into function is not being utilized.
  //        The token used in cookie-parse rather.
  //        What i need to do: Configure a header object and pass it via Auth Bearer 'Token'
  async function checkAccessToken(id, email) {
    const token = getAccessToken();
    try {
      const response = await axios.post('/api/internal/refresh_access', { id, email }, { headers: {'x-access-token': token} });
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }