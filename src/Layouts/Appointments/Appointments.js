import React, { useState, useEffect} from "react";
import { Stack, Typography, Button, Grid, TableHead,TableRow, TableCell, Paper, Table, 
    TableContainer, TableBody, Tooltip, Skeleton  } from "@mui/material";


import { findEmployee, getAppointmentClients } from "../../hooks/hooks";
import { useSelector, useDispatch } from "react-redux";
import { setSnackbar } from "../../reducers/user";
import { columns } from "./AppointmentsHelper";
import { DateTime } from "luxon";



export default function Appointments ({setClient, setEditClient}) {
    const dispatch = useDispatch();

    const [data, setData] = useState({});
    const business = useSelector((state) => state.business);
    const user = useSelector((state) => state.user);
    const reload = useSelector((state) => state.reload);
    const refresh = useSelector((state) => state.refresh);


    useEffect(() => {
        loadAppointments();
    }, [refresh]);



    const loadAppointments = () => {
        const appointmentDate = DateTime.local().setZone(business.timezone);
        const payload = { appointmentDate }
        getAppointmentClients(payload)
        .then(response => {
            setData(response);
        })
        .catch(error => {
            dispatch(setSnackbar({ requestMessage: error, requestStatus: true }))

        })
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
                <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                
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
                                    { data }
                                    { data.map((client, index) => (
                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {++index}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    { client.fullname}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    { DateTime.fromFormat(client.start, "HH:mm").toFormat('hh:mm a') + " - " + DateTime.fromFormat(client.end, "HH:mm").toFormat('hh:mm a') }
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    { findEmployee(client.employeeTag).fullname }
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {'Actions'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    </div>
        </div>
        
        </>
    )
}