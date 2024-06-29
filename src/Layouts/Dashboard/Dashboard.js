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
import ChatClient from "../../components/Chat/ChatClient";
import ChatBusiness from "../../components/Chat/ChatBusiness";
import { addMessage, setListOfChats } from "../../reducers/businessChatter";
import { getChatFromBusiness } from "../../components/Chat/ChatHelper";
import { authFields, authTokens } from "../../selectors/authSelectors";
import { setIndex, setSnackbar, setUser } from "../../reducers/user";
import axios from "axios";
import { payloadAuth } from "../../selectors/requestSelectors";
import { reloadBusinessData } from "../../hooks/hooks";

export default function Dashboard () {
    const dispatch = useDispatch();
    const signOut = useSignOut();
    const reload = useSelector((state) => state.user.reload);
    const timezone = useSelector((state) => state.business.timezone);
    const authPayload = useSelector((state) => payloadAuth(state));
    const location = useSelector((state) => state.user.location);


    // Need a different way to call refresh_access and getBusinessData
    //const { access_token, cookie_token } = useSelector((state) => authTokens(state));
    const authEmail = useSelector((state) => state.user.email)
    const authId = useSelector((state) => state.user.id)
    // Currently getting a response from login but after i make another request right after to load all values.
    // Maybe i authenticate on log in ? 
    // Set all the data then and no longer need to auth until refresh happens on Dashsboard.

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
    

    const connetWebhook = () => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
                action: "monitor",
                data: {
                    documentId: authId,
                    currentTime: DateTime.local().setZone(timezone).toISO()
                },
            });
        }
        
    }



    async function checkAuthStatus() {
        setLoading(true);
        try {
            // Returning false with useSelector solution
            // Need to load all values in login. 
            const isAuth = await isAuthenticated( dispatch, authId, authEmail, access_token );
            if (isAuth === false) {
                removeUserState();
                signOut();
                return;
            }
        }catch(error) {
            removeUserState();
            signOut();
            return;
        }finally {
            setLoading(false);
            setAuthCompleted(true);
            //getChatters();
        }
    }


    

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
            console.log(parsedState)
    
            // Check if the parsed state contains a non-null email
            if ( parsedState.email === null) {
                return false;
            } else {
                //console.log("User saved", parsedState);
                dispatch(setUser(parsedState));
                return true;
            }
        } catch (error) {
            console.error('Error checking user state:', error);
            return false;
        }
    };

    const tryAuthenticate = async () => {
        const id = authPayload.id;
        const email = authPayload.email;
        authenticateUser(id, email)
        .then(response => {
            const payload = response.data;
            dispatch(setUser({id: payload.id, email: payload.email, 
                bid: payload.bid, subscription: payload.subscription, trialStatus: payload.trialStatus,
                trial: payload.trial, emailConfirm: payload.confirm, defaultIndex: payload.defaultIndex, 
                permissions: payload.permissions, bid: payload.bid}));
            return true;
        })
        .catch(error => {
            console.log(error);
            return false;
        })        
    }

    const loadBusinessData = async () => {
        try {
            const state = localStorage.getItem('business');
            let parse = JSON.parse(state);
            if (parse['publicLink'] === null) {
                // Attempt server refresh. 
                let email = authPayload.email; 
                let bid = authPayload.bid;
                reloadBusinessData(email, bid)
                .then(response => {
                    dispatch(setBusiness(response));
                    return;
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    setLoading(false);
                    setAuthCompleted(true);
                })   
            }
            else {
                const parse = JSON.parse(state);
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
        const isSaved = await isUserStateSaved();
        console.log("State status", isSaved);
        if (isSaved === false) { 
            removeUserState();
            signOut();
            setAuthCompleted(false);
            return;
        }else {
            let attemptAuth = tryAuthenticate();
            console.log("attemptAuth", attemptAuth)
            if ( !attemptAuth ) {
                removeUserState();
                signOut();
                setAuthCompleted(false);
                return;
            }else {
                loadBusinessData();
                connetWebhook();
                getChatters();
                return;
            }
        }
       
    }


    useEffect(() => { 
        console.log("Dashboard-render.");
        // If user is saved try auth.
        //checkAuthStatus();
        // Subscription was the issue.

        completeCycle();
        
        
        
        
    },[reload]);




    const getChatters = async() => {
        try {
            const result = await getChatFromBusiness(authId, authEmail);
            if (result.status === 200) {
                dispatch(setListOfChats(result.data.chats));
            }
        }
        catch(error) {
            console.log(error);
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

    useEffect(() => {
        if (lastJsonMessage !== null) {
            const str = JSON.stringify(lastJsonMessage);
            const parse = JSON.parse(str);
            console.log(parse)
            if (parse.currentClients) {
                dispatch(setWaitlistClients(parse.currentClients))
            }
            if (parse.noShowData) {
                dispatch(setNoShowData(parse.noShowData))
            }
            if (parse.chatter_id) {
                const lastMessage = parse.messages;
                dispatch(addMessage({chatter_id: parse.chatter_id, message: lastMessage.at(-1)}))
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


    const RenderLocation = () => {
        console.log("ENN");
        console.log(location);
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
                                {console.log("STUCK")}
                                <CircularProgress color="inherit" />
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
