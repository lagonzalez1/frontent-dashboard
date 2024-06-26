import React, { memo } from "react";
import { IconButton, List, ListItemIcon, ListItemButton, Divider, ListItem, ListItemText, useTheme, Tooltip, Typography, Badge, Box, Container} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import ListIcon from '@mui/icons-material/List';
import { useSubscription } from '../../auth/Subscription';

import { LOCATIONS } from "./SideBarHelper";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../reducers/user";
import { DrawerHeader, Drawer, BootstrapTooltip  } from "./SideBarHelper";


const SideBar = ({navState, openNav}) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const currentLocation = useSelector((state) => state.user.location);
    const { checkSubscription } = useSubscription();


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
        <Drawer color="primary" variant="permanent" open={navState}>
          <DrawerHeader>
          <IconButton onClick={() => openNav(false)}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center'}}>
              
          </Box>
        </Container>

        <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
            <BootstrapTooltip title="Dashboard" placement="right">
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
                  <AccessTimeOutlinedIcon htmlColor={ currentLocation === 0 ? '#F46036' : '' } />
                </ListItemIcon>
                <ListItemText primary={"Waitlist"} sx={{ opacity: navState ? 1 : 0, fontWeight: 'bold' }} />
              </ListItemButton>
              </BootstrapTooltip>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }}>
            <BootstrapTooltip title="Appointments" placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: navState ? 'initial' : 'center',
                  px: 2.5,
                }}
                disabled={!checkSubscription('APPOINTMENTS')}
                onClick={() => changeLocation(LOCATIONS.Appointments)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: navState ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <ListIcon htmlColor={ currentLocation === 1 ? '#F46036' : '' } />
                </ListItemIcon>
                <ListItemText primary={"Appointments"} sx={{ opacity: navState ? 1 : 0, fontWeight: 'bold' }} />
              </ListItemButton>
              </BootstrapTooltip>
            </ListItem>


            <ListItem disablePadding sx={{ display: 'block' }}>
            <BootstrapTooltip title="Serving" placement="right">
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
                  <CheckBoxOutlinedIcon htmlColor={ currentLocation === 2 ? '#F46036' : '' } />
                </ListItemIcon>
                <ListItemText primary={"Serving"} sx={{ opacity: navState ? 1 : 0, fontWeight: 'bold' }} />
              </ListItemButton>
              </BootstrapTooltip>
            </ListItem>


            <ListItem disablePadding sx={{ display: 'block' }}>
            <BootstrapTooltip title="Resources" placement="right">
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
                  <WidgetsOutlinedIcon htmlColor={ currentLocation === 3 ? '#F46036' : '' } />
                </ListItemIcon>
                <ListItemText primary={"Resources"} sx={{ opacity: navState ? 1 : 0, fontWeight: 'bold' }} />
              </ListItemButton>
              </BootstrapTooltip>
            </ListItem>

              <ListItem disablePadding sx={{ display: 'block' }}>
              <BootstrapTooltip title="Services" placement="right">
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
                    <FactCheckOutlinedIcon  htmlColor={ currentLocation === 4 ? '#F46036' : '' } />
                  </ListItemIcon>
                  <ListItemText primary={"Services "} sx={{ opacity: navState ? 1 : 0, fontWeight: 'bold' }} />
                </ListItemButton>
                </BootstrapTooltip>
              </ListItem>
              
            <ListItem disablePadding sx={{ display: 'block' }}>
            <BootstrapTooltip title="Customers" placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: navState ? 'initial' : 'center',
                  px: 2.5,
                }}
                disabled={!checkSubscription('ANALYTICS')}
                onClick={() => changeLocation(LOCATIONS.Customers)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: navState ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <PeopleAltOutlinedIcon  htmlColor={ currentLocation === 5 ? '#F46036' : '' }/>
                </ListItemIcon>
                <ListItemText primary={"Customers"} sx={{ opacity: navState ? 1 : 0, fontWeight: 'bold' }} />
              </ListItemButton>
              </BootstrapTooltip>
            </ListItem>

          
        </List>
        <Divider />
        <List>
              <ListItem disablePadding sx={{ display: 'block' }}>
              <BootstrapTooltip title="Analytics" placement="right">
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: navState ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  disabled={ !checkSubscription('ANALYTICS') }
                  onClick={() => changeLocation(LOCATIONS.Analytics)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: navState ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <BarChartIcon  htmlColor={ currentLocation === 6 ? '#F46036' : '' } />
                  </ListItemIcon>
                  <ListItemText primary={"Analytics"} sx={{ opacity: navState ? 1 : 0, fontWeight: 'bold' }} />
                </ListItemButton>
                </BootstrapTooltip>
              </ListItem>

        </List>

        <Divider/>
        <List>
        <ListItem disablePadding sx={{ display: 'block' }}>
            <BootstrapTooltip title="Settings" placement="right">
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
                  <SettingsOutlinedIcon htmlColor={ currentLocation === 7 ? '#F46036' : '' }/>
                </ListItemIcon>
                <ListItemText primary={"Settings"} sx={{ opacity: navState ? 1 : 0, fontWeight: 'bold' }} />
              </ListItemButton>
              </BootstrapTooltip>
            </ListItem>

          
        </List>
        
        <Divider/>
        <List>

              <ListItem disablePadding sx={{ display: 'block' }}>
              <BootstrapTooltip title="Help" placement="right">
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
                    <HelpOutlineOutlinedIcon  htmlColor={ currentLocation === 8 ? '#F46036' : '' } />
                  </ListItemIcon>
                  <ListItemText primary={"Help"} sx={{ opacity: navState ? 1 : 0, fontWeight: 'bold' }} />
                </ListItemButton>
                </BootstrapTooltip>
              </ListItem>

        </List>

      </Drawer>
      </>
    )
}

export default memo(SideBar);
