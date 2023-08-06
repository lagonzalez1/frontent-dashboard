import React, {useEffect, useState} from "react";
import { CircularProgress, Divider, Grid, IconButton, List, ListItem, Toolbar, styled } from "@mui/material";
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

export default function Drawer({client, setClient}) {

    const business = useSelector((state) => state.business);
    const dispatch = useDispatch();
    const currentTime = DateTime.local().setZone(business.timezone);

    const [payload, setPayload] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({});

    useEffect(() => {
        setPayload(client.payload);
        getAnalytics(client.payload);
        return() => {
            setLoading(false);
        }
    }, [client])


    const closeDrawer = () => {
        setClient({payload: null, open: false})
    }

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
      }));

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const moveClientComplete = (client) => {
        completeClientAppointment(client)
        .then(response => {
            console.log(response);
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
        console.log(payload);
        const bid = business._id;
        const email = payload.email;
        const phone = payload.phone;
        const data = { bid, email, phone }
        const headers = getHeaders();
        axios.post('/api/internal/analytics_search', data, headers)
        .then(response => {
            setAnalytics(response.data.client);
        }) 
        .catch(error => {
            console.log(error)
        })
    }

    const sendClientServing = (clientId) => {

        moveClientServing(clientId)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            dispatch(setReload(true));
            closeDrawer();
        })
    }

    const sendClientNoShow = (clientId) => {
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
            closeDrawer();
        })
    }

    return(
            <SIDEBAR
                anchor={'right'}
                open={client.open}
                hideBackdrop={true}
                variant="presistent"
            >  
            {loading && !payload ? <CircularProgress/>:
            <Container sx={{ paddingTop: 8, width: 400}} disableGutters>
            <Toolbar>
                {/* Close button on the left */}
                <IconButton edge="start" color="inherit" aria-label="close" onClick={() => closeDrawer()}>
                    <CloseIcon fontSize="small" />
                </IconButton>
                {/* Empty div to push the title to the center */}
                <div style={{ flexGrow: 1 }} />
                {/* Icon button on the right */}
                <IconButton color="inherit" aria-label="menu" >
                    <MenuIcon fontSize="small" />
                </IconButton>
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
                                <Typography sx={{ justifyContent: 'left'}} variant="body" fontWeight={'light'}>Served</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                                <Typography variant="body">{payload && (payload.status.serving === true ? ("Served at " + DateTime.fromISO(payload.status.serve_time).toFormat("hh:mm ")) : ('Not yet'))}</Typography>
                            </Grid>
                        </Grid>
                        <br/>
                        <Grid container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                            <Grid item>
                                <Typography sx={{ justifyContent: 'left'}} variant="body" fontWeight={'light'}>Status</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                                <Typography variant="body">{payload && (payload.status.late ? "Late": null) }</Typography>
                                <Typography variant="body">{payload && (payload.status.parking ? "Parked": null) }</Typography>
                                <Typography variant="body">{payload && (payload.status.here ? "Checked in": null) }</Typography>
                                <Typography variant="body">{payload && (payload.status.cancelled ? "Cancelled": null) }</Typography>
                                <Typography variant="body">{payload && (payload.status.noShow ? "No show": null) }</Typography>
                            </Grid>
                        </Grid>
                        <br/>
                        <Grid container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                            <Grid item>
                                <Typography sx={{ justifyContent: 'left'}} variant="body" fontWeight={'light'}>Phone</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                                <Typography variant="body">{payload && payload.phone}</Typography>

                            </Grid>
                        </Grid>
                        <br/>
                        <Grid container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                            <Grid item>
                                <Typography sx={{ justifyContent: 'left'}} variant="body" fontWeight={'light'}>Service</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                                <Typography variant="body">{payload && findService(payload.serviceTag).title}</Typography>

                            </Grid>
                        </Grid>
                        <br/>
                        <Grid container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                            <Grid item>
                                <Typography sx={{ justifyContent: 'left'}} variant="body" fontWeight={'light'}>Staff</Typography>
                            </Grid>
                            <Grid sx={{ justifyContent: 'right'}} item>
                                <Typography variant="body">{payload && findEmployee(payload.employeeTag).fullname}</Typography>

                            </Grid>
                        </Grid>

                        </>

                    </TabPanel>
                    <TabPanel value="2">
                        <Typography variant="body">{payload && payload.notes}</Typography>
                    </TabPanel>
                    <TabPanel value="3">
                        {analytics && analytics.title ? (analytics.title): (null) }
                        {analytics && analytics.summary ? (
                            analytics.summary.map((object) => {
                                return (
                                    <List>
                                        <ListItem>
                                            <Typography variant="body"> { DateTime.fromISO(object.timestamp).toLocaleString() }</Typography>
                                            <Typography variant="caption"> { object.notes }</Typography>
                                        </ListItem>
                                    </List>
                                )
                            })
                        ): null}
                    </TabPanel>
                </TabContext>
            </Box>
                
            </Container>
            }


            <Divider/>
            <Container sx={{ mt: 'auto', mb: 2}}>
                <Container>

                    {
                        client.fromComponent === "Serving" &&
                        (
                            <Stack direction={'row'} spacing={2} justifyContent="space-evenly">
                                {payload ? <Button color="secondary" variant="contained" sx={{borderRadius: 15}} onClick={() => moveClientComplete(payload)}>Move Complete</Button>: null}
                                <Button variant="contained" sx={{borderRadius: 15}}>Move Waitlist</Button>
                            </Stack>
                        )
                    }

                    {
                        client.fromComponent === "Waitlist" &&
                        (
                            <Stack direction={'row'} spacing={2} justifyContent="space-evenly">
                                {payload ? <Button color="secondary" variant="contained" sx={{borderRadius: 15}} onClick={() => sendClientNoShow(payload._id)}>No show</Button>: null}
                                <Button color="error" variant="contained" sx={{borderRadius: 15}}>Notify</Button>
                                {payload ? <Button color="primary" variant="contained" sx={{borderRadius: 15}} onClick={() => sendClientServing(payload._id)}>Serve</Button> : null}

                            </Stack>
                        )
                    }
                </Container>
            </Container>
            
            
            </SIDEBAR>        
    )
}