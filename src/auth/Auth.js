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
import { useSignOut } from "react-auth-kit";

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
  
  export const isAuthenticated = async (email) => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        return false;
      }
      const data = await checkAccessToken(email, accessToken);
      removeAccessToken();
      setAccessToken(data.accessToken);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  

  // Issue: The token being passed into function is not being utilized.
  //        The token used in cookie-parse rather.
  //        What i need to do: Configure a header object and pass it via Auth Bearer 'Token'

  function checkAccessToken(email, token) {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/internal/refresh_access', { email })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(new Error('Failed to check access token'));
        });
    });
  }