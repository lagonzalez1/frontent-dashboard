import React, { useState, useEffect} from "react";
import { Stack, Typography, Button, Grid, TableHead,TableRow, TableCell, Paper, Table, 
    TableContainer, TableBody, Tooltip, Skeleton, CircularProgress, Box, IconButton } from "@mui/material";

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { findEmployee, getAppointmentClients, moveClientServing } from "../../hooks/hooks";
import { APPOINTMENT, WAITLIST } from "../../static/static";
import { useSelector, useDispatch } from "react-redux";
import { setReload, setSnackbar } from "../../reducers/user";
import { columns } from "./AppointmentsHelper";
import { DateTime } from "luxon";



export default function Appointments ({setClient, setEditClient}) {
    const dispatch = useDispatch();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const reload = useSelector((state) => state.user.reload);


    const business = useSelector((state) => state.business);



    useEffect(() => {
        loadAppointments();
        console.log("called")
    }, [reload]);



    const loadAppointments = () => {
        setLoading(true)
        const appointmentDate = DateTime.local().setZone(business.timezone);
        const payload = { appointmentDate }
        getAppointmentClients(payload)
        .then(response => {
            setData(response);
        })
        .catch(error => {
            dispatch(setSnackbar({ requestMessage: error, requestStatus: true }))
        })
        .finally(() => {
            setLoading(false);
        })
    }

    const sendClientServing = (clientId) => {
        moveClientServing(clientId, APPOINTMENT)
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

    const openClientDrawer = (item) => {
        setClient({payload: item, open: true, fromComponent: APPOINTMENT});
    }
    const editClientInfo = (item) => {
        setEditClient({payload: item, open: true, fromComponent: APPOINTMENT})
    }
    const sendClientNotification = (clientId) => {
        console.log(clientId)
    }

    return (
        <>

        <div className="appointments">
            <Grid container>
                <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                        <Stack>
                            <Typography variant="body2">{business ? business.businessName: <Skeleton/> }</Typography>
                            <Typography variant="h5"><strong>Appointments</strong></Typography>
                        </Stack>
                        
                </Grid>
                <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>

                </Grid>

                <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left', pt: 2}}>
                    <Tooltip title="How many people are in the establishment." placement="right">
                        <Button sx={{ backgroundColor: 'white'}} variant="outlined" startIcon={null}>
                            <Typography variant="button" sx={{ textTransform: 'lowercase', fontWeight: 'normal'}}> Appointments </Typography>
                        </Button>
                    </Tooltip>
                        
                </Grid>
                <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'right '}}>
                    <Button>somebutton</Button>
                </Grid>
            </Grid>

                <div className="servingTable">
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
                                    { data ? data.map((client, index) => (
                                        <TableRow>
                                            <TableCell>
                                                <Typography fontWeight={'bold'} variant="body2">
                                                <IconButton onClick={() => openClientDrawer(client)}>
                                                    <InfoOutlinedIcon fontSize="small" /> 
                                                </IconButton>
                                                    {++index}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight={'bold'} variant="body2">
                                                    { client.fullname}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight={'bold'} variant="body2">
                                                    {DateTime.fromISO(client.appointmentDate).toFormat('LLL dd yyyy')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight={'bold'} variant="body2">
                                                { DateTime.fromFormat(client.start, "HH:mm").toFormat('hh:mm a') + " - " + DateTime.fromFormat(client.end, "HH:mm").toFormat('hh:mm a') }

                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight={'bold'} variant="body2">
                                                { findEmployee(client.employeeTag).fullname }
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction={'row'} spacing={1}>
                                                <IconButton onClick={() => sendClientServing(client._id)}>
                                                    <CheckCircleIcon fontSize="small" htmlColor="#4CBB17"/>
                                                </IconButton>
                                                <IconButton onClick={() => sendClientNotification(client._id)}>
                                                    <NotificationsIcon fontSize="small" htmlColor="#FF0000"/>                                           
                                                </IconButton>
                                                <IconButton onClick={() => editClientInfo(client)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>

                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    )): null}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
                
        </div>
        
        </>
    )
}