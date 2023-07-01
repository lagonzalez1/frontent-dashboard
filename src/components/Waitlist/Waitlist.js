import React, { useState, useEffect} from "react";
import { Stack, Typography, Button, List, ListItem, Menu, MenuItem, ListItemText, Grid,
     IconButton, ListItemIcon, TableHead,TableRow, TableCell, Paper, Table, TableContainer, TableBody, Tooltip, Skeleton, CircularProgress  } from "@mui/material";
     
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';
import LaunchIcon from '@mui/icons-material/Launch';


import { useSelector, useDispatch } from "react-redux";
import { setSnackbar } from "../../reducers/user";
import { handleOpenNewTab, requestChangeAccept, options, columns, getUserTable, clientOptions, OPTIONS_SELECT } from "./Helpers";
import { reloadBuisnessData } from "../../hooks/hooks";




export default function Waitlist () {

    const dispatch = useDispatch();
    const [anchorElVert, setAnchorElVert] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);



    const open = Boolean(anchorEl);
    const openVert = Boolean(anchorElVert);

    const tableData = getUserTable();
    const buisness = useSelector(state => state.buisness);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCloseVert = () =>{
        setAnchorElVert(null);
    }
    const handleOpenVert = (event) => {
        setAnchorElVert(event.currentTarget);
    }

    /**
     * 
     * @param {*} event 
     * @param {*} storeState Number 0,1,2 
     * 2: Represents the last option to click from. Opens tab
     * 1 and 0: Represent repectively Open appointments and close.
     * @returns 
     */
    const handleMenuItemClick = (event, storeState) => {
        setLoading(true);
        if (storeState === 2) {
            const link = buisness.publicLink;
            handleOpenNewTab(link);
            setAnchorEl(null);
            setLoading(false)
            return;
        }
        try {
            requestChangeAccept(storeState, dispatch);
            setAnchorEl(null);
            setLoading(false)
        }catch (error){
            setErrors(error);
            setAnchorEl(null);
            setLoading(false)
            return;
        }
    };
  

    /**
     * 
     * @param {*} optionId Type of request
     * @param {*} clientId Request made on behalf
     * @returns 
     */
    const handleOptionChange = (optionId, clientId) => {
        console.log(clientId);
        switch (optionId){
            case OPTIONS_SELECT.NO_SHOW:
                console.log("No show")
                setAnchorElVert(null);
                return;
            case OPTIONS_SELECT.EDIT:
                console.log("Edit");
                setAnchorElVert(null);
                return;
            case OPTIONS_SELECT.MOVE:
                console.log("Move");
                setAnchorElVert(null);
                return;
            case OPTIONS_SELECT.REMOVE:
                console.log('Remove');
                setAnchorElVert(null);
                return;
        }
        setAnchorElVert(null);
    }


    useEffect(() => {
        reloadBuisnessData(dispatch);
        return() => {
            setLoading(false);
        }
    }, [loading])


    return (
        <>

            <div id="UpperBar">
                <Grid container
                    spacing={2}
                    
                >
                    <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                        <Stack>
                            <Typography variant="body2">{buisness ? buisness.buisnessName: <Skeleton/> }</Typography>
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
                        id="lock-button"
                        aria-haspopup="listbox"
                        aria-controls="lock-menu"
                        aria-label="when device is locked."
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClickListItem}
                        >
                        {buisness.accepting ? 
                        <FiberManualRecordIcon fontSize="small" htmlColor="#00FF00"/>:
                        <FiberManualRecordIcon fontSize="small" htmlColor="#FF0000"/>} 
                        <ListItemText
                            primary={ buisness.accepting ? 'Open' : 'Close'}
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
                        


                        { buisness.accepting ? 
                        (<MenuItem
                            key={0}
                            onClick={(event) => handleMenuItemClick(event, 0)}
                        >
                            {options[0]}
                            </MenuItem>
                        ): 
                            <MenuItem
                            key={1}
                            onClick={(event) => handleMenuItemClick(event, 1)}
                            >
                                {options[1]}
                            </MenuItem>
                        }
                        <MenuItem
                            key={2}
                            onClick={(event) => handleMenuItemClick(event, 2)}
                        >
                            {options[2]} 
                            <ListItemIcon>
                                <LaunchIcon fontSize="small"/>
                            </ListItemIcon>
                        </MenuItem>
                    </Menu>
                    </Grid>
                </Grid>

                <Grid container
                    spacing={2}
                    sx={{ pb: 2}}
                    
                >
                    <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                        <Stack direction={"row"} spacing={1}>
                            
                            <Tooltip title="Your current location." placement="bottom">
                                <Button sx={{ backgroundColor: 'white'}} variant="outlined" startIcon={<SouthAmericaIcon />}>
                                    <Typography variant="button" sx={{ textTransform: 'lowercase'}}>{buisness ? (buisness.timezone): <Skeleton/> }</Typography>
                                </Button>
                            </Tooltip>
                            <Tooltip title="The estimated time for the next person that joins your line." placement="right">
                                <Button sx={{ backgroundColor: 'white'}}  variant="outlined" startIcon={<AccessAlarmsIcon />}>
                                    <Typography variant="button" sx={{ textTransform: 'lowercase'}}>Est. <strong>5-10</strong> min wait.</Typography>
                                </Button>
                            </Tooltip>
                        </Stack>
                        
                    </Grid>
                    <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'right'}}>
                        
                    </Grid>
                </Grid>

                

                <div className="table_content">
                    <Paper sx={{ width: '100%', overflow: 'hidden'}}>
                        <TableContainer>
                            <Table stickyHeader aria-label='main_table'>
                                <TableHead>
                                    <TableRow>
                                        {
                                           columns.map((col) => (
                                            <TableCell key={col.id} align='left'>
                                                <Typography variant="subtitle2" fontWeight="bold">{ col.label }</Typography>
                                            </TableCell>
                                           )) 
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                {
                    Array.isArray(tableData) ? (
                        tableData.map((item, index) => (
                            <TableRow key={item._id}>                                       
                                <TableCell align="left">{++index}</TableCell>
                                <TableCell align="left">
                                    <Typography variant="subtitle2" fontWeight="bold">{item.fullname}</Typography>
                                    <Typography variant="caption" fontWeight="light">{item.attached}</Typography>
                            
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="subtitle2" fontWeight="bold">{item.partySize}</Typography>
                                </TableCell>

                                <TableCell align="left">
                                    <Typography variant="subtitle2" fontWeight="bold">{item.attached}</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {item.waittime ? ( item.waittime.hours >= 1 ? (`${item.waittime.hours} Hr ${item.waittime.minutes} Min.`): (`${item.waittime.minutes} Min.`)): (null) } 
                                    </Typography>
                                </TableCell>                                       
                                <TableCell align="right">
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                    >
                                        <IconButton >
                                            <NotificationsIcon htmlColor="#FF0000"/>
                                            
                                        </IconButton>
                                        <IconButton>
                                            <CheckCircleIcon htmlColor="#4CBB17"/>
                                            
                                        </IconButton>
                                        <IconButton
                                                aria-label="more"
                                                id="long-button"
                                                aria-expanded={openVert ? 'true' : undefined}
                                                aria-haspopup="true"
                                                onClick={handleOpenVert}
                                                >
                                            <MoreVertIcon  />
                                        </IconButton>
                                            <Menu
                                                id="long-menu"
                                                MenuListProps={{
                                                'aria-labelledby': 'long-button',
                                                }}
                                                anchorEl={anchorElVert}
                                                open={openVert}
                                                onClose={handleCloseVert}
                                                
                                            >
                                                {
                                                clientOptions.map((option) => (
                                                    <MenuItem key={`${option.id}-${item._id}`} onClick={() => handleOptionChange(option.id, item._id)}>
                                                    <ListItemIcon>
                                                            {option.icon}
                                                        </ListItemIcon>
                                                        {option.label}
                                                    </MenuItem>
                                                ))
                                                }  
                                            </Menu>     
                                    </Stack>
                                </TableCell>            
                            </TableRow>
                        ))
                    ): null
                }
                                    
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>




            </div>
        
        </>
    )
}