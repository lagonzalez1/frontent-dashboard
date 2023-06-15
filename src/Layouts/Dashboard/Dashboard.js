import React, { useEffect, useState} from "react";
import { Box, Typography, styled } from "@mui/material";
import NavBar from "../NavBar/NavBar"
import SideBar from "../SideBar/SideBar";
import { Outlet } from "react-router-dom";
import { DashboardHeader } from "./DashboardHelper"


export default function Dashboard (props) {

    const [openNav, setOpenNav] = useState(false);


    useEffect(() => {
        removeNavbar();
    }, [])

    /**
     * Fade navabar for Register and Login pages.
     */
    const removeNavbar = () => {
        props.setHide(true);
    }

    const Content = () => {
      return (
        <Box>
          Re-render
        </Box>
      )
    }


    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <NavBar navState={openNav} openNav={setOpenNav} />
                <SideBar navState={openNav} openNav={setOpenNav} />
                 <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                      <DashboardHeader />
                      <Typography variant="h2">MAIN CONTENT</Typography>
                 </Box>
            </Box>
        </>
    )
}
