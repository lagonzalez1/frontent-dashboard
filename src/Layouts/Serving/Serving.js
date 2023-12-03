import React, { useEffect, useState } from "react";
import { Grid, Skeleton ,Typography, Stack, Tooltip, Button, Table, 
    TableRow, Paper, TableContainer, TableHead, TableBody, TableCell, IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useSelector, useDispatch } from "react-redux";
import  { columns, completeClientAppointment } from "./Helper";
import {  findResource, findService, getServingTable, getServingCount, getAppointmentServingTable, getWaitlistServingTable, reloadBusinessData } from "../../hooks/hooks";
import "../../css/Serving.css";
import { setSnackbar } from "../../reducers/user";


export default function Serving({setClient}) {
    const dispatch = useDispatch();
    const business = useSelector((state) => state.business);
    const [loading, setLoading] = useState(false);
    const [appointmentServing, setAppointmentServing] = useState(null);
    const [servingList, setServingList] = useState(null);

    let { groupCount, groupTotalCount } = getServingCount();

    useEffect(() => {
        reloadBusinessData(dispatch);
        let appointmentServing = getAppointmentServingTable();
        let servingList = getServingTable();
        setServingList(servingList);
        setAppointmentServing(appointmentServing)
    }, [loading])

    const checkoutClient = (client) => {
        if (!client) {
            return;
        }
        setLoading(true)
        completeClientAppointment(client)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        }).catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            console.log("Called")
            setLoading(false);
        })
    }

    const displayClientInformation = (client) => {
        setClient({payload: client, open: true, fromComponent: 'Serving'})
    }

    return(
        <div className="servingContainer">
            <Grid container>
                <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                        <Stack>
                            <Typography variant="body2">{business ? business.businessName: <Skeleton/> }</Typography>
                            <Typography variant="h5"><strong>Serving</strong></Typography>
                        </Stack>
                        
                </Grid>
                <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>

                </Grid>

                <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left', pt: 2}}>
                    <Tooltip title="How many people are in the establishment." placement="right">
                                <Button sx={{ backgroundColor: 'white'}} variant="outlined" startIcon={null}>
                                    <Typography variant="button" sx={{ textTransform: 'lowercase', fontWeight: 'normal'}}>{business ? (groupCount + ` Party ( ${groupTotalCount} People)` ): <Skeleton/> }</Typography>
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

                {
                    Array.isArray(servingList) ? 
                        servingList.map((item, index) => (
                            <TableRow key={index}>                                       
                                <TableCell align="left">
                                    <Typography variant="subtitle2" fontWeight="bolder">
                                    {++index}
                                    </Typography> 
                                    </TableCell>
                                <TableCell align="left">
                                <Typography variant="subtitle2" fontWeight="bolder">
                                    {item.fullname}
                                </Typography>
                                </TableCell>

                                <TableCell align="left"> 
                                    <Typography variant="subtitle2" fontWeight="bolder">{item.partySize}</Typography>
                                
                                </TableCell>
                                <TableCell align="left"> 
                                    <Typography variant="subtitle2" fontWeight="bolder">
                                        {'Service: '+ findService(item.serviceTag).title }
                                    </Typography>

                                    <Typography variant="subtitle2" fontWeight="bolder">
                                        {'Resource: ' + findResource(item.resourceTag).title }
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                <Typography variant="subtitle2" fontWeight="bolder">
                                    {item.waittime ? ( item.waittime.hours >= 1 ? (`${item.waittime.hours} Hr ${item.waittime.minutes} Min.`): (`${item.waittime.minutes} Min.`)): (null) } 

                                </Typography>

                                </TableCell>
                                <TableCell align="left">
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                    >
                                        <IconButton onClick={() => checkoutClient(item)}>
                                            <Tooltip title="Checkout" placement="left">
                                                <CheckCircleIcon htmlColor="#4CBB17"/>
                                            </Tooltip>                                            
                                        </IconButton>

                                        <IconButton onClick={() => displayClientInformation(item)}>
                                            <Tooltip title="Edit" placement="right">
                                                <EditNoteIcon />
                                            </Tooltip>  
                                        </IconButton>
                                       
                                    </Stack>
                                </TableCell>



                            </TableRow>
                        ))
                    : null
                }
                {
                    Array.isArray(appointmentServing) ? 
                        appointmentServing.map((item, index) => (
                            <TableRow key={index}>                                       
                                <TableCell align="left">
                                    <Typography variant="subtitle2" fontWeight="bolder">
                                    {++index}
                                    </Typography> 
                                    </TableCell>
                                <TableCell align="left">
                                <Typography variant="subtitle2" fontWeight="bolder">
                                    {item.fullname}
                                </Typography>
                                </TableCell>

                                <TableCell align="left"> 
                                    <Typography variant="subtitle2" fontWeight="bolder">{item.partySize}</Typography>
                                
                                </TableCell>
                                <TableCell align="left"> 
                                    <Typography variant="subtitle2" fontWeight="bolder">
                                        {'Service: '+ findService(item.serviceTag).title }
                                    </Typography>

                                    <Typography variant="subtitle2" fontWeight="bolder">
                                        {'Resource: ' + findResource(item.resourceTag).title }
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                <Typography variant="subtitle2" fontWeight="bolder">
                                    {item.waittime ? ( item.waittime.hours >= 1 ? (`${item.waittime.hours} Hr ${item.waittime.minutes} Min.`): (`${item.waittime.minutes} Min.`)): (null) } 

                                </Typography>

                                </TableCell>
                                <TableCell align="left">
                                <Stack
                                        direction="row"
                                        spacing={1}
                                    >
                                        <IconButton onClick={() => checkoutClient(item)}>
                                            <Tooltip title="Checkout" placement="left">
                                                <CheckCircleIcon htmlColor="#4CBB17"/>
                                            </Tooltip>                                            
                                        </IconButton>

                                        <IconButton onClick={() => displayClientInformation(item)}>
                                            <Tooltip title="Edit" placement="right">
                                                <EditNoteIcon />
                                            </Tooltip>  
                                        </IconButton>
                                       
                                    </Stack>
                                </TableCell>



                            </TableRow>
                        ))
                    : null
                }
                                    
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    </div>
        </div>
    )
}