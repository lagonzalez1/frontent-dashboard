import React from "react";
import { IconButton, List, ListItemIcon, ListItemButton, Divider, ListItem, ListItemText, useTheme, Tooltip} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import FactCheckIcon from '@mui/icons-material/FactCheck';


import { LOCATIONS } from "./SideBarHelper";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../reducers/user";
import { DrawerHeader, Drawer } from "./SideBarHelper";


export default function SideBar({navState, openNav}) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const currentLocation = useSelector((state) => state.user.location);


    /**
     * 
     * @param {Number} location
     *  Changes the location tof the current page based.
     *  Change the state of redux user.location  
     */
    const changeLocation = (location) => {
        dispatch(setLocation(location))
    }


    return (
        <>
        <Drawer variant="permanent" open={navState}>
          <DrawerHeader>
          <IconButton onClick={() => openNav(false)}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>

            <ListItem disablePadding sx={{ display: 'block' }}>
            <Tooltip title="Dashboard" placement="right">
              <ListItemButton
                color="info"
                sx={{
                  minHeight: 48,
                  justifyContent: navState ? 'initial' : 'center',
                  px: 2.5,
                }}
                
                onClick={() => changeLocation(LOCATIONS.Dashboard)}
              >
                <ListItemIcon
                  
                  sx={{
                    minWidth: 0,
                    mr: navState ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <AccessTimeRoundedIcon htmlColor={ currentLocation === 0 ? '#ffc34d' : '' } />
                </ListItemIcon>
                <ListItemText primary={"Appointments"} sx={{ opacity: navState ? 1 : 0 }} />
              </ListItemButton>
              </Tooltip>
            </ListItem>


            <ListItem disablePadding sx={{ display: 'block' }}>
            <Tooltip title="Serving" placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: navState ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={() => changeLocation(LOCATIONS.Serving)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: navState ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <CheckBoxRoundedIcon  htmlColor={ currentLocation === 1 ? '#ffc34d' : '' } />
                </ListItemIcon>
                <ListItemText primary={"Serving"} sx={{ opacity: navState ? 1 : 0 }} />
              </ListItemButton>
              </Tooltip>
            </ListItem>


            <ListItem disablePadding sx={{ display: 'block' }}>
            <Tooltip title="Resources" placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: navState ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={() => changeLocation(LOCATIONS.Resources)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: navState ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <WidgetsRoundedIcon htmlColor={ currentLocation === 2 ? '#ffc34d' : '' } />
                </ListItemIcon>
                <ListItemText primary={"Resources"} sx={{ opacity: navState ? 1 : 0 }} />
              </ListItemButton>
              </Tooltip>
            </ListItem>

              <ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title="Services" placement="right">
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: navState ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => changeLocation(LOCATIONS.Services)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: navState ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <FactCheckIcon  htmlColor={ currentLocation === 5 ? '#ffc34d' : '' } />
                  </ListItemIcon>
                  <ListItemText primary={"Help"} sx={{ opacity: navState ? 1 : 0 }} />
                </ListItemButton>
                </Tooltip>
              </ListItem>
              
            <ListItem disablePadding sx={{ display: 'block' }}>
            <Tooltip title="Customers" placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: navState ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={() => changeLocation(LOCATIONS.Customers)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: navState ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <PeopleRoundedIcon  htmlColor={ currentLocation === 3 ? '#ffc34d' : '' }/>
                </ListItemIcon>
                <ListItemText primary={"Customers"} sx={{ opacity: navState ? 1 : 0 }} />
              </ListItemButton>
              </Tooltip>
            </ListItem>

          
        </List>
        <Divider />
        <List>
              <ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title="Settings" placement="right">
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: navState ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => changeLocation(LOCATIONS.Settings)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: navState ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <SettingsRoundedIcon  htmlColor={ currentLocation === 4 ? '#ffc34d' : '' } />
                  </ListItemIcon>
                  <ListItemText primary={"Settings"} sx={{ opacity: navState ? 1 : 0 }} />
                </ListItemButton>
                </Tooltip>
              </ListItem>

        </List>
        
        <Divider/>
        <List>
              <ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title="Help" placement="right">
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: navState ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => changeLocation(LOCATIONS.Help)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: navState ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <HelpRoundedIcon  htmlColor={ currentLocation === 6 ? '#ffc34d' : '' } />
                  </ListItemIcon>
                  <ListItemText primary={"Help"} sx={{ opacity: navState ? 1 : 0 }} />
                </ListItemButton>
                </Tooltip>
              </ListItem>

        </List>

      </Drawer>
      </>
    )
}
