import React from "react";
import { Grid, Skeleton ,Typography, Stack, Tooltip, Button, Table, 
    TableRow, Paper, TableContainer, TableHead, TableBody, TableCell, Container } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import  { getServingCount, getUserTable, columns, clientOptions } from "./Helper";
import "../../css/Serving.css";


export default function Serving() {
    const dispatch = useDispatch();
    const servingList = getUserTable();
    const { groupCount, groupTotalCount } = getServingCount();
    const buisness = useSelector((state) => state.buisness);


    return(
        <div className="servingContainer">
            <Grid container>
                <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                        <Stack>
                            <Typography variant="body2">{buisness ? buisness.buisnessName: <Skeleton/> }</Typography>
                            <Typography variant="h5"><strong>Serving</strong></Typography>
                        </Stack>
                        
                </Grid>
                <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>

                </Grid>

                <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left', pt: 2}}>
                    <Tooltip title="How many people are in the establishment." placement="right">
                                <Button sx={{ backgroundColor: 'white'}} variant="outlined" startIcon={null}>
                                    <Typography variant="button" sx={{ textTransform: 'lowercase', fontWeight: 'normal'}}>{buisness ? (groupCount + ` Party ( ${groupTotalCount} People)` ): <Skeleton/> }</Typography>
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
                                <TableCell align="left">{++index}</TableCell>
                                <TableCell align="left">{item.fullname}</TableCell>

                                <TableCell align="left">{item.partySize}</TableCell>
                                <TableCell align="left">{item.timestamp}</TableCell>
                                <TableCell align="left">NAme</TableCell>
                                <TableCell align="left">NAme</TableCell>



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