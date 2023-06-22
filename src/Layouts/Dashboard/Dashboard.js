import React, { useEffect, useState} from "react";
import { Box, Typography, styled } from "@mui/material";
import { DashboardHeader } from "./DashboardHelper"
import { useSignOut } from "react-auth-kit";
import { removeAccessToken } from "../../auth/Auth";
import { useNavigate } from "react-router-dom";

import NavBar from "../NavBar/NavBar"
import SideBar from "../SideBar/SideBar";


export default function Dashboard (props) {

    const signOut = useSignOut();
    const [openNav, setOpenNav] = useState(false);

    const logout = () => {
        removeAccessToken();
        signOut();
    }

    useEffect(() => {
        console.log("DASHBAR");
    }, [])


    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <NavBar navState={openNav} openNav={setOpenNav} logout={logout} />
                <SideBar navState={openNav} openNav={setOpenNav} />
                 <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                      <DashboardHeader />
                      <Typography variant="h2">MAIN CONTENT</Typography>
                 </Box>
            </Box>
        </>
    )
}
