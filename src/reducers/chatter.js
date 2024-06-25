import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    messageList: null
}


const chatterSlice = createSlice({
    name: 'chatter',
    initialState,
    reducers: {
      setMessageList: (state, action) => {
        state.messageList = action.payload;
      },
      addToList: (state, action) => {
        if (state.messageList === null) { return; }
        state.messageList.push(action.payload);
      }
    }
});
  
  
  
  
  
  export const { setMessageList, addToList } = chatterSlice.actions;
  export default chatterSlice.reducer;