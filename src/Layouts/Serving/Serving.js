import React, { useEffect, useState } from "react";
import { Grid, Skeleton ,Typography, Stack, Tooltip, Button, Table, 
    TableRow, Paper, TableContainer, TableHead, TableBody, TableCell, Container, IconButton, Icon } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditNoteIcon from '@mui/icons-material/EditNote';

import { useSelector, useDispatch } from "react-redux";
import  { getServingCount, getUserTable, columns } from "./Helper";
import {  findResource, findService } from "../../hooks/hooks";
import "../../css/Serving.css";


export default function Serving() {
    const dispatch = useDispatch();
    const business = useSelector((state) => state.business);

    let servingList = getUserTable();
    let { groupCount, groupTotalCount } = getServingCount();


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
                                                <Typography variant="subtitle2" fontWeight="bold">{ col.label }</Typography>
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
                                        { item.serviceTag &&  'Service: '+ findService(item.serviceTag).title }
                                    </Typography>

                                    <Typography variant="subtitle2" fontWeight="bolder">
                                        { item.resourceTag && 'Resource: ' + findResource(item.resourceTag).title }
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                <Typography variant="subtitle2" fontWeight="bolder">
                                    {item.serveTime ? ( item.serveTime.hours >= 1 ? (`${item.serveTime.hours} Hr ${item.serveTime.minutes} Min.`): (`${item.serveTime.minutes} Min.`)): (null) } 

                                </Typography>

                                </TableCell>
                                <TableCell align="left">
                                <Stack
                                        direction="row"
                                        spacing={1}
                                    >
                                        <IconButton>
                                            <Tooltip title="Checkout" placement="left">
                                                <CheckCircleIcon htmlColor="#4CBB17"/>
                                            </Tooltip>                                            
                                        </IconButton>

                                        <IconButton>
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