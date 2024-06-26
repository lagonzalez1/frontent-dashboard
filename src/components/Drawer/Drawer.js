import React, {memo, useEffect, useState} from "react";
import { CircularProgress, Divider, Grid, IconButton, List, ListItem, ListItemAvatar, ThemeProvider, ListItemText, Toolbar, styled, Chip, TextField, Avatar } from "@mui/material";
import { Container, Box, Stack, Drawer as SIDEBAR, Typography, Button, Paper, Tab} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CloseIcon from "@mui/icons-material/Close"
import { DateTime } from "luxon";
import { useDispatch, useSelector } from "react-redux";
import { completeClientAppointment, requestNoShow, sendNotification, undoClientServing, sendChatToClient, searchServices, searchEmployees } from "../../hooks/hooks";
import axios from "axios";
import { getHeaders, getStateData } from "../../auth/Auth";
import { setReload, setSnackbar } from "../../reducers/user";
import { WAITLIST, SERVING, APPOINTMENT, NOSHOW } from "../../static/static";
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import DoNotDisturbRoundedIcon from '@mui/icons-material/DoNotDisturbRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import DoNotDisturbAltRoundedIcon from '@mui/icons-material/DoNotDisturbAltRounded';
import RuleRoundedIcon from '@mui/icons-material/RuleRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import { useSubscription } from '../../auth/Subscription';
import ServingClient from "../Dialog/ServingClient";
import { removeClient } from "../Waitlist/Helpers";
import { LoadingButton } from "@mui/lab";
import { FactCheckOutlined } from "@mui/icons-material";
import { payloadAuth } from "../../selectors/requestSelectors";



const Drawer = ({client, setClient}) => {

    const business = useSelector((state) => state.business);
    const dispatch = useDispatch();
    const { checkSubscription } = useSubscription();
    const services = useSelector((state) => state.business.services);
    const employees = useSelector((state) => state.business.employees);
    const { bid, email, id } = useSelector(state => payloadAuth(state));
    const [value, setValue] = React.useState('1');
    const [payload, setPayload] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({});
    const [chat, setChat] = useState({title: null, body: null, acknowledge: false})
    const [chatLoading, setChatLoading] = useState(false);

    useEffect(() => {
        setPayload(client.payload);
        setChat(client.payload.chat);
        getAnalytics(client.payload);
        return() => {
            setLoading(false);
        }
    }, [client])

    const closeDrawer = () => {
        setClient({ payload: null, open: false })
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const moveClientComplete = (client) => {
        const currentTime = DateTime.local().setZone(business.timezone).toISO();
        completeClientAppointment(client, currentTime, bid, email)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        }).catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            dispatch(setReload(true))
            closeDrawer();
        })
    }

    const getAnalytics = (payload) => {
        if (!checkSubscription('APPOINTMENTS')){
            // Reject a lookup
            return;
        }
        if (!payload) { return; }
        const { user, business } = getStateData();
        const bid = business._id;
        const email = payload.email;
        const phone = payload.phone;
        const data = { bid, email: user.email, payload: {email, phone}}
        const headers = getHeaders();
        axios.post('/api/internal/analytics_search', data, headers)
        .then(response => {
            setAnalytics(response.data.result);
        }) 
        .catch(error => {
            console.log(error)
        })
    }

    const sendChatClient = () => {
        setChatLoading(true);
        const timestamp = DateTime.local().setZone(business.timezone).toISO();

        sendChatToClient(chat, payload._id, payload.type, bid, email)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}))
            setLoading(false)

        })
        .catch(error => {
            console.log(error);
            dispatch(setSnackbar({requestMessage: error.data, requestStatus: true}))
            setLoading(false)
        })
        .finally(() => {
            setChatLoading(false);
        })
    }

    const [serveDialog, setServeDialog] = useState(false);
    const [clientId, setClientId] = useState(null);

    const sendClientServing = (clientId) => {
        setServeDialog(true);
        setClientId(clientId);
    }

    const closeClientServing = () => {
        setServeDialog(false);
        setClientId(null);
        
        dispatch(setReload(true));
        closeDrawer();
    }

    const undoClient = (clientId) => {
        const data = {clientId, type: payload.type}
        undoClientServing(data, bid, email)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() =>{
            dispatch(setReload(true));
            closeDrawer();
        })
    }

    const sendClientNotification = (clientId, type) => {
        const payload = {clientId: clientId, type: type}
        sendNotification(payload)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        
    }

    const sendRemoveClient = (id, type) => {
        removeClient(id, type, bid, email)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}))
            setLoading(false)

        })
        .catch(error => {
            console.log(error);
            dispatch(setSnackbar({requestMessage: error.data, requestStatus: true}))
            setLoading(false)
        })
        .finally(() => {
            dispatch(setReload(true));
            closeDrawer()
        })
    }


    const sendClientNoShow = (payload) => {
        requestNoShow(payload._id, payload.type, bid, email)
          .then((client) => {
            console.log(client)
            if (!client) {
                console.log("null", client);
              return;
            } else {
              return completeClientAppointment(client);
            }
          })
          .then((completeResponse) => {
            dispatch(setSnackbar({ requestMessage: completeResponse.msg, requestStatus: true }));
          })
          .catch((error) => {
            dispatch(setSnackbar({ requestMessage: error.data, requestStatus: true }));
            setLoading(false);
          })
          .finally(() => {
            closeDrawer();
            dispatch(setReload(true));
          });
    };
      

    return(
        <>
            <SIDEBAR
                anchor={'right'}
                open={client.open}
                hideBackdrop={true}
            >  
            {(loading && !payload) ? <CircularProgress/>:
            <Container sx={{ paddingTop: 8, width: 400}} disableGutters>
            <Toolbar>
                {/* Close button on the left */}
                <IconButton edge="start" color="inherit" aria-label="close" onClick={closeDrawer}>
                    <CloseIcon fontSize="small" />
                </IconButton>
                {/* Empty div to push the title to the center */}
                <div style={{ flexGrow: 1 }} />

            </Toolbar>
            <Container>
                <Typography  variant="subtitle1" fontWeight="bold">{payload ? payload.fullname : null}</Typography>
            </Container>

            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList variant='fullWidth' onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Details" value="1" />
                        <Tab label="Notes" value="2" />
                        <Tab label="Visits" value="3" />
                    </TabList>
                    </Box>
                    <TabPanel value="1">
                        <>
                        <Grid container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Grid item>
                                <Typography sx={{ justifyContent: 'left'}} variant="body2" fontWeight={'bold'}>Served</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                                <Typography variant="body2">{payload && (payload.status.serving === true ? ("Served at " + DateTime.fromISO(payload.status.serve_time).toFormat("hh:mm a")) : ('Not yet'))}</Typography>
                            </Grid>
                        </Grid>
                        <br/>
                        {
                            client.fromComponent === APPOINTMENT ? 
                            (   
                                <>
                                <Grid container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center">
                                    <Grid item>
                                        <Typography sx={{ justifyContent: 'left'}} variant="body2" fontWeight={'bold'}>Created on</Typography>
                                    </Grid>
                                    <Grid sx={{ justifyContent: 'right'}} item>
                                        <Typography variant="body2">{payload && ( DateTime.fromISO(payload.timestamp).toFormat("LLL dd yyyy")) }</Typography>
                                    </Grid>
                                </Grid>
                                <br/>
                                </>
                            ):
                            null
                        }
                        {
                            client.fromComponent === WAITLIST ? 
                            (   
                                <>
                                <Grid container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center">
                                    <Grid item>
                                        <Typography sx={{ justifyContent: 'left'}} variant="body2" fontWeight={'bold'}>Created on</Typography>
                                    </Grid>
                                    <Grid sx={{ justifyContent: 'right'}} item>
                                        <Typography variant="body2">{payload && ( DateTime.fromISO(payload.timestamp).toFormat("LLL dd yyyy hh:mm a")) }</Typography>
                                    </Grid>
                                </Grid>
                                <br/>
                                </>
                            ):
                            null
                        }

                            {
                            client.fromComponent === SERVING ? 
                            (   
                                <>
                                <Grid container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center">
                                    <Grid item>
                                        <Typography sx={{ justifyContent: 'left'}} variant="body2" fontWeight={'bold'}>Served by</Typography>
                                    </Grid>
                                    <Grid sx={{ justifyContent: 'right'}} item>
                                        <Typography variant="body2">{payload && searchEmployees(payload.status.served_by, employees).fullname }</Typography>
                                    </Grid>
                                </Grid>
                                <br/>
                                </>
                            ):
                            null
                        }
                        <Grid container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Grid item>
                                <Typography sx={{ justifyContent: 'left'}} variant="body2" fontWeight={'bold'}>Status</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                                <Stack spacing={0.5}>
                                {payload && payload.status.late === true ? (<Chip  icon={<WatchLaterIcon />} label="Running Late" />) : null }
                                {payload && (payload.status.parking) ? (<Chip color={'warining'}  icon={<DirectionsCarFilledIcon />} label="Parking" />) : null }
                                {payload && (payload.status.here) ? (<Chip color={'success'} icon={<EmojiPeopleIcon />} label="Here" />) : null }
                                {payload && (payload.status.cancelled) ? (<Chip color={'error'}  icon={<DoNotDisturbAltRoundedIcon />} label="Cancelled" />) : null }
                                {payload && (payload.status.noShow) ? (<Chip color="error" icon={<RuleRoundedIcon />} label="No show" />) : null }
                                {payload && (payload.status.serving) ? (<Chip  icon={<NavigateNextRoundedIcon />} label="Serving" />) : null }
                                </Stack>
                            </Grid>
                        </Grid>
                        <br/>


                        <Grid container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                            <Grid item>
                                <Typography sx={{ justifyContent: 'left'}} variant="body2" fontWeight={'bold'}>Phone</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                                <Typography  variant="body2">{payload && payload.phone}</Typography>

                            </Grid>
                        </Grid>
                        <br/>
                        <Grid 
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Grid item>
                                <Typography sx={{ justifyContent: 'left'}} variant="body2" fontWeight={'bold'}>Email</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                                <Typography variant="body2">{payload && payload.email}</Typography>
                            </Grid>
                        </Grid>
                        <br/>
                        <Grid container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                            <Grid item>
                                <Typography sx={{ justifyContent: 'left'}} variant="body2" fontWeight={'bold'}>Service</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                                <Typography variant="body2">{payload && searchServices(payload.serviceTag, services).title}</Typography>

                            </Grid>
                        </Grid>
                        <br/>
                        <Grid 
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Grid item>
                                <Typography sx={{ justifyContent: 'left'}} variant="body2" fontWeight={'bold'}>Staff requested</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                                <Typography variant="body2">{payload && searchEmployees(payload.employeeTag, employees).fullname}</Typography>
                            </Grid>
                        </Grid>
                        <br/>

                        <Grid 
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Grid item>
                                <Typography sx={{ justifyContent: 'left'}} variant="body2" fontWeight={'bold'}>Type</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                                <Typography variant="body2">{payload && payload.type === "appointment" ? 'Appointment': 'Waitlist' }</Typography>
                            </Grid>
                        </Grid>
                        <br/>
                        <Grid 
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Grid item>
                                <Typography sx={{ justifyContent: 'left'}} variant="body2" fontWeight={'bold'}>Notified</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                            {payload && (payload.status.notified) ? (<Chip color="success" icon={<NotificationsActiveRoundedIcon />} label="Second notification" />) : (<Chip color={'primary'} icon={<NotificationsActiveRoundedIcon />} label="First notification sent" />) }
                            </Grid>
                        </Grid>
                        <br/> 
                        <Grid 
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Grid item>
                                <Typography sx={{ justifyContent: 'left'}} variant="body2" fontWeight={'bold'}>Acknowledged</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                            {payload && (payload.chat.acknowledge) ? (<Chip color="success" icon={<CheckCircleRoundedIcon />} label="Acknowledged" />) : <Chip color="warning" icon={<DoNotDisturbAltRoundedIcon />} label=" Not acknowledged" /> }
                            </Grid>
                        </Grid>
                        <br/>  
                        <Stack>
                            <TextField
                            id="outlined-multiline-static"
                            label="Personalize message"
                            multiline
                            rows={4}
                            placeholder="Chat"
                            value={chat.body}
                            inputProps={{ maxLength: 140 }}
                            onChange={(e) => setChat((prev) => ({...prev, body: e.target.value})) }
                            />
                        <LoadingButton onClick={() => sendChatClient()} loading={chatLoading}>Send</LoadingButton>
                        </Stack>                    
                        </>
                    </TabPanel>
                    <TabPanel value="2">
                        <List dense={true}>
                            <ListItem>
                                <ListItemText>
                                <Typography variant="body2">{payload && payload.notes ? payload.notes: 'No notes.'}</Typography>
                                </ListItemText>
                            </ListItem>
                        </List>
                    </TabPanel>
                    <TabPanel value="3">
                        <List dense={true}>

                        { analytics && analytics.waitlist_summmary ?
                        analytics.waitlist_summmary.map((object, index) => {
                            return (
                                <>
                                    <ListItem key={index}>
                                        <ListItemAvatar>
                                            <Avatar>
                                            <FactCheckOutlined />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText>
                                            <Stack>
                                            <Typography variant="body2"> { "Last visit: " + DateTime.fromISO(object.timestamp).toLocaleString() }</Typography>
                                            <Typography variant="body2"> { "Employee: " + searchEmployees(object.employee, employees).fullname }</Typography>
                                            <Typography variant="body2"> {'Service: '} { searchServices(object.serviceTag, services).title }</Typography>
                                            <Typography variant="body2"> {"Notes: "} { object.notes ? object.notes: 'No notes.' }</Typography>
                                            </Stack>
                                        </ListItemText>
                                        
                                    </ListItem>
                                    { index === (analytics.waitlist_summmary.length - 1) ? null : <Divider/> }
                                </>
                            )
                        }): null}
                        

                        {
                            analytics && analytics.appointment_summary ? 
                            analytics.appointment_summary.map((object, index) => {
                                
                                return (
                                    <>
                                        <ListItem key={index}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                <FactCheckOutlined  />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText>
                                                <Stack>
                                                <Typography variant="body2"> {'Last visit: '}{DateTime.fromISO(object.timestamp).toLocaleString() }</Typography>
                                                <Typography variant="body2"> {"Employee: "}{ searchEmployees(object.employee, employees).fullname }</Typography>
                                                <Typography variant="body2"> {'Service: '} { searchServices(object.serviceTag, services).title }</Typography>
                                                <Typography variant="body2">{"Notes: "} { object.notes ? object.notes: 'No notes.' }</Typography>
                                                </Stack>
                                            </ListItemText>
                                            
                                        </ListItem>
                                        { index === (analytics.appointment_summary.length - 1) ? null : <Divider/> }
                                    </>
                                )
                            }): null
                        }


                        { !checkSubscription('APPOINTMENTS') ? 
                            <ListItem>
                                <Typography variant="body2">Please upgrade to use this feature.</Typography>
                            </ListItem>: null
                        }
                        

                        { analytics && Object.keys(analytics).length === 0 && checkSubscription('APPOINTMENTS') ? 
                            <ListItem>
                                <Typography variant="body2">New Client.</Typography>
                            </ListItem>: null
                        }

                        
                        </List>
                    </TabPanel>
                </TabContext>
            </Box>
                
            </Container>
            }


            <Divider/>
            <Container sx={{ mt: 'auto', mb: 2}}>

                    {
                        client.fromComponent === SERVING &&
                        (
                            <Stack alignContent={'center'} justifyContent={'center'} spacing={0.5} direction={'row'}>
                                {payload ? <Button disableElevation startIcon={<CheckCircleRoundedIcon fontSize="small"/>} color="success" variant="contained" sx={{borderRadius: 10, margin: 0}} onClick={() => moveClientComplete(payload)}>Move Complete</Button>: null}
                                <Button disableElevation onClick={() => undoClient(payload._id, client.fromComponent)} startIcon={<UndoRoundedIcon fontSize="small"/>} variant="contained" sx={{borderRadius: 10, margin: 0}}>Undo</Button>
                            </Stack>
                        )
                    }

                    {
                        (client.fromComponent === WAITLIST || client.fromComponent === APPOINTMENT) &&
                        (
                            <Stack alignContent={'center'} justifyContent={'center'} spacing={0.5} direction={'row'}>
                                {payload ? <Button disableElevation startIcon={<DoNotDisturbRoundedIcon fontSize="small"/>} color="error" variant="contained" sx={{borderRadius: 10, margin: 0}} onClick={() => sendClientNoShow(payload)}>No show</Button>: null}
                                <Button disableElevation startIcon={<NotificationsRoundedIcon fontSize="small"/>} color='warning' variant="contained" sx={{borderRadius: 10, margin: 0}} onClick={() => sendClientNotification(payload._id, client.fromComponent)}>Notify</Button>
                                {payload ? <Button disableElevation startIcon={<NavigateNextRoundedIcon fontSize="small" />} color="success" variant="contained" sx={{borderRadius: 10, margin: 0}} onClick={() => sendClientServing(payload._id, client.fromComponent)}>Serve</Button> : null}

                            </Stack>
                        )
                    }

{
                        (client.fromComponent === NOSHOW) &&
                        (
                            <Stack alignContent={'center'} justifyContent={'center'} spacing={0.5} direction={'row'}>
                                {payload ? <Button disableElevation startIcon={<DoNotDisturbRoundedIcon fontSize="small"/>} color="error" variant="contained" sx={{borderRadius: 10, margin: 0}} onClick={() => sendRemoveClient(payload._id, payload.type)}>Delete</Button>: null}

                            </Stack>
                        )
                    }
            </Container>        
            </SIDEBAR> 

            {serveDialog && <ServingClient onClose={closeClientServing} open={serveDialog} type={client.fromComponent} clientId={clientId} />}

        </>
    )
}

export default Drawer;