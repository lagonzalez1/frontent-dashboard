import React, { useState, useEffect} from "react";
import { AppBar, Container, IconButton,Typography, Toolbar, Box } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';



export default function NavBar({ navState, openNav }) {

  useEffect(() => {
    console.log("Navbar" + navState);
  }, [])

    return (
      <AppBar position="fixed" open={navState}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"

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
