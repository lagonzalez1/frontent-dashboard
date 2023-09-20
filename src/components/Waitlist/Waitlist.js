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
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BadgeIcon from '@mui/icons-material/Badge';

import {  findClient, findResource, findService, moveClientServing } from "../../hooks/hooks";
import { useSelector, useDispatch } from "react-redux";
import { setReload, setSnackbar } from "../../reducers/user";
import { handleOpenNewTab, requestChangeAccept, options, columns, 
    clientOptions, OPTIONS_SELECT, acceptingRejecting,
    removeClient, moveClientDown, moveClientUp, requestNoShow, requestBusinessState} from "./Helpers";
import { reloadBusinessData, getUserTable } from "../../hooks/hooks";
import { WAITLIST } from "../../static/static";




export default function Waitlist ({setClient, setEditClient}) {
    
    const dispatch = useDispatch();
    const business = useSelector((state) => state.business);
    const user = useSelector((state) => state.user);
    const reload = useSelector((state) => state.reload);

    let tableData = getUserTable();
    let accepting = acceptingRejecting();


    const [anchorElVert, setAnchorElVert] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [clientId, setClientId] = useState();

    const open = Boolean(anchorEl);
    const openVert = Boolean(anchorElVert);


    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCloseVert = () => {
        setClientId(null)
        setAnchorElVert(null);
    }
    const handleOpenVert = (event, id) => {
        setClientId(id);
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
        event.preventDefault();
        if (storeState === 2) {
            const link = business.publicLink;
            handleOpenNewTab(link);
            setAnchorEl(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        requestChangeAccept(storeState)
        .then(response => {
            dispatch(setSnackbar({ requestMessage: response.msg, requestStatus: true }));
            setAnchorEl(null);
            return;
        })
        .catch(error => {
            dispatch(setSnackbar({ requestMessage: error.msg, requestStatus: false }));
            setAnchorEl(null);
            return;
        })
        .finally(() => {
            dispatch(setReload(true))
            handleCloseVert();
        })
    };
  

    /**
     * 
     * @param {*} optionId Type of request
     * @param {*} clientId Request made on behalf
     * @returns 
     */
    const handleOptionChange = (optionId) => {
        switch (optionId){
            case OPTIONS_SELECT.NO_SHOW:
                setLoading(true)
                requestNoShow(clientId)
                .then(response => {
                    dispatch(setSnackbar({requestMessage: response, requestStatus: true}))
                    setLoading(false)
                })  
                .catch(error => {
                    dispatch(setSnackbar({requestMessage: error.data, requestStatus: true}))
                    setLoading(false)
                })
                .finally(() => {
                    dispatch(setReload(true))
                    handleCloseVert();
                })

                return;
            case OPTIONS_SELECT.MOVE_UP:
                setLoading(true)
                moveClientUp(clientId,tableData)
                .then(response => {
                    dispatch(setSnackbar({requestMessage: response, requestStatus: true}))
                    setLoading(false)

                })  
                .catch(error => {
                    dispatch(setSnackbar({requestMessage: error.data, requestStatus: true}))
                    setLoading(false)

                })
                .finally(() => {
                    dispatch(setReload(true))
                    handleCloseVert();
                })
                return;
            case OPTIONS_SELECT.MOVE_DOWN:
                setLoading(true)
                moveClientDown(clientId,tableData)
                .then(response => {
                    dispatch(setSnackbar({requestMessage: response, requestStatus: true}));
                    setLoading(false)
                })  
                .catch(error => {
                    dispatch(setSnackbar({requestMessage: error.data, requestStatus: true}));
                    setLoading(false)
                })
                .finally(() => {
                    dispatch(setReload(true))
                    handleCloseVert();
                })
                
                return;
            case OPTIONS_SELECT.REMOVE:
                setLoading(true);
                removeClient(clientId)
                .then(response => {
                    console.log(response)
                    dispatch(setSnackbar({requestMessage: response, requestStatus: true}))
                    setLoading(false)

                })
                .catch(error => {
                    console.log(error);
                    dispatch(setSnackbar({requestMessage: error.data, requestStatus: true}))
                    setLoading(false)
                })
                .finally(() => {
                    dispatch(setReload(true))
                    handleCloseVert();

                })
                return;
        }
    }

    const openClientDrawer = (item) => {
        console.log(item);
        setClient({payload: item, open: true, fromComponent: WAITLIST});
    }

    const editClientInfo = (item) => {
        setEditClient({payload: item, open: true, fromComponent: WAITLIST})
    }

    useEffect(() => {
        tableData = getUserTable();
        return() => {
            dispatch(setReload(false));
        }
    }, [reload])




    const sendClientServing = (clientId) => {
        moveClientServing(clientId, WAITLIST)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            dispatch(setReload(true));
        })
    }

    const sendClientNotification = (clientId) => {
        console.log(clientId)
    }


    return (
        <>

            <div id="UpperBar">
                <Grid container
                    spacing={2}
                    
                >
                    <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                        <Stack>
                            <Typography variant="body2">{business ? business.businessName: <Skeleton/> }</Typography>
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
                        {accepting ? 
                        <FiberManualRecordIcon fontSize="small" htmlColor="#00FF00"/>:
                        <FiberManualRecordIcon fontSize="small" htmlColor="#FF0000"/>} 
                        <ListItemText
                            primary={ accepting ? 'Open' : 'Close'}
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
                        
                        { accepting ? 
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

                            {user.permissions > 0 ? (<Tooltip title="Logged in as employee" placement="bottom">
                                <Button color="error" variant="outlined" startIcon={<BadgeIcon />}>
                                    <Typography variant="button" sx={{ textTransform: 'lowercase'}}>{ user.email }</Typography>
                                </Button>
                            </Tooltip>): null}
                            
                            <Tooltip title="Your current location." placement="bottom">
                                <Button sx={{ backgroundColor: 'white'}} variant="outlined" startIcon={<SouthAmericaIcon />}>
                                    <Typography variant="button" sx={{ textTransform: 'lowercase'}}>{business ? (business.timezone): <Skeleton/> }</Typography>
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
                                                <Typography variant="subtitle2">{ col.label }</Typography>
                                            </TableCell>
                                           )) 
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                {
                    Array.isArray(tableData) ? (
                        tableData.map((item, index) => {
                            return (
                            <TableRow key={item._id}>
                                     
                                <TableCell align="left">
                                    <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'left'}>
                                        <IconButton onClick={() => openClientDrawer(item)}>
                                            <InfoOutlinedIcon fontSize="small" /> 
                                        </IconButton>
                                        <Typography>{++index}</Typography>                                   
                                    </Stack>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="subtitle2" fontWeight="bolder">{item.fullname}</Typography>
                                    <Typography fontWeight="normal" variant="caption">
                                        { item.serviceTag ? findService(item.serviceTag).title: null }
                                    </Typography>
                            
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="subtitle2" fontWeight="bold">{item.partySize}</Typography>
                                </TableCell>

                                <TableCell align="left">
                                    <Typography fontWeight="bold" variant="body2">
                                        { item.resourceTag ? findResource(item.resourceTag).title : null }
                                    </Typography>
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
                                        
                                        <IconButton onClick={() => sendClientServing(item._id)}>
                                            <CheckCircleIcon fontSize="small" htmlColor="#4CBB17"/>
                                        </IconButton>
                                        <IconButton onClick={() => sendClientNotification(item._id)}>
                                            <NotificationsIcon fontSize="small" htmlColor="#FF0000"/>                                           
                                        </IconButton>
                                        <IconButton onClick={() => editClientInfo(item)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                                aria-label="more"
                                                id="long-button"
                                                aria-expanded={openVert ? 'true' : undefined}
                                                aria-haspopup="true"
                                                onClick={(event) => handleOpenVert(event, item._id)}
                                                >
                                            <MoreVertIcon fontSize="small"  />
                                        </IconButton>

                        
                                

                                            <Menu
                                                id="long-menu"
                                                MenuListProps={{
                                                'aria-labelledby': 'long-button',
                                                }}
                                                anchorEl={anchorElVert}
                                                open={clientId === item._id}
                                                onClose={handleCloseVert}
                                            >
                                                {
                                                clientOptions.map((option) => {
                                                    return (
                                                        <MenuItem key={`${option.id}-${item._id}`} onClick={ () => handleOptionChange(option.id) }>
                                                            <ListItemIcon>
                                                                {option.icon}
                                                            </ListItemIcon>
                                                            {option.label}
                                                        </MenuItem>
                                                    )
                                                })
                                                }  
                                            </Menu>     
                                    </Stack>
                                </TableCell>            
                            </TableRow>
                        )}) 
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