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
import useWebSocket from "../../hooks/webSocketHook";
import Drawer from "../../components/Drawer/Drawer";

import { useSignOut } from "react-auth-kit";
import { DashboardHeader } from "./DashboardHelper"
import { isAuthenticated, removeUserState } from "../../auth/Auth";
import { useSelector, useDispatch } from 'react-redux';
import Customers from "../Customers/Customers";
import ErrorPage from "../Error/Error";
import Success from "../../components/Snackbar/Success";
import { reloadBusinessData } from "../../hooks/hooks";
import EditClient from "../../components/Dialog/EditClient";
import Appointments from "../Appointments/Appointments";
import { PermissionProvider } from "../../auth/Permissions";
import { SubscriptionProvider } from "../../auth/Subscription";
import Analytics from "../Analytics/Analytics";
import Trial from "../../components/Snackbar/Trial";
import StripeCompletion from "../../components/Dialog/StripeCompletion";
import HelpDialog from "../Help/HelpDialog";

/**
 * 
 * Structure:
 *          Have the user change the retrived state from mongo by only storing into local storage.
 *          User makes a request. Update all from localStorage.
 * 
 * 
 * Light and dark mode: using localStorage
 *                        - Define light mode as true, in app.js proccess any changes and update theme.
 *                        - Handle changess in Dashboard.js
 * 
 *             
 */

export default function Dashboard () {
    const dispatch = useDispatch();
    const signOut = useSignOut();
    const reload = useSelector((state) => state.user.reload);
    const DAYONE = useSelector((state) => state.business.timestamp);
    const timezone = useSelector((state) => state.business.timezone);
    const [loading, setLoading] = useState(false);
    const [openCompletion, openStripeCompletion] = useState(false);
    const [stripeSession, setStripeSession] = useState({sessionId: '', status: '', title: ''})
    const [gettingStarted, setGettingStarted] = useState(false);

    const [authCompleted, setAuthCompleted] = useState(false); // Add a state variable for the completion status of authentication check.
    const [openNav, setOpenNav] = useState(false);

    const [client, setClient] = useState({ payload: null, open: false, fromComponent: null});
    const [editClient, setEditClient] = useState({ payload: null, open: false, fromComponent: null});


    async function checkAuthStatus() {
        setLoading(true);
        try {
            const isAuth = await isAuthenticated(dispatch);
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
            setAuthCompleted(true)
        }
    }

    useEffect(() => { 
        console.log("Dashboard-render.");
        checkAuthStatus();
    },[reload]);


    /*
    useEffect(() => {
        const myFunction = () => {
            reloadBusinessData(dispatch);
        };
        const query = new URLSearchParams(window.location.search);
        if (query.get('quick_start')) {
            setGettingStarted(true);
        }
        // Reload after 1.5 min
        const intervalId = setInterval(myFunction, 90000);
        return () => {
          // Clear the interval to avoid memory leaks
            clearInterval(intervalId);
        };
    }, []);
   */ 
   

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
        const location = useSelector((state) => state.user.location);
        const emailConfirm = useSelector((state) => state.user.emailConfirm);
        if (!emailConfirm) { return <ErrorPage errorMessage={"Please confirm your email by verifying your identity. Once completed come back here and refresh the page."} type={403} />; }
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
                <ErrorPage errorMessage={"Failed to load the current location. Please feel free to reload this page. If that doesnt relsove this issue. Send us a email at support@waitonline.us"} type={404} /> 
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
