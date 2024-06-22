import React, {useState, useEffect } from "react";
import { Container} from "@mui/material";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, AttachmentButton, SendButton, InputToolbox } from '@chatscope/chat-ui-kit-react';
import { DateTime } from "luxon";
import { getChat, sendChatFromClient } from "./ChatHelper";
import useWebSocket, { ReadyState } from "react-use-websocket"
import { useSelector, useDispatch } from 'react-redux';
import { setMessageList } from "../../reducers/chatter"

// Send data through here

export default function ChatComponent({unid}) {


    const DIRECTION_CLIENT = "outgoing";
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [messageList, setMessageListO] = useState([]);
    const [message, setMessage] = useState('');

    const localStorageMessageList = useSelector((state) => state.chatter.messageList);





    // 1. Need to check if chat already exist to load to user. 
    
    // 2. If not just load it from GET


    // SSend via POST or put to backend and save the chat. 
    // Get singleton array to show all messages. (Must be sorted baswed on time);



    useEffect(() => {
        toFetch();    
    }, [])

    useEffect(() => {
        setMessageListO(localStorageMessageList);
    }, [localStorageMessageList])



    const toFetch = async () => {
        if (!localStorageMessageList) {
            setLoading(true);
            const result = await getChat(unid);
            dispatch(setMessageList(result));
        }
    }
    

    const handleMessageChange = (e) => {
        setMessage(e);
    }


    const sendChat = async () => {
        if (message !== "") {
            const time = DateTime.local().toISO();
            const response = await sendChatFromClient(unid, message, time, DIRECTION_CLIENT);
            if (response.data.status === 200) {
                setMessage('');
            }
        }
    }


    return (
        <div styles={{position:"relative"}}>
            <MainContainer>
                <ChatContainer style={{ minHeight: '45vh', marginBottom: '0px'}}>       
                <MessageList style={{height: "35vh"}}>
                    {localStorageMessageList ? localStorageMessageList.map((item, index) => {
                        return (
                            <Message 
                                model={{
                                direction: `${item.direction}`,
                                message: `${item.message}`,
                                sentTime: "just now",
                                sender: ``
                                }} 
                            />
                        )
                    }) :null}
                </MessageList>

                <MessageInput value={message} onChange={(e) => handleMessageChange(e) } onSend={() => sendChat()}
                    placeholder="Type message here"
                />
                <InputToolbox>
                </InputToolbox>
                </ChatContainer>
            </MainContainer>
        </div>
    )
}