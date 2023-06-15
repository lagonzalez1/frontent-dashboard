import React, { useEffect, useState} from "react";
import { Box } from "@mui/material";
import TopNav from "../NavBar/NavBar"
import SideBar from "../SideBar/SideBar";


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
                <TopNav navState={openNav} openNav={setOpenNav} />
                <SideBar navState={openNav} openNav={setOpenNav} />
            </Box>
        </>
    )
}