import { createSelector, current } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

export const selectChatById = (state, chatterId) => state.businessChatter.listOfChats.find(chat => chat._id === chatterId);
/*
let currentDate = DateTime.local().setZone(business.timezone);
    let weekday = currentDate.weekdayLong;
    let currentSchedule = business.schedule[weekday];
    const override = business.accepting_override;
*/


export const selectMessagesByChatId = createSelector(
    [selectChatById],
    (chat) => chat ? chat.messages : []
);


