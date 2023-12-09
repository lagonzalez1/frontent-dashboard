import React, {useEffect, useState} from "react";
import { CircularProgress, Divider, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Toolbar, styled } from "@mui/material";
import { Container, Box, Stack, Drawer as SIDEBAR, Typography, Button, Paper, Tab} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CloseIcon from "@mui/icons-material/Close"
import MenuIcon from "@mui/icons-material/Menu"
import { DateTime } from "luxon";
import { useDispatch, useSelector } from "react-redux";
import { completeClientAppointment, findEmployee, findService, moveClientServing, requestNoShow } from "../../hooks/hooks";
import axios from "axios";
import { getHeaders } from "../../auth/Auth";
import { setReload, setSnackbar } from "../../reducers/user";
import { WAITLIST, SERVING, APPOINTMENT } from "../../static/static";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import DoNotDisturbRoundedIcon from '@mui/icons-material/DoNotDisturbRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';

export default function Drawer({client, setClient}) {

    const business = useSelector((state) => state.business);
    const dispatch = useDispatch();

    const [value, setValue] = React.useState('1');
    const [payload, setPayload] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({});

    useEffect(() => {
        console.log("Drawer-Render")
        setPayload(client.payload);
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
        completeClientAppointment(client)
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
        if (!payload) { return; }
        const bid = business._id;
        const email = payload.email;
        const phone = payload.phone;
        const data = { bid, email, phone }
        const headers = getHeaders();
        axios.post('/api/internal/analytics_search', data, headers)
        .then(response => {
            console.log(response);
            setAnalytics(response.data.result);
        }) 
        .catch(error => {
            console.log(error)
        })
    }

    const sendClientServing = (clientId, type) => {
        moveClientServing(clientId, type)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            closeDrawer();
            dispatch(setReload(true));

        })
    }


    const sendClientNoShow = (payload) => {
        requestNoShow(payload._id, payload.type)
          .then((client) => {
            console.log(client)
            if (!client) {
                console.log("null", client);
              return;
            } else {
              // Assuming completeClientAppointment returns a promise
              return completeClientAppointment(client);
            }
          })
          .then((completeResponse) => {
            dispatch(setSnackbar({ requestMessage: completeResponse, requestStatus: true }));
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
                                        <Typography variant="body2">{payload && (DateTime.fromISO(payload.timestamp).toFormat("LLL mm yyyy")) }</Typography>
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
                                <Typography variant="body2" >{payload && (payload.status.late ? "Late": null) }</Typography>
                                <Typography variant="body2" >{payload && (payload.status.parking ? "Parked": null) }</Typography>
                                <Typography variant="body2" >{payload && (payload.status.here ? "Checked in": null) }</Typography>
                                <Typography variant="body2" >{payload && (payload.status.cancelled ? "Cancelled": null) }</Typography>
                                <Typography variant="body2" >{payload && (payload.status.noShow ? "No show": null) }</Typography>
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
                        <Grid container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                            <Grid item>
                                <Typography sx={{ justifyContent: 'left'}} variant="body2" fontWeight={'bold'}>Service</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                                <Typography variant="body2">{payload && findService(payload.serviceTag).title}</Typography>

                            </Grid>
                        </Grid>
                        <br/>
                        <Grid container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                            <Grid item>
                                <Typography sx={{ justifyContent: 'left'}} variant="body2" fontWeight={'bold'}>Staff</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                                <Typography variant="body2">{payload && findEmployee(payload.employeeTag).fullname}</Typography>
                            </Grid>
                        </Grid>

                        </>

                    </TabPanel>
                    <TabPanel value="2">
                        <Typography variant="body2">{payload && payload.notes ? payload.notes: 'No notes.'}</Typography>
                    </TabPanel>
                    <TabPanel value="3">
                        <List dense={true}>

                        { analytics && analytics.waitlist_summmary ?
                        analytics.waitlist_summmary.map((object, index) => {
                            
                            return (
                                <>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <PlaylistAddRoundedIcon fontSize="small" />
                                        </ListItemAvatar>
                                        <ListItemText>
                                            <Typography variant="body2"> { "Date: " + DateTime.fromISO(object.timestamp).toLocaleString() }</Typography>
                                            <Typography variant="body2"> { "Employee: " + findEmployee(object.employee).fullname }</Typography>
                                            <Typography variant="caption"> {"Notes: "} { object.notes ? object.notes: 'No notes.' }</Typography>
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
                                        <ListItem>
                                            <ListItemAvatar>
                                                <CalendarMonthIcon fontSize="small" />
                                            </ListItemAvatar>
                                            <ListItemText>
                                                <Typography variant="body2"> <strong>{'Date: '}</strong>{DateTime.fromISO(object.timestamp).toLocaleString() }</Typography>
                                                <Typography variant="body2"> <strong>{"Employee: "}</strong>{ findEmployee(object.employee).fullname }</Typography>
                                                <Typography variant="body2"> <strong>{'Service: '}</strong> { findService(object.serviceTag).title }</Typography>
                                                <Typography variant="caption"> <strong>{"Notes: "}</strong> { object.notes ? object.notes: 'No notes.' }</Typography>
                                            </ListItemText>
                                            
                                        </ListItem>
                                        { index === (analytics.appointment_summary.length - 1) ? null : <Divider/> }
                                    </>
                                )
                            }): null
                        }

                        { analytics && Object.keys(analytics).length === 0 ? <ListItem>
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
                <Box sx={{ display: 'flex', justifyContent: 'center'}}> 

                    {
                        client.fromComponent === SERVING &&
                        (
                            <Stack direction={'row'}>
                                {payload ? <Button startIcon={<CheckCircleRoundedIcon/>} color="secondary" variant="contained" sx={{borderRadius: 10}} onClick={() => moveClientComplete(payload)}>Move Complete</Button>: null}
                                <Button variant="contained" sx={{borderRadius: 10}}>Move Waitlist</Button>
                            </Stack>
                        )
                    }

                    {
                        (client.fromComponent === WAITLIST || client.fromComponent === APPOINTMENT) &&
                        (
                            <Stack direction={'row'}>
                                {payload ? <Button startIcon={<DoNotDisturbRoundedIcon/>} color="error" variant="contained" sx={{borderRadius: 10, margin: 1}} onClick={() => sendClientNoShow(payload)}>No show</Button>: null}
                                <Button startIcon={<NotificationsActiveRoundedIcon />} color="secondary" variant="contained" sx={{borderRadius: 10, margin: 1}}>Notify</Button>
                                {payload ? <Button startIcon={<NavigateNextRoundedIcon />} color="primary" variant="contained" sx={{borderRadius: 10, margin: 1}} onClick={() => sendClientServing(payload._id, client.fromComponent)}>Serve</Button> : null}

                            </Stack>
                        )
                    }
                </Box>
            </Container>        
            </SIDEBAR> 

        </>
    )
}