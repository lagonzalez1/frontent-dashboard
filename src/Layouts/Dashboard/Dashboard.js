import React, { useCallback, useEffect, useState} from "react";
import { Box, Typography, styled } from "@mui/material";
import NavBar from "../NavBar/NavBar"
import SideBar from "../SideBar/SideBar";
import Waitlist from "../../components/Waitlist/Waitlist";
import { useSignOut } from "react-auth-kit";
import { DashboardHeader, getBuisnessData } from "./DashboardHelper"
import { isAuthenticated, removeUserState } from "../../auth/Auth";
import { useSelector, useDispatch } from 'react-redux';




/**
 * 
 * Strucutre:
 *          Have the user change the retrived state from mongo by only storing into local storage.
 *          User makes a request. Update all from localStorage.
 *              =
 */


export default function Dashboard (props) {
    const dispatch = useDispatch();
    const [openNav, setOpenNav] = useState(false);
    const signOut = useSignOut();
    const email = useSelector((state) => state.user.email);
    const id = useSelector((state) => state.user.id);
    

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

    

    

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <NavBar navState={openNav} openNav={setOpenNav} />
                <SideBar navState={openNav} openNav={setOpenNav} />
                 <Box component="main" id="innerDashboard" sx={{ flexGrow: 1, p: 1 , width : "100%"}}>
                      <DashboardHeader />
                      <Waitlist />
                 </Box>
            </Box>
        </>
    )
}
