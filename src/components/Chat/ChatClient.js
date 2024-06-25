import React, {useState, useEffect, useRef } from "react";
import { Container, Box, CircularProgress} from "@mui/material";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, AttachmentButton, SendButton, InputToolbox } from '@chatscope/chat-ui-kit-react';
import { DateTime } from "luxon";
import { getChat, sendChatFromClient } from "./ChatHelper";
import useWebSocket, { ReadyState } from "react-use-websocket"
import { useSelector, useDispatch } from 'react-redux';
import { setMessageList } from "../../reducers/chatter"
import WaitingResponse from "../Snackbar/WaitingResponse";

// Send data through here

export default function ChatClient({unid, closeBadge}) {


    const DIRECTION_CLIENT = "outgoing";
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [serverResponse, setServerResponse] = useState({open: false, title: null, body: null, data: null});

    const localStorageMessageList = useSelector((state) => state.chatter.messageList);

    useEffect(() => {
        loadChatter();  
    
        // Reset badge once oppend.
        return () => {
            //closeBadge();
        }
    }, [])

    

    const closeServerResponse = () => {
        setServerResponse({open: false, title: null, body: null, data: null});
    }


    const loadChatter = async () => {
        if (!localStorageMessageList) {
            setLoading(true);
            getChat(unid)
            .then(response => {
                dispatch(setMessageList(response));
            })
            .catch(error => {
                setServerResponse({open: true, title: 'Error', body: 'Unable to load chats.', data: error});
                console.log(error);
            })
            .finally(() => {
                setMessage('');
                setLoading(false);
            })
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
                closeBadge()
            })
        }
    }



    return (
        <div styles={{position:"relative"}}>
            <WaitingResponse open={serverResponse.open} onClose={closeServerResponse} payload={serverResponse.data} title={serverResponse.title} body={serverResponse.body} />
            <MainContainer>
                <ChatContainer style={{ minHeight: '45vh', marginBottom: '0px', width: '100%'}}>
                {loading ? (
                    <Box sx={{display: 'flex'}}>
                        <CircularProgress size={13} />
                    </Box>
                ): null}       
                <MessageList style={{height: "40vh"}} >
                    {localStorageMessageList ? localStorageMessageList.map((item, index) => {
                        const DIRECTION = item.sender === "BUSINESS" ? 'incoming': 'outgoing';
                        return (
                            <Message
                                key={index} 
                                model={{
                                direction: DIRECTION,
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
                    onChange={(e) => handleMessageChange(e) }
                    onSend={() => sendChat()}
                    placeholder="Type message here"
                />
                </ChatContainer>
            </MainContainer>
        </div>
    )
}