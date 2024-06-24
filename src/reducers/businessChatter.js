import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    listOfChats: null
}


const businessChatterSlice = createSlice({
    name: 'businessChatter',
    initialState,
    reducers: {
      // All chats available  
      setListOfChats: (state, action) => {
        state.listOfChats = action.payload;
      },
      // If new chat is created. 
      addToList: (state, action) => {
        state.listOfChats.push(action.payload);
      },

      // Params payload: {chatter_id, message} 
      addMessage: (state, action) => {
        for (let i = 0, n = state.listOfChats.length; i < n; ++i) {
            const clientChat = state.listOfChats[i];
            if (clientChat._id === action.payload.chatter_id) {
                state.listOfChats[i] = {
                    ...clientChat,
                    messages: [...clientChat.messages, action.payload.message]
                };
            }
        }
      },
      getMessages: (state, action) => {
        for (let i = 0, n = state.listOfChats.length; i < n; ++i) {
            const clientChat = state.listOfChats[i];
            if (clientChat._id === action.payload.chatter_id) {
                return clientChat.messages;
            }
        }
      }
    }
});
  
  
  
  
  
  export const { setListOfChats, addToList, addMessage } = businessChatterSlice.actions;
  export default businessChatterSlice.reducer;