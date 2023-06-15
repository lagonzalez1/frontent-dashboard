import React, { useEffect, useState} from "react";
import { Box, Typography, styled } from "@mui/material";
import NavBar from "../NavBar/NavBar"
import SideBar from "../SideBar/SideBar";


const DashboardHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));


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
