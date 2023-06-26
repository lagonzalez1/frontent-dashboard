import React, { useState, useEffect} from "react";
import { Container, Box, Stack, Typography, Button, List, ListItem, Menu, MenuItem, ListItemText, Grid, Badge } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useSelector } from "react-redux";

const options = [
    'Remove open lock',
    'Go to check-in'
  ];


export default function Waitlist () {


    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(1);
    const open = Boolean(anchorEl);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const buisness = useSelector(state => state.buisness);


    return (
        <>

            <div id="UpperBar">
                <Grid container
                    spacing={2}
                    
                >
                    <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                        <Stack>
                            <Typography variant="body2">{buisness ? buisness.buisnessName: ''}</Typography>
                            <Typography variant="h5"><strong>Waitlist</strong></Typography>
                        </Stack>
                        
                    </Grid>
                    <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'right'}}>
                    <List
                        component="nav"
                        aria-label="Device settings"
                        sx={{ bgcolor: 'background.paper' }}
                    >
                        <ListItem
                        button
                        id="lock-button"
                        aria-haspopup="listbox"
                        aria-controls="lock-menu"
                        aria-label="when device is locked."
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClickListItem}
                        >
                        <FiberManualRecordIcon fontSize="small" htmlColor="#FF0000"/>
                        <ListItemText
                            primary="Closed"
                        />
                        <KeyboardArrowDownIcon/>
                        </ListItem>
                    </List>
                    <Menu
                        id="lock-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                        'aria-labelledby': 'lock-button',
                        role: 'listbox',
                        }}
                    >
                        {options.map((option, index) => (
                        <MenuItem
                            key={option}
                            onClick={(event) => handleMenuItemClick(event, index)}
                        >
                            {option}
                        </MenuItem>
                        ))}
                    </Menu>
                    </Grid>
                </Grid>





            </div>
        
        </>
    )
}