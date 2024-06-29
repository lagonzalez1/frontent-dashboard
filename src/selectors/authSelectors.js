import { createSelector } from '@reduxjs/toolkit';


const atoken = (state) => state.tokens.access_token;
const ctoken = (state) => state.tokens.cookie_token;

const email = (state) => state.user.email;
const id = (state) => state.user.id;


export const authTokens = createSelector( [atoken, ctoken], (access_token, cookie_token) => {return {access_token, cookie_token}} )
export const authFields = createSelector( [email, id], (email, id) =>  {return {email, id}} )