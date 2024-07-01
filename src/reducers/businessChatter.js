import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    listOfChats: null,
    newChatIds: {}
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
        if (state.listOfChats === null ) { state.listOfChats[0] = {...action.payload} }
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
      addChatId: (state, action) => {
        if (action.payload.id in state.newChatIds) {
          let count = state.newChatIds[action.payload.id].messageCount;
          state.newChatIds[action.payload.id] = { messageCount: count += 1 }
        }else {
          state.newChatIds[action.payload.id] = { messageCount: 1}
        }
        
      },
      removeChatId: (state, action) => {
        if (action.payload.id in state.newChatIds) {
          state.newChatIds[action.payload.id] = { messageCount: 0 }
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
  
  
  
  
  
  export const { setListOfChats, addToList, addMessage, addChatId, removeChatId} = businessChatterSlice.actions;
  export default businessChatterSlice.reducer;