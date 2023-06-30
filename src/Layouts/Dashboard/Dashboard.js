import React, {  useEffect, useState} from "react";
import { Box } from "@mui/material";
import NavBar from "../NavBar/NavBar"
import SideBar from "../SideBar/SideBar";
import Waitlist from "../../components/Waitlist/Waitlist";
import FabButton from "../../components/Add/FabButton";
import FullScreenLoader from "../../components/Loader/FullScreenLoader";
import Resources from "../Resources/Resources";
import Serving from "../Serving/Serving";
import Settings from "../Settings/Settings";
import Help from "../Help/Help";


import { useSignOut } from "react-auth-kit";
import { DashboardHeader } from "./DashboardHelper"
import { isAuthenticated, removeUserState } from "../../auth/Auth";
import { useSelector, useDispatch } from 'react-redux';
import Customers from "../Customers/Customers";
import ErrorPage from "../Error/Error";
import Success from "../../components/Snackbar/Success";

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

    const [openNav, setOpenNav] = useState(false);
    const email = useSelector((state) => state.user.email);
    const location = useSelector((state) => state.user.location);

    async function checkAuthStatus() {
        try {
            const isAuth = await isAuthenticated(dispatch);
            console.log(isAuth)
            if (!isAuth) {
                removeUserState();
                signOut();
                return;
            }
        }catch(error) {
            console.log(error)
            return;
        }   
    }

    useEffect(() => {
        checkAuthStatus();
        // need to load default buisness. 
        // Note Redux refresh causes entire state to be empty.

    },[email])

    const RenderLocation = () => {
        switch(location) {
            case 0:
                return( <> 
                    <Waitlist />
                    <FabButton />
                    </> );
            case 1:
                return <Serving />
            case 2:
                return <Resources /> ;
            case 3:
                return <Customers/>;
            case 4: 
                return <Settings />;
            case 5: 
                return <Help />;

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
                      <RenderLocation />
                      <Success/>
                 </Box>
                 
            </Box>
        </>
    )
}
