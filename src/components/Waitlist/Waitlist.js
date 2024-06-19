import React, { useState, useEffect, memo} from "react";
import { Stack, Typography, Button, List, ListItem, Menu, MenuItem, ListItemText, Grid,
     IconButton, ListItemIcon, TableHead,TableRow, TableCell, Paper, Table, TableContainer,
    TableBody, Tooltip, Skeleton, CircularProgress, ListItemButton, Divider, 
    Chip
} from "@mui/material";     
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BadgeIcon from '@mui/icons-material/Badge';
import { findResource, findService, moveClientServing, sendNotification, getNoShowClients, getWaitlistTable, getWaitlistWaittime } from "../../hooks/hooks";
import { useSelector, useDispatch } from "react-redux";
import { setReload, setSnackbar } from "../../reducers/user";
import { handleOpenNewTab, requestChangeAccept, options, columns, 
    clientOptions, OPTIONS_SELECT, acceptingRejecting,
    removeClient, moveClientDown, moveClientUp, requestNoShow, requestBusinessState, noShowColumns} from "./Helpers";
import { WAITLIST, NOSHOW, APPOINTMENT } from "../../static/static";
import FabButton from "../Add/FabButton";
import { usePermission } from "../../auth/Permissions";
import { DateTime } from "luxon";
import ServingClient from "../Dialog/ServingClient";
import { ArrowSquareOut, Lock, LockOpen } from "phosphor-react";
import { FmdGoodRounded } from "@mui/icons-material";




const Waitlist = ({setClient, setEditClient}) => {
    
    const { checkPermission } = usePermission();
    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state.tokens.access_token);
    const business = useSelector((state) => state.business);
    const user = useSelector((state) => state.user);
    const reload = useSelector((state) => state.reload);

    const [anchorElVert, setAnchorElVert] = useState(null);
    const [noShowData, setNoShowData] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [clientId, setClientId] = useState();
    const [waittime, setWaittime] = useState(null);
    const [tableData, setTableData] = useState([]);
    
    const open = Boolean(anchorEl);
    const openVert = Boolean(anchorElVert);

    let accepting = acceptingRejecting();


    useEffect(() => {
        setLoading(true)
        getWaitlistData();
        loadNoShowData() // No show table
        getWaittime(); // Waittime
        return () => {
            setLoading(false)
            dispatch(setReload(false));
        }
    }, [reload])



    const getWaitlistData = () => {
        if (accessToken === undefined) { return ;}
        getWaitlistTable(accessToken)
        .then(response => {
            setTableData(response);
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            setLoading(false)
        })
    }
    const loadNoShowData = () => {
        if (accessToken === undefined) { return ;}
        getNoShowClients(accessToken)
        .then(response => {
            setNoShowData(response.data.result)
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
    }
    const getWaittime = () => {
        if (accessToken === undefined) { return ;}
        getWaitlistWaittime(accessToken)
        .then(response => {
            setWaittime(response.waittime);
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            setLoading(false);
        })
    }

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCloseVert = () => {
        setClientId(null)
        setAnchorElVert(null);
        setServeType(null);
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
            setLoading(false);
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
                setLoading(true);
                // This is the wrong noshow.
                requestNoShow(clientId, WAITLIST)
                .then(response => {
                    dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
                })  
                .catch(error => {
                    dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
                })
                .finally(() => {
                    setLoading(false)
                    dispatch(setReload(true))
                    handleCloseVert();
                })

                return;
            case OPTIONS_SELECT.MOVE_UP:
                setLoading(true)
                moveClientUp(clientId,tableData)
                .then(response => {
                    dispatch(setSnackbar({requestMessage: response, requestStatus: true}))
                })  
                .catch(error => {
                    dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
                })
                .finally(() => {
                    setLoading(false)
                    dispatch(setReload(true))
                    handleCloseVert();
                })
                return;
            case OPTIONS_SELECT.MOVE_DOWN:
                setLoading(true)
                moveClientDown(clientId,tableData)
                .then(response => {
                    dispatch(setSnackbar({requestMessage: response, requestStatus: true}));
                })  
                .catch(error => {
                    dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
                })
                .finally(() => {
                    setLoading(false)
                    dispatch(setReload(true))
                    handleCloseVert();
                })
                
                return;
            case OPTIONS_SELECT.REMOVE:
                setLoading(true);
                removeClient(clientId, WAITLIST)
                .then(response => {
                    console.log(response)
                    dispatch(setSnackbar({requestMessage: response, requestStatus: true}))

                })
                .catch(error => {
                    dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
                })
                .finally(() => {
                    setLoading(false)
                    dispatch(setReload(true))
                    handleCloseVert();

                })
                return;
        }
    }

    const openClientDrawer = (item) => {
        setClient({payload: item, open: true, fromComponent: WAITLIST});
    }

    const openClientDrawerNoShow = (item) => {
        setClient({payload: item, open: true, fromComponent: NOSHOW});
    }


    // This is also an issue when dealing with noShow from appointments.
    const editClientInfo = (item) => {
        const TYPE = item.type;
        setEditClient({payload: item, open: true, fromComponent: TYPE})
    }

    const [serveDialog, setServeDialog] = useState(false);
    const [serveType, setServeType] = useState(null);

    const sendClientServing = (client) => {
        const clientId = client._id;
        const TYPE = client.type;
        setServeType(TYPE);
        setServeDialog(true);
        setClientId(clientId);
    }

    const closeClientServing = () => {
        setServeDialog(false);
        setClientId(null);
        dispatch(setReload(true));
    }

    const sendClientNotification = (client) => {
        const clientId = client._id;
        const TYPE = client.type;
        // This is an issue when it comes to appointments.
        var payload = {clientId: clientId, type: TYPE}
        sendNotification(payload)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
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
                        <ListItemButton
                        id="lock-button"
                        aria-haspopup="listbox"
                        aria-controls="lock-menu"
                        aria-label="when device is locked."
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClickListItem}
                        disabled={!checkPermission('OPEN_LOCK')} 
                        
                        >
                        {accepting ? 
                        <FiberManualRecordIcon fontSize="small" htmlColor="#00FF00"/>:
                        <FiberManualRecordIcon fontSize="small" htmlColor="#FF0000"/>} 
                        <ListItemText
                            primary={ accepting ? 'Open' : 'Closed'}
                        />
                        <KeyboardArrowDownIcon/>
                        </ListItemButton>
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
                            <ListItemIcon>
                                <Lock weight="bold" size={20}/>
                            </ListItemIcon>
                            <ListItemText>
                            {options[0]}
                            </ListItemText>
                            
                            </MenuItem>
                        ): 
                            <MenuItem
                            key={1}
                            onClick={(event) => handleMenuItemClick(event, 1)}
                            >
                            <ListItemIcon>
                                <LockOpen weight="bold" size={20} />
                            </ListItemIcon>
                            <ListItemText>
                                {options[1]} 
                            </ListItemText>
                            
                            </MenuItem>
                        }
                        <MenuItem
                            key={2}
                            onClick={(event) => handleMenuItemClick(event, 2)}
                        >
                             
                            <ListItemIcon>
                                <ArrowSquareOut weight="bold" size={20}/>
                            </ListItemIcon>
                            <ListItemText>
                                {options[2]}    
                            </ListItemText>
                        
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

                            {user.permissions === 3 || user.permissions === 2 ? (<Tooltip title="Logged in as employee" placement="bottom">
                                <Chip color="error" icon={<BadgeIcon />} label={user.email} />
                            </Tooltip>): null}
                            
                            <Tooltip title="Your current location." placement="bottom">
                                <Chip color="warning" icon={<SouthAmericaIcon />} label={business ? (business.timezone): null } />
                            </Tooltip>
                            <Tooltip title="The estimated time for the next person that joins your line." placement="right">
                                <Chip color="warning" icon={<AccessAlarmsIcon />} label={ waittime ? `Est. ${waittime} min wait` : (<CircularProgress size={10} />) } />
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
                                                <Typography variant="body2">{ col.label }</Typography>
                                            </TableCell>
                                           )) 
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                {
                    (loading === true) ? (
                        <TableRow>
                            <TableCell colSpan={3}/>
                            <TableCell>
                            <CircularProgress size={15} />
                            </TableCell>
                            <TableCell colSpan={3}/>
                        </TableRow>
                    ) : 
                        ( tableData && tableData.length > 0 ? 
                            (tableData.map((item, index) => {
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
                                    <Stack direction={'row'}>
                                    {item.status.cancelled ? <IconButton disabled> <WarningRoundedIcon color="error" /> </IconButton> : 
                                                    <IconButton disabled><FmdGoodRounded color="success" /></IconButton> }
                                    <Stack>
                                    <Typography variant="subtitle2" fontWeight="bolder">{item.fullname}</Typography>
                                    <Typography fontWeight="normal" variant="caption">
                                        { item.serviceTag ? findService(item.serviceTag).title: null }
                                    </Typography>
                                    </Stack>
                                    </Stack>
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
                                        <Tooltip title={'serve client'} placement="left">
                                        <IconButton onClick={() => sendClientServing(item)}>
                                            <CheckCircleIcon fontSize="small" htmlColor="#4CBB17"/>
                                        </IconButton>
                                        </Tooltip>
                                        <Tooltip title={'send notification'} placement="top">
                                        <IconButton onClick={() => sendClientNotification(item)}>
                                            <NotificationsIcon fontSize="small" htmlColor="#FF0000"/>                                           
                                        </IconButton>
                                        </Tooltip>
                                        <Tooltip title={'edit client'} placement="top">
                                        <IconButton onClick={() => editClientInfo(item)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        </Tooltip>
                                        <Tooltip title={'actions'} placement="top">
                                        <IconButton
                                                aria-label="more"
                                                id="long-button"
                                                aria-expanded={openVert ? 'true' : undefined}
                                                aria-haspopup="true"
                                                onClick={(event) => handleOpenVert(event, item._id)}
                                                >
                                            <MoreVertIcon fontSize="small"  />
                                        </IconButton>
                                        </Tooltip>

                                            <Menu
                                                id="long-menu"
                                                MenuListProps={{'aria-labelledby': 'long-button'}}
                                                anchorEl={anchorElVert}
                                                open={clientId === item._id && openVert ===  true}
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
                    ): 
                    <TableRow>
                        <TableCell colSpan={6} align="center">
                            No data available
                        </TableCell>
                    </TableRow>    
                ) 

                }
                                    
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>

                <br/>
                <Divider />
                <br/>

                

                {
                    noShowData ? (
                        <div className="table_content">
                    <Paper sx={{ width: '100%', overflow: 'hidden'}}>
                        <TableContainer>
                            <Table stickyHeader aria-label='main_table'>
                                <TableHead>
                                <TableRow >
                                    <TableCell align="left" colSpan={12}>
                                        <Typography variant="h6" fontWeight={'bold'}>No shows</Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                        {
                                           noShowColumns.map((col) => (
                                            <TableCell key={col.id} align='left'>
                                                <Typography variant="subtitle2">{ col.label }</Typography>
                                            </TableCell>
                                           )) 
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                { noShowData.map((item, index) => {
                                    return (
                                    <TableRow key={item._id}>
                                            
                                        <TableCell align="left">
                                            <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'left'}>
                                                <IconButton onClick={() => openClientDrawerNoShow(item)}>
                                                    <InfoOutlinedIcon fontSize="small" /> 
                                                </IconButton>
                                                <Typography>{++index}</Typography>                                   
                                            </Stack>
                                        </TableCell>

                                        <TableCell align="left">
                                            <Stack>
                                            <Typography variant="subtitle2" fontWeight="bolder">{item.fullname}</Typography>
                                            <Typography fontWeight="normal" variant="caption">
                                                { item.serviceTag ? findService(item.serviceTag).title: null }
                                            </Typography>
                                            </Stack>
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
                                            <Stack>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {DateTime.fromJSDate(new Date(item.timestampOrigin)).toFormat('LLL dd yyyy hh:mm a')}
                                            </Typography>
                                            <Typography fontWeight="normal" variant="caption">
                                                { item.type ? item.type: null }
                                                </Typography>
                                            </Stack>
                                        </TableCell>   

                                        <TableCell align="right">
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                            >   
                                                <Tooltip title="Serve client" placement="left">
                                                <IconButton onClick={() => sendClientServing(item)}>
                                                    <CheckCircleIcon fontSize="small" htmlColor="#4CBB17"/>
                                                </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Send notification" placement="top">
                                                <IconButton onClick={() => sendClientNotification(item)}>
                                                    <NotificationsIcon fontSize="small" htmlColor="#FF0000"/>                                           
                                                </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit client information" placement="right">
                                                <IconButton onClick={() => editClientInfo(item)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>      
                                                </Tooltip>
                                            </Stack>
                                        </TableCell> 

                                    </TableRow>
                                )}) }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
                    ): null
                }
                                    
                                
        

            <FabButton />

            </div>

            {serveDialog && <ServingClient onClose={closeClientServing} open={serveDialog} type={serveType} clientId={clientId} />}

        
        </>
    )
}

export default Waitlist;