import React, { useEffect, useState } from "react";
import { Grid, Skeleton ,Typography, Stack, Tooltip, Button, Table, 
    TableRow, Paper, TableContainer, TableHead, TableBody, TableCell, IconButton, Dialog, DialogContent, DialogTitle, TextField, Divider, Checkbox, DialogActions, FormControl, FormControlLabel, FormGroup, Alert, Box, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useSelector, useDispatch } from "react-redux";
import  { columns, completeClientAppointment } from "./Helper";
import {  findResource, findService, getServingCount, findEmployee, getServingClients } from "../../hooks/hooks";
import "../../css/Serving.css";
import { setReload, setSnackbar } from "../../reducers/user";
import CloseIcon from "@mui/icons-material/Close"
import { useSubscription } from "../../auth/Subscription";
import Collapse from '@mui/material/Collapse';
import AlertMessageGeneral from "../../components/AlertMessage/AlertMessageGeneral";


export default function Serving({setClient}) {
    const { checkSubscription } = useSubscription();

    const dispatch = useDispatch();
    const business = useSelector((state) => state.business);
    const accessToken = useSelector((state) => state.tokens.access_token);
    const [loading, setLoading] = useState(false);
    const [servingList, setServingList] = useState([]);
    const [errors, setErrors] = useState({title: null, body: null});
    const [openErrors, setOpenErrors] = useState(false);
    const [reloadPage, setReloadPage] = useState(false);

    const [client, setCurrentClient] = useState(null);
    const [clientNotes, setClientNotes] = useState(null);
    const [saveClient, setSaveClient] = useState(false);
    const [notesDialog, setUpdateNotesDialog] = useState(false);
    let { groupCount, groupTotalCount } = getServingCount();

    const closeNotesDialog = () => {
        setClientNotes(null);
        setUpdateNotesDialog(false);
        setCurrentClient(null)
    }
    useEffect(() => {
        getServingList();
        return () => {
            setReloadPage(false)
        }
    }, [reloadPage])


    const getServingList = () => {
        setLoading(true);
        if (accessToken === undefined) { return; }
        getServingClients(accessToken)
        .then(response => {
            setServingList(response);
        })
        .catch(error => {
            setOpenErrors(true);
            setErrors({title: 'error', body: error.msg});
        })
        .finally(() => {
            setLoading(false);
        })
    }

    const openCheckoutNotes = (client) => {
        // Check if they can save to analytics.
        if (!checkSubscription('ANALYTICS')){
            checkoutClient();
            return;
        }
        setCurrentClient(client);
        setUpdateNotesDialog(true);
    }

    const handleNotesChange = (e) => {
        const newValue = e.target.value;
        setClientNotes(newValue);
    }

    const checkoutClient = () => {
        // This will now call a notes dialog to update the notes and pass into 
        if (!client) {
            setErrors({title: 'No User', body: 'No user selected'});
            return;
        }
        setLoading(true)
        completeClientAppointment(client, clientNotes, saveClient)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        }).catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            closeNotesDialog();
            setLoading(false);
            setReloadPage(true);
        })
    }

    const displayClientInformation = (client) => {
        setClient({payload: client, open: true, fromComponent: 'serving'})
    }

    const closeAlert = () => {
        setErrors({title: null, body: null});
        setOpenErrors(false);
    }

    return(
        <div className="servingContainer">
            <Box sx={{ width: '100%'}}>
                <Collapse in={openErrors}>
                    <AlertMessageGeneral open={openErrors} onClose={closeAlert} title={errors.title} body={errors.body} />
                </Collapse>
            </Box>
            
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
                    loading === true ? (
                        <TableRow>
                            <TableCell colSpan={4}/>
                            <TableCell>
                            <CircularProgress size={15} />
                            </TableCell>
                            <TableCell colSpan={2}/>
                        </TableRow>
                    ): 
                    servingList && servingList.length > 0 ?
                    (
                        servingList.map((item, index) => {
                            return (
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
                                <Typography variant="caption">
                                    {item.serviceTag ? findService(item.serviceTag).title : null}
                                </Typography>
                                </TableCell>
                                <TableCell align="left"> 
                                    <Typography variant="subtitle2" fontWeight="bolder">{item.partySize}</Typography>
                                </TableCell>
                                <TableCell align="left"> 
                                    <Typography variant="subtitle2" fontWeight="bolder">{findEmployee(item.status.served_by).fullname}</Typography>
                                    
                                </TableCell>
                                <TableCell align="left"> 
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
                                        <IconButton onClick={() => openCheckoutNotes(item)}>
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
                            )
                        })): 
                        (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                No data available
                            </TableCell>
                        </TableRow>
                        )
                    
                }

                
                
                                    
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
                    <Dialog
                        id="updateClientNotes"
                        open={notesDialog}
                        onClose={closeNotesDialog}
                        fullWidth
                    >
                        <DialogTitle>
                            <IconButton
                                        aria-label="close"
                                        onClick={closeNotesDialog}
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                            color: (theme) => theme.palette.grey[500],
                                        }}
                                        >
                                        <CloseIcon />
                                    </IconButton>
                                <Typography variant='h5' fontWeight={'bold'}>Check-out client: {client && client.fullname} </Typography>
                            </DialogTitle>
                        <DialogContent>
                            <Divider />
                            <Stack spacing={2}>
                                <Typography variant="body2">
                                    <u>{"On file: "}</u>
                                    <br/>
                                    {client && client.notes}
                                </Typography>
                                <Divider />
                                <TextField
                                    fullWidth={true}
                                    value={clientNotes}
                                    onChange={handleNotesChange}
                                    label={'Update notes'}
                                    multiline
                                    rows={3}
                                />
                            </Stack>
                            <Divider />
                            <FormGroup>
                                <FormControlLabel control={<Checkbox value={saveClient} onChange={e => setSaveClient(e.target.checked)} />} label="Save client ?" />
                            </FormGroup>
                        </DialogContent>
                        <DialogActions>
                            <Button sx={{ borderRadius: 7}} variant="contained" onClick={() => checkoutClient()}>Complete</Button>
                        </DialogActions>

                    </Dialog>
        </div>
    )
}