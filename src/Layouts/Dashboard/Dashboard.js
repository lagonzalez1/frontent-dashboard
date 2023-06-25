import React, { useCallback, useEffect, useState} from "react";
import { Box, Typography, styled } from "@mui/material";
import NavBar from "../NavBar/NavBar"
import SideBar from "../SideBar/SideBar";
import { useSignOut } from "react-auth-kit";
import { DashboardHeader, getBuisnessData } from "./DashboardHelper"
import { isAuthenticated, removeAccessToken } from "../../auth/Auth";
import { useSelector, useDispatch } from 'react-redux';

export default function Dashboard (props) {
    const dispatch = useDispatch();
    const [openNav, setOpenNav] = useState(false);
    const signOut = useSignOut();
    const email = useSelector((state) => state.user.email);
    const id = useSelector((state) => state.user.id);
    

    async function checkAuthStatus() {
        try {
            const isAuth = await isAuthenticated(id,email, dispatch);
            console.log(isAuth)
            if (!isAuth) {
                removeAccessToken();
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
                 <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                      <DashboardHeader />
                      <Typography variant="h2">MAIN CONTENT</Typography>
                      { /** Elements */}
                 </Box>
            </Box>
        </>
    )
}
