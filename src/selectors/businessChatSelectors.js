import { createSelector } from '@reduxjs/toolkit';

export const selectChatById = (state, chatterId) => state.businessChatter.listOfChats.find(chat => chat._id === chatterId);

export const selectMessagesByChatId = createSelector(
    [selectChatById],
    (chat) => chat ? chat.messages : []
);


