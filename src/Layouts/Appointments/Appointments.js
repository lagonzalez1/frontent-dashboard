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

import {  findClient, findResource, findService } from "../../hooks/hooks";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setReload, setSnackbar } from "../../reducers/user";
import { handleOpenNewTab, requestChangeAccept, options, columns, 
    clientOptions, OPTIONS_SELECT, acceptingRejecting,
    removeClient, moveClientDown, moveClientUp, requestNoShow, moveClientServing, requestBusinessState} from "./AppointmentsHelper";
import { reloadBusinessData, getUserTable } from "../../hooks/hooks";
import { getHeaders } from "../../auth/Auth";
import { DateTime } from "luxon";



export default function Appointments ({setClient, setEditClient}) {
    const dispatch = useDispatch();
    const business = useSelector((state) => state.business);
    const user = useSelector((state) => state.user);
    const reload = useSelector((state) => state.reload);


    useEffect(() => {
        
    }, [])


    const test = () => {
        const headers = getHeaders();
        const date = DateTime.local().toJSDate();
        axios.post('/api/internal/available_appointments', {bid: business._id, appointmentDate: date}, headers)
        .then(res => {
            console.log(res);
        })
        .catch(error => {
            console.log(error);
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

                
                                    
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    </div>
        </div>
        
        </>
    )
}