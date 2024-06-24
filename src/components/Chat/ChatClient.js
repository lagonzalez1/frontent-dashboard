import React, {useState, useEffect, useRef } from "react";
import { Container, Box, CircularProgress} from "@mui/material";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, AttachmentButton, SendButton, InputToolbox } from '@chatscope/chat-ui-kit-react';
import { DateTime } from "luxon";
import { getChat, sendChatFromClient } from "./ChatHelper";
import useWebSocket, { ReadyState } from "react-use-websocket"
import { useSelector, useDispatch } from 'react-redux';
import { setMessageList } from "../../reducers/chatter"

// Send data through here

export default function ChatClient({unid, closeBadge}) {


    const DIRECTION_CLIENT = "outgoing";
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [messageList, setMessageListO] = useState([]);
    const [message, setMessage] = useState('');
    const inputRef = useRef();

    const localStorageMessageList = useSelector((state) => state.chatter.messageList);

    useEffect(() => {
        toFetch();  
    
        // Reset badge once oppend.
        return () => {
            //closeBadge();
        }
    }, [])

    



    const toFetch = async () => {
        if (!localStorageMessageList) {
            setLoading(true);
            const result = await getChat(unid);
            if (result) {
                dispatch(setMessageList(result));
                setMessage('');
                return;
            }
            console.log(result)
        }
    }
    

    const handleMessageChange = (e) => {
        setMessage(e);
    }


    const sendChat = async () => {
        if (message.trim()) {
            const time = DateTime.local().toISO();
            sendChatFromClient(unid, message, time, DIRECTION_CLIENT)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                setMessage('');
            })
        }
    }



    return (
        <div styles={{position:"relative"}}>
            <MainContainer style={styles}>
                <ChatContainer style={{ minHeight: '45vh', marginBottom: '0px'}}>
                {loading ? (
                    <Box sx={{display: 'flex'}}>
                        <CircularProgress size={13} />
                    </Box>
                ): null}       
                <MessageList style={{height: "35vh"}} >
                    {localStorageMessageList ? localStorageMessageList.map((item, index) => {
                        return (
                            <Message
                                key={index}
                                style={styles}  
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

                <MessageInput
                    autoFocus
                    attachButton={false}
                    value={message}
                    style={styles} 
                    onChange={(e) => handleMessageChange(e) }
                    onSend={() => sendChat()}
                    placeholder="Type message here"
                />
                </ChatContainer>
            </MainContainer>
        </div>
    )
}