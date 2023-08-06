import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Backdrop } from "@mui/material";
import NavBar from "../NavBar/NavBar"
import SideBar from "../SideBar/SideBar";
import Waitlist from "../../components/Waitlist/Waitlist";
import FabButton from "../../components/Add/FabButton";
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
import { reloadBusinessData } from "../../hooks/hooks";


/**
 * 
 * Strucutre:
 *          Have the user change the retrived state from mongo by only storing into local storage.
 *          User makes a request. Update all from localStorage.
 *              =
 */


export default function Dashboard () {
    const dispatch = useDispatch();
    const signOut = useSignOut();
    const reload = useSelector((state) => state.user.reload);
    const [loading, setLoading] = useState(false);
    const [authCompleted, setAuthCompleted] = useState(false); // Add a state variable for the completion status of authentication check.

    const [openNav, setOpenNav] = useState(false);
    const [client, setClient] = useState({ payload: null, open: false, fromComponent: null});

    async function checkAuthStatus() {
        setLoading(true);
        try {
            console.log("ENTER point 1");
            const isAuth = await isAuthenticated(dispatch);
            if (!isAuth) {
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
        checkAuthStatus();
    },[reload])


    useEffect(() => {
        console.log(client);
    }, [client])




    const RenderLocation = () => {
        const location = useSelector((state) => state.user.location);
        console.log("ENTER point 2");
        switch(location) {
            case 0:
                return( <> 
                    <Waitlist setClient={setClient} />
                    <FabButton />
                    </> );
            case 1:
                return <Serving setClient={setClient} />
            case 2:
                return <Resources /> ;
            case 3:
                return <Customers/>;
            case 4: 
                return <Settings />;
            case 5: 
                return <Services />;
            case 6: 
                return <Help /> 

            default:
                <ErrorPage errorMessage={"Failed to load the current location."} type={404} />
            
        }
    }
    

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <NavBar navState={openNav} openNav={setOpenNav} />
                <SideBar navState={openNav} openNav={setOpenNav} />
                 <Box component="main" id="innerDashboard" sx={{ flexGrow: 1, p: 1 , width : "100%"}}>
                      <DashboardHeader />
                      {!authCompleted ? 
                      (<Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loading}
                      >
                        <CircularProgress color="inherit" />
                      </Backdrop>)
                       : <RenderLocation />}
                      <Success/>
                 </Box>      
                 <Drawer setClient={setClient} client={client} />   
            </Box>

        </>
    )
}
