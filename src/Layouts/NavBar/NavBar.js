import React, { useState, useEffect} from "react";
import { Container, IconButton,Typography, Toolbar, Button, Box } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar } from "./NavBarHelper";
import { useSignOut } from "react-auth-kit";
import { removeUserState } from "../../auth/Auth";



export default function NavBar({ navState, openNav }) {

    const signOut = useSignOut();

    function logout() {
      removeUserState();
      signOut();
    }

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
            <Typography variant="h6" sx={{ flexGrow: 1}} noWrap component="div">
              Mini variant drawer
            </Typography>
            <Box>
              <Button onClick={() => logout()} color="inherit">Logout</Button>
            </Box>
          </Toolbar>
      </AppBar>
    )
}
