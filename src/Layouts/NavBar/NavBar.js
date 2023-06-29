import React, { useEffect, useState} from "react";
import { IconButton,Typography, Toolbar, Button, Box } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, DetermineDaytimeOrEvening } from "./NavBarHelper";
import { useSignOut } from "react-auth-kit";
import { removeUserState } from "../../auth/Auth";
import { DateTime } from 'luxon';
import { useSelector } from "react-redux";



export default function NavBar({ navState, openNav }) {

    
    const signOut = useSignOut();
    const buisness = useSelector((state) => state.buisness);


    const LiveClock = () => {
      const timezone = buisness.timezone;
      const [currentTime, setCurrentTime] = useState(DateTime.local().setZone(timezone));
    
      useEffect(() => {
        const interval = setInterval(() => {
          setCurrentTime(DateTime.local().setZone(timezone));
        }, 1000);
    
        return () => clearInterval(interval);
      }, [timezone]);
    
      return (
        <Typography variant="h5">
          {currentTime.toFormat('hh:mm:ss a') + " "}
          <DetermineDaytimeOrEvening />

        </Typography>
      );
    };

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
              <LiveClock />
            </Typography>
            <Box>
              <Button onClick={() => logout()} color="inherit">Logout</Button>
            </Box>
          </Toolbar>
      </AppBar>
    )
}
