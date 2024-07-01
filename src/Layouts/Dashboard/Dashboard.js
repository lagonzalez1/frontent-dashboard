import React, { useEffect, useState, memo, useMemo, lazy, Suspense } from "react";
import { Box, CircularProgress, Backdrop } from "@mui/material";


import NavBar from "../NavBar/NavBar"
import SideBar from "../SideBar/SideBar";
import Waitlist from "../../components/Waitlist/Waitlist";
import Resources from "../Resources/Resources";
import Serving from "../Serving/Serving";
import Settings from "../Settings/Settings";
import Services from "../Services/Services";
import Help from "../Help/Help";
import Drawer from "../../components/Drawer/Drawer";

import { useSignOut } from "react-auth-kit";
import { DashboardHeader, authenticateUser } from "./DashboardHelper"
import { isAuthenticated, removeUserState } from "../../auth/Auth";
import { useSelector, useDispatch } from 'react-redux';
import Customers from "../Customers/Customers";
import ErrorPage from "../Error/Error";
import Success from "../../components/Snackbar/Success";
import EditClient from "../../components/Dialog/EditClient";
import Appointments from "../Appointments/Appointments";
import { PermissionProvider } from "../../auth/Permissions";
import { SubscriptionProvider } from "../../auth/Subscription";
import Analytics from "../Analytics/Analytics";
import Trial from "../../components/Snackbar/Trial";
import StripeCompletion from "../../components/Dialog/StripeCompletion";
import HelpDialog from "../Help/HelpDialog";
import useWebSocket, { ReadyState } from "react-use-websocket"
import { DateTime } from "luxon";
import { setBusiness, setNoShowData, setWaitlistClients } from "../../reducers/business";
import { addChatId, addMessage, setListOfChats } from "../../reducers/businessChatter";
import { getChatFromBusiness } from "../../components/Chat/ChatHelper";
import { setIndex, setLocation, setSnackbar, setUser } from "../../reducers/user";
import axios from "axios";
import { payloadAuth } from "../../selectors/requestSelectors";
import { reloadBusinessData } from "../../hooks/hooks";

export default function Dashboard () {
    const dispatch = useDispatch();
    const signOut = useSignOut();
    const reload = useSelector((state) => state.user.reload);
    const timezone = useSelector((state) => state.business.timezone);
    const {id, bid, email} = useSelector((state) => payloadAuth(state));
    const authEmail = useSelector((state) => state.user.email)

    const [loading, setLoading] = useState(false);
    const [openCompletion, openStripeCompletion] = useState(false);
    const [stripeSession, setStripeSession] = useState({sessionId: '', status: '', title: ''})
    const [gettingStarted, setGettingStarted] = useState(false);

    const [authCompleted, setAuthCompleted] = useState(false); // Add a state variable for the completion status of authentication check.
    const [openNav, setOpenNav] = useState(false);

    const [client, setClient] = useState({ payload: null, open: false, fromComponent: null});
    const [editClient, setEditClient] = useState({ payload: null, open: false, fromComponent: null});

    const WS_URL = 'ws://127.0.0.1:4000/api/internal/socket';
    const { sendJsonMessage, lastJsonMessage, readyState, lastMessage } = useWebSocket(
        WS_URL,
        {
          share: false,
          shouldReconnect: () => true,
        },
    )
    

    const isUserStateSaved = async () => {
        try {
            // Wrapping the localStorage operations in a Promise
            const state = await new Promise((resolve, reject) => {
                try {
                    const storedState = localStorage.getItem('user');
                    if (storedState === null) {
                        return reject(new Error('No user state found in local storage'));
                    }
                    resolve(storedState);
                } catch (error) {
                    reject(error);
                }
            });
    
            // Parsing the state
            const parsedState = JSON.parse(state);
            console.log("Is null:", parsedState.email, parsedState.id)
            // Check if the parsed state contains a non-null email
            if ( parsedState.email === null || parsedState.id === null) {
                return null;
            } else {
                //console.log("User saved", parsedState);
                dispatch(setUser({...parsedState}));
                return {id: parsedState.id, email: parsedState.email, bid: parsedState.bid};
            }
        } catch (error) {
            console.error('Error checking user state:', error);
            return null;
        }
    };

    const tryAuthenticate = async (id, email) => {
        try {
            const response = await authenticateUser(id, email);
            const payload = await response.data;
            if ( payload ) {
                dispatch(setUser({id: payload.id, email: payload.email, 
                    bid: payload.bid, subscription: payload.subscription, trialStatus: payload.trialStatus,
                    trial: payload.trial, emailConfirm: payload.confirm, defaultIndex: payload.defaultIndex, 
                    permissions: payload.permissions, bid: payload.bid}));
                return payload.bid;
            }
            return false;
        }
        catch(error) {
            console.log(error);
            return false;
        }
    }

    const loadBusinessData = async (id, email) => {
        try {
            const state = await new Promise((resolve, reject) => {
                try {
                    const storedState = localStorage.getItem('business');
                    if (storedState === null) {
                        return reject(new Error('No business state found in local storage'));
                    }
                    resolve(storedState);
                } catch (error) {
                    reject(error);
                }
            });
            let parse = JSON.parse(state);
            // This is failing to parse because this clears on localhost
            if (parse.currentClients === null) {
                // not being called becasue above
                const result = await reloadBusinessData(email, id)
                const response = await result;
                if (response) {
                    dispatch(setBusiness(response));
                    dispatch(setLocation(0))
                    setLoading(false);
                    setAuthCompleted(true);
                    return;
                }
            }
            else {
                const parse = JSON.parse(state);
                dispatch(setLocation(0))
                dispatch(setIndex(0))
                dispatch(setBusiness(parse));
                setAuthCompleted(true);
                return;
            }
        }
        catch(error) {
            console.log(error);
            throw new Error('Unable to load business data.')
        }
    }

    const completeCycle = async () => {
        try {
            const isSaved = await isUserStateSaved();
            console.log(isSaved);
            if (!isSaved) {
                removeUserState();
                signOut();
                setAuthCompleted(false);
                return;
            }
            // Changed this to return bid or false
            const attemptAuth = await tryAuthenticate(isSaved.id, isSaved.email);
            if (!attemptAuth) {
                removeUserState();
                signOut();
                setAuthCompleted(false);
                return;
            }
            
            await loadBusinessData(isSaved.bid ? isSaved.bid: isSaved.id, isSaved.email);
            await getChatters(isSaved.bid ? isSaved.bid: isSaved.id, isSaved.email);
            setAuthCompleted(true);
            setLoading(false);
        } catch (error) {
            console.error("Error during complete cycle:", error);
            removeUserState();
            signOut();
            setAuthCompleted(false);
        }
    }
    
    useEffect(() => {
        if (lastJsonMessage !== null) {
            console.log("Changes being updated...")
            const str = JSON.stringify(lastJsonMessage);
            const parse = JSON.parse(str);
            if (parse.business) {
                dispatch(setBusiness(parse.business))
            }
            if (parse.currentClients) {
                dispatch(setWaitlistClients(parse.currentClients))
            }
            if (parse.noShowData) {
                dispatch(setNoShowData(parse.noShowData))
            }
            if (parse.chatter_id) {
                const lastMessage = parse.messages;
                dispatch(addMessage({chatter_id: parse.chatter_id, message: lastMessage.at(-1)}))
                if (lastMessage.at(-1).sender === "CLIENT"){
                    dispatch(addChatId({id: parse.chatter_id}));
                }
                 
            }
        }
    }, [lastMessage, lastJsonMessage])

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
            openStripeCompletion(true);
            setStripeSession({sessionId: query.get('session_id'), status: 'Thank you for your support! Your account is active and ready to use.', title: 'Success', icon: 'okay'})
        }
        if (query.get('cancelled')) {
            openStripeCompletion(true);
            setStripeSession({sessionId: query.get('session_id'), status: 'Order canceled -- continue to shop around and checkout when you are ready.', title: 'Incomplete', icon:'cancelled'})        
        }
  }, [stripeSession.sessionId]);

    useEffect(() => {
        console.log("Dashboard-render.");
        completeCycle();       
    },[reload]);


    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            const time = DateTime.local().setZone(timezone).toISO();
            console.log("Connecting...", bid)
            sendJsonMessage({
                action: "monitor",
                data: {
                    documentId: bid,
                    currentTime: time
                },
            });
        }  
    }, [readyState])


    

    const getChatters = async(bid, email) => {
        try {
            const result = await getChatFromBusiness(bid, email);
            const response = await result;
            dispatch(setListOfChats(response.data.chats));
        }
        catch(error) {
            console.log(error);
            dispatch(setSnackbar({requestMessage: 'Unable to get chats from clients.', requestStatus: true}))
        }
            
    }

    //** User completes the subscrtiption cycle. */
    const closeStripeCompletion = () => {
        openStripeCompletion(false);
        const currentUrl = new URL(window.location.href);
        const query = new URLSearchParams(window.location.search);
        query.delete('success');
        query.delete('cancelled');
        query.delete('session_id');
        currentUrl.search = query.toString();
        window.history.replaceState({}, document.title, currentUrl.href);
    }

    const closeQuickStart = () => {
        const query = new URLSearchParams(window.location.search);
        const currentUrl = new URL(window.location.href);
        query.delete('quick_start');
        currentUrl.search = query.toString();
        window.history.replaceState({}, document.title, currentUrl.href);
        setGettingStarted(false);
    }

    


    const RenderLocation = () => {
        const location = useSelector((state) => state.user.location);
        const emailConfirm = useSelector((state) => state.user.emailConfirm);
        if (emailConfirm === false) { return <ErrorPage errorMessage={"Please confirm your email by verifying your identity. Once completed come back here and refresh the page."} type={403} />; }
        switch(location) {
            case 0:
                return <Waitlist setClient={setClient} setEditClient={setEditClient} />;
            case 1:
                return <Appointments setClient={setClient} setEditClient={setEditClient} />;
            case 2:
                return <Serving setClient={setClient} />
            case 3:
                return <Resources /> ;
            case 4:
                return <Services />;
            case 5: 
                return <Customers />;
            case 6: 
                return <Analytics />;
            case 7: 
                return <Settings />;
            case 8: 
                return <Help />;
            default:
                return <ErrorPage errorMessage={"Failed to load the current location. Please feel free to reload this page. If that doesnt relsove this issue. Send us a email at support@waitonline.us"} type={404} /> 
        }
    }
    const MemoizedRenderLocation = useMemo(() => RenderLocation, [reload]);

    return (
        <>
            <Box sx={{ display: 'flex' }}>
            <SubscriptionProvider>
                <NavBar navState={openNav} openNav={setOpenNav} />
                <SideBar navState={openNav} openNav={setOpenNav} />
                 <Box component="main" id="innerDashboard" sx={{ flexGrow: 1, p: 1 , width : "100%"}}>
                    <PermissionProvider>
                            <DashboardHeader />
                            {!authCompleted ?                             
                            (<Backdrop
                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={loading}
                            >   
                                <CircularProgress size={17} color='warning' />
                            </Backdrop>)
                            : <MemoizedRenderLocation />}
                            <Success />
                      </PermissionProvider>
                 </Box>
                 <Trial />
                 { client.open ? <Drawer setClient={setClient} client={client} />  : null}
                 { editClient.open ? <EditClient setEditClient={setEditClient} editClient={editClient} /> : null }
                 { gettingStarted ? <HelpDialog open={gettingStarted} onClose={() => closeQuickStart()}  /> : null}
                 <StripeCompletion payload={stripeSession} open={openCompletion} onClose={closeStripeCompletion}/>
                 
                 </SubscriptionProvider>
            </Box>

        </>
    )
}
