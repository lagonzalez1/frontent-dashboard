import React, { useState, useEffect} from "react";
import { Stack, Typography, Button, Grid, TableHead,TableRow, TableCell, Paper, Table, 
    TableContainer, TableBody, Tooltip, Skeleton, CircularProgress, Box, IconButton } from "@mui/material";

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';

import { findEmployee, getAppointmentClients, moveClientServing, findService, getAppointmentTable } from "../../hooks/hooks";
import { APPOINTMENT, APPOINTMENT_DATE_SELECT } from "../../static/static";
import { useSelector, useDispatch } from "react-redux";
import { setReload, setSnackbar } from "../../reducers/user";
import { columns } from "./AppointmentsHelper";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";


export default function Appointments({setClient, setEditClient}) {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const business = useSelector((state) => state.business);
    const currentDate = DateTime.local().setZone(business.timezone);
    const [selectedDate, setSelectedDate] = useState();
    const [data, setData] = useState([]);

    useEffect(() => {
        getLastSearchedDate();
        // Cleanup
        return () => {
            setLoading(false);
        }
    }, [loading]);

    function getLastSearchedDate () {
        const date = sessionStorage.getItem(APPOINTMENT_DATE_SELECT);
        if (date) {
            let lastDate = DateTime.fromISO(date);
            setSelectedDate(lastDate)
            let reload = getAppointmentTable(lastDate);
            setData(reload);
        }
        else {
            let reload = getAppointmentTable(currentDate);
            setSelectedDate(currentDate)
            setData(reload);
        }

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
            setLoading(false);
            dispatch(setReload(true));
        })
    }

    function handleDateChange(date) {
        const dateObj = date.toISO();
        sessionStorage.setItem(APPOINTMENT_DATE_SELECT, dateObj); 
        setLoading(true);
    };

    function openClientDrawer(item) {
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
                    <Tooltip title="Your current location." placement="bottom">
                        <Button sx={{ backgroundColor: 'white'}} variant="outlined" startIcon={<SouthAmericaIcon />}>
                            <Typography variant="button" sx={{ textTransform: 'lowercase'}}>{business ? (business.timezone): <Skeleton/> }</Typography>
                        </Button>
                    </Tooltip>
                        
                </Grid>
                {/** Is this where the error is?, once a new component  */}
                <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'right '}}>
                    <Box>
                        <DatePicker
                            label={"Date"}
                            sx={{
                                width: '100%'
                            }}
                            fontSize="sm"
                            value={selectedDate}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} />}
                            minDate={currentDate}
                        />
                        </Box>
                </Grid>
            </Grid>

                {!loading ? <div className="servingTable">
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
                                                <Typography fontWeight="normal" variant="caption">
                                                    { client.serviceTag ? findService(client.serviceTag).title: null }
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
                : <CircularProgress />
                }
                
        </div>
        
        </>
    )
};



