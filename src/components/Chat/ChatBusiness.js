import React, {useState, useEffect, useMemo } from "react";
import { Container, Box, CircularProgress, Dialog, Slide, DialogContent, DialogTitle, IconButton, Typography} from "@mui/material";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, AttachmentButton, SendButton, InputToolbox } from '@chatscope/chat-ui-kit-react';
import { DateTime } from "luxon";
import { getChat, sendChatFromBusiness, sendChatFromClient } from "./ChatHelper";
import { useSelector, useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { selectMessagesByChatId } from "../../selectors/businessChatSelectors";
import { setSnackbar } from "../../reducers/user";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function ChatBusiness({open, onClose, client}) {

    const timezone = useSelector((state) => state.business.timezone);
    const DIRECTION_BUSINESS = "outgoing";
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [chatterId, setChatterId] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        setLoading(true)
        if (client && client.chatter) {
            setChatterId(client.chatter); // Set chatter_id from client
            setLoading(false); // Set loading to false once chatter_id is available
        }
    }, [client]);

    // Retrieve messages for the given chatter_id
    const messages = useSelector((state) => chatterId ? selectMessagesByChatId(state, chatterId) : []);


    const handleMessageChange = (e) => {
        setMessage(e);
    }

    const sendChatToClient = async () => {

        if (message.trim()){
            const chatter_id = client.chatter;
            const timestamp = DateTime.local().setZone(timezone).toISO();
            sendChatFromBusiness(message, timestamp, DIRECTION_BUSINESS, chatter_id)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
            })
            .finally(() => {
                setMessage('');
            })
        }        
    }
    
    const MessageComponentMemo = useMemo(() => messages, []);


    const Messages = () => {
        return (
            <>
            
            </>
        )
    }


    return (

        <Dialog 
            id="chatBusiness"
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            maxWidth='sm'
            fullWidth={true}
        >
            <DialogTitle>
                <Typography fontWeight={'bold'} variant="h6">Chat {client ? client.fullname: ''}</Typography>
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
                >
                <CloseIcon />
                </IconButton>
            <DialogContent>
                <div styles={{position:"relative"}}>
                    <MainContainer>
                        <ChatContainer>
                        {loading ? (
                            <Box sx={{display: 'flex'}}>
                                <CircularProgress size={13} />
                            </Box>
                        ): null}       
                        <MessageList style={{height: "35vh"}}>

                        {messages ? messages.map((item, index) => {
                                const DIRECTION = item.sender === "CLIENT" ? 'incoming': 'outgoing';
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
                            attachButton={false}
                            value={message} 
                            onChange={(e) => handleMessageChange(e) }
                            onSend={() => sendChatToClient() }
                            placeholder="Type message here"
                        />
                        
                        </ChatContainer>
                    </MainContainer>
                </div>
        </DialogContent>
        </Dialog>
    )
}