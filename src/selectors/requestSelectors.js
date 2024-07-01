import { createSelector } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';


const email = (state) => state.user.email;
const id = (state) => state.user.id;
const bid = (state) => state.user.bid;


export const payloadAuth = createSelector([id, email, bid], (id, email, bid) => { return {id, email, bid}} );
