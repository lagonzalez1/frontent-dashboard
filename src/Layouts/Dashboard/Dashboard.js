import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
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
import { DashboardHeader } from "./DashboardHelper"
import { isAuthenticated, removeUserState } from "../../auth/Auth";
import { useSelector, useDispatch } from 'react-redux';
import Customers from "../Customers/Customers";
import ErrorPage from "../Error/Error";
import Success from "../../components/Snackbar/Success";
import { cleanTable, reloadBusinessData } from "../../hooks/hooks";
import EditClient from "../../components/Dialog/EditClient";
import Appointments from "../Appointments/Appointments";
import { PermissionProvider } from "../../auth/Permissions";
import { SubscriptionProvider } from "../../auth/Subscription";
import Analytics from "../Analytics/Analytics";
import Trial from "../../components/Snackbar/Trial";


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
    const [loading, setLoading] = useState(false);

    const [authCompleted, setAuthCompleted] = useState(false); // Add a state variable for the completion status of authentication check.
    const [openNav, setOpenNav] = useState(false);

    const [client, setClient] = useState({ payload: null, open: false, fromComponent: null});
    const [editClient, setEditClient] = useState({ payload: null, open: false, fromComponent: null});

    async function checkAuthStatus() {
        setLoading(true);
        try {
            const isAuth = await isAuthenticated(dispatch);     
            console.log(isAuth)       
            if (isAuth === false) {
                
                removeUserState();
                signOut();
                return;
            }
            checkPresistentTables();
        }catch(error) {
            removeUserState();
            signOut();
            return;
        }finally {
            setLoading(false);
            setAuthCompleted(true)
        }
    }
    async function checkPresistentTables () {
        cleanTable()
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
    }
    useEffect(() => { 
        console.log("Dashboard-render.");
        checkAuthStatus();
    },[reload]);


    useEffect(() => {
        const myFunction = () => {
            reloadBusinessData(dispatch);
        };
        // Reload after 1.5 min
        const intervalId = setInterval(myFunction, 90000);
        return () => {
          // Clear the interval to avoid memory leaks
            clearInterval(intervalId);
        };
      }, []); 

    const RenderLocation = () => {
        const location = useSelector((state) => state.user.location);
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
                <ErrorPage errorMessage={"Failed to load the current location."} type={404} /> 
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
                            <Success/>
                      </PermissionProvider>
                 </Box>
                 <Trial />
                 { client.open ? <Drawer setClient={setClient} client={client} />  : null}
                 { editClient.open ? <EditClient setEditClient={setEditClient} editClient={editClient} /> : null }
                 </SubscriptionProvider>
            </Box>

        </>
    )
}
