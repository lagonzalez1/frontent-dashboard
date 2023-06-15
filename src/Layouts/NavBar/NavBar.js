import React, { useState, useEffect} from "react";
import { Container, IconButton,Typography, Toolbar, Box, styled } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, drawerWidth } from "./NavBarHelper";


export default function NavBar({ navState, openNav }) {

  useEffect(() => {
    console.log("Navbar" + navState);
  }, [])





    return (
      <AppBar position="fixed" open={navState}>
        <CssBaseline />
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => openNav(true)}
              edge="start"
              sx={{
                  marginRight: 5,
                  ...(navState && { display: 'none' }),
                }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Mini variant drawer

            </Typography>
          </Toolbar>
      </AppBar>
    )
}
