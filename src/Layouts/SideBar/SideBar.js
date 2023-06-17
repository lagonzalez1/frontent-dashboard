import React, { useState, useEffect} from "react";
import { IconButton, List, ListItemIcon, ListItemButton, Divider, ListItem, ListItemText, styled, useTheme, Tooltip} from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';


import { DrawerHeader, Drawer ,drawerWidth,openedMixin, closedMixin } from "./SideBarHelper";


export default function SideBar({navState, openNav}) {
    const theme = useTheme();

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
                sx={{
                  minHeight: 48,
                  justifyContent: navState ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: navState ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <AccessTimeRoundedIcon />
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
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: navState ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <CheckBoxRoundedIcon />
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
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: navState ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <WidgetsRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={"Resources"} sx={{ opacity: navState ? 1 : 0 }} />
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
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: navState ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <PeopleRoundedIcon />
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
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: navState ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <SettingsRoundedIcon />
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
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: navState ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <HelpRoundedIcon />
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
