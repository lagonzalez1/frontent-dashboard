import React, { useState, useEffect } from "react";
import { Grid, Typography, Stack,CardContent,Avatar, Container, CardActionArea, TextField
    , Modal, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Select, TableContainer, Table, TableCell,
Paper, Switch, TableBody, FormControl, MenuItem, TableRow, TableHead, FormControlLabel, InputLabel, Divider, Box, Tooltip, CircularProgress } from '@mui/material';
import AddService from "../../components/AddService/AddService.js";
import CloseIcon from "@mui/icons-material/Close"
import {  StyledCardService, stringAvatar, getServicesTotal, getEmployeeTags, removeExistingEmployees, removeEmployeeTag, updateService } from "./ServicesHelper.js"; 
import { getServicesAvailable, reloadBusinessData } from "../../hooks/hooks.js";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from "react-redux";
import { setReload, setSnackbar } from "../../reducers/user";
import { usePermission } from "../../auth/Permissions.js";


export default function Services() {


    const { checkPermission, canEmployeeEdit} = usePermission();
    const [dialog, setDialog] = useState(false);
    const {active, unactive} = getServicesTotal();
    const [service, setService] = useState({});
    const [loading, setLoading] = useState(false);

    const serviceList = useSelector((state) => state.business.services);
    const dispatch = useDispatch();
    

    const [form, setForm] = useState({
        serviceId: null,
        employeeId: null,
        active: null,
        public: null
    })
    
    const styles = {
        container: {
          display: 'flex', // Set the container's display to flex
          flexDirection: 'row', // Set the main axis to be horizontal
          flexWrap: 'wrap-reversed', // Allow the items to wrap to the next row if there's not enough space
          justifyContent: 'flex-start', // Start the items from the left (you can adjust this to center or space-between if needed)
        }
    };


    const handleClick = (service) => {
        setDialog(true);
        setService(service);
        setForm((prev) =>({...prev, serviceId: service._id, active: service.active, public: service.public}));

    }
    const handleClose = () =>{
        setService({});
        setDialog(false);
        setForm({serviceId: null,
            employeeId: null,
            active: null,
            public: null
        })
    }


    const handleUpdateService = () => {
        setLoading(true);
        updateService(form)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}));
            handleClose();
        })
        .catch(error => {
            dispatch(setSnackbar(error))
            setLoading(false);
        })
        .finally(() =>{
            setLoading(false)
        })

    }

    const removeEmployeeService = (id, serviceId) => {
        setLoading(true);
        const data = { employeeId: id, serviceId: serviceId}
        removeEmployeeTag(data)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}));
            handleClose();
        })
        .catch(error => {
            dispatch(setSnackbar(error))
        })
        .finally(() =>{
            setLoading(false)
        })
    }

    useEffect(() => {  
        reloadBusinessData(dispatch);      
    },[loading])

    return(
        <>
        <Grid 
            container
            spacing={2}    
        >
            <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                <Stack direction={'row'} sx={{alignItems: 'center'}} spacing={2}>
                    <Typography variant="h6"><strong> Available services</strong></Typography>
                    <Typography variant="caption"> <FiberManualRecordIcon fontSize="xs" htmlColor="#00FF00"/> {active} Active</Typography>
                    <Typography variant="caption"> <FiberManualRecordIcon fontSize="xs" htmlColor="#FF0000"/> {unactive} Unavailable</Typography>
                </Stack>
                
            </Grid>
            <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'right'}}>
            
            </Grid>
        </Grid>

        
        <Grid container sx={{ pt: 2, flexDirection: 'row', flexWrap: 'wrap' }} columnSpacing={2} rowSpacing={2}>
            { serviceList ? serviceList.map((service) => (
                <Grid item key={service._id}>
                    <StyledCardService sx={{ minWidth: '300px', maxWidth: '350px'}} onClick={() => handleClick(service)}>
                        <CardActionArea>
                        <CardContent>
                            <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center'}}> 
                            {service ? <Avatar {...stringAvatar(service.title)} />: null}
                            <Box sx={{ paddingLeft: 1, paddingRight: 1}}>    
                            <Typography variant="subtitle1" component="p" style={{ fontWeight: 'bold' }}>
                            {service.active ? (<FiberManualRecordIcon fontSize="xs" htmlColor="#00FF00"/>):
                             (<FiberManualRecordIcon fontSize="xs" htmlColor="#FF0000"/>)}
                                { ' ' + service.title}
                            </Typography>
                            <Stack>
                                <Typography variant="body2" component="p">
                                    <strong>Duration: </strong> {service.duration}
                                </Typography>
                                <Typography  variant="body2" component="p">
                                    <strong>Cost: </strong> {service.cost}
                                </Typography>
                                <Typography  variant="body2" component="p">
                                    <strong>Public: </strong> {service.public ? 'True': 'False'}
                                </Typography>
                            </Stack>
                            </Box>

                            </Stack>    
                        </CardContent>  
                        </CardActionArea>  
                    </StyledCardService>
                
                </Grid>
            )): null}
        </Grid>

        <Dialog  maxWidth={'xs'} fullWidth={'xs'}  open={dialog} onClose={handleClose}>
        <DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton> 
                

                <Typography variant="h5" fontWeight={'bold'}>{ "Service -" + service ? service.title: null } </Typography>
            </DialogTitle>


            {loading ? (
                <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </DialogContent>
              
            ): (
            <DialogContent>

                <Stack spacing={1}>
                        <Divider />
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" fontWeight={'bold'}>Active</Typography>
                                <Typography variant="body2">Allow your staff to use</Typography>
                                <FormControlLabel
                                    sx={{ marginLeft: 0}}
                                    control={<Switch color="secondary" inputProps={{ 'aria-label': 'controlled' }} checked={form.active} onChange={e => setForm((item) => ({...item, active: e.target.checked}) ) } />}
                                    label={ form && form.active ? 'On' : 'Off'}
                                /> 
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" fontWeight={'bold'}>Public</Typography>
                                <Typography variant="body2">Allow the public to view</Typography>
                                <FormControlLabel
                                    sx={{ marginLeft: 0}}
                                    control={<Switch color="secondary" inputProps={{ 'aria-label': 'controlled' }} checked={form.public} onChange={e => setForm((item) => ({...item, public: e.target.checked}) ) } />}
                                    label={ form && form.public ? 'On' : 'Off'}
                                /> 
                            </Grid>
                        </Grid>
                        
                        
                        <Divider />

                        <Typography variant={"subtitle2"} fontWeight={'bold'} textAlign={'left'}>Add a new employee to service</Typography>
                        <Select labelId="select-employee-tag" value={form.employeeId} onChange={(e) => setForm((prev) => ({...prev, employeeId: e.target.value}))}>
                        {
                            service.employeeTags && removeExistingEmployees(service.employeeTags).map((employee, index) => (
                            <MenuItem key={index} value={employee._id}>
                                {employee.fullname}
                            </MenuItem>
                            ))
                        }
                        </Select>
                        { service.employeeTags ? (
                            <>
                        <Divider />
                        <Typography variant={"body2"} textAlign={'left'}>Current employees assigned to this service.</Typography>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                
                                    <TableHead>
                                        
                                        <TableRow>
                                            <TableCell>
                                                #
                                            </TableCell>
                                            <TableCell>
                                                Employee
                                            </TableCell>
                                            <TableCell>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                        service && getEmployeeTags(service.employeeTags).map((employee, index) => {
                                            return (
                                                <TableRow>
                                                    <TableCell >{++index}</TableCell>
                                                    <TableCell >{employee.fullname}</TableCell>
                                                    <TableCell>
                                                    <Tooltip title="Remove employee from service.">

                                                    <IconButton disabled={!canEmployeeEdit(employee._id, 'EMPL_DETACH')} onClick={() => removeEmployeeService(employee._id, service._id)} aria-label="delete">
                                                        <DeleteIcon />
                                                    </IconButton> 
                                                    </Tooltip>
                                                    </TableCell>
                                                    
                                                </TableRow>
                                            )
                                        })
                                            
                                        }
                                    </TableBody>
                                </Table>
                                                    
                            </TableContainer>  
                        </>
                        ):null}
                        
                        
                    </Stack>

            </DialogContent>
            )}

                <DialogActions>
                    <Button sx={{ borderRadius: 10}} disabled={!checkPermission('SERV_CHANGE')} variant="contained" onClick={() => handleUpdateService()} > Save</Button>
                </DialogActions> 
        </Dialog>

      
        <AddService/>
        </>
    )
}