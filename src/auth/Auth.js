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
  
  export const isAuthenticated = () => {
    const accessToken = getAccessToken();
    
  };
  