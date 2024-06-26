import React, { useState, useEffect } from "react";
import { Grid, Typography, Stack,CardContent,Avatar, Container, CardActionArea, TextField
    , Modal, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Select, TableContainer, Table, TableCell,
Paper, Switch, TableBody, FormControl, MenuItem, TableRow, TableHead, FormControlLabel, InputLabel, Divider, Box, Tooltip, CircularProgress, 
Slide} from '@mui/material';
import AddService from "../../components/AddService/AddService.js";
import CloseIcon from "@mui/icons-material/Close"
import {  StyledCardService, stringAvatar, getServicesTotal, getEmployeeTags, removeExistingEmployees, removeEmployeeTag, updateService, Transition } from "./ServicesHelper.js"; 
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from "react-redux";
import { setReload, setSnackbar } from "../../reducers/user";
import { usePermission } from "../../auth/Permissions.js";
import LoadingButton from '@mui/lab/LoadingButton';
import { ClockClockwise, LockSimple, LockSimpleOpen, CurrencyDollar } from "phosphor-react";
import { reloadBusinessData } from '../../hooks/hooks';
import { authFields, authTokens } from "../../selectors/authSelectors";
import { payloadAuth } from "../../selectors/requestSelectors.js";
import { AttachMoneyOutlined, LockOpenRounded, LockRounded, TimelapseOutlined } from "@mui/icons-material";

export default function Services() {

    const { checkPermission, canEmployeeEdit} = usePermission();
    const dispatch = useDispatch();
    const { id, bid, email } = useSelector((state) => payloadAuth(state));
    const serviceList = useSelector((state) => state.business.services);
    const employees = useSelector(state => state.business.employees)

    const [dialog, setDialog] = useState(false);
    const {active, unactive} = getServicesTotal();
    const [service, setService] = useState({});
    const [loading, setLoading] = useState(false);
    const [reloadPage, setReloadPage] = useState(false);
    

    

    const [form, setForm] = useState({
        serviceId: null,
        employeeId: null,
        active: null,
        public: null
    })    
    
    const handleClick = (service) => {
        setDialog(true);
        setService(service);
        setForm((prev) =>({...prev, serviceId: service._id, active: service.active, public: service.public}));

    }
    const handleClose = () => {
        setDialog(false);
        setService({});
        setForm((prev) =>({...prev, serviceId: null, active: null, public: null, employeeId: null}));

    }


    const handleUpdateService = () => {
        setLoading(true);
        updateService(form, bid, email)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}));
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}));
        })
        .finally(() =>{
            setLoading(false);
            reloadCurrentPage();
            handleClose();
        })

    }

    const removeEmployeeService = (id, serviceId) => {
        setLoading(true);
        console.log(serviceId)
        const data = { employeeId: id, serviceId: serviceId}
        removeEmployeeTag(data, bid, email)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}));
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}));        
        })
        .finally(() =>{
            setLoading(false)
            handleClose();
            reloadCurrentPage();
        })
    }


    const reloadCurrentPage = () => {
        setReloadPage(true);
    }

    useEffect(() => {  
        //reloadBusinessData(dispatch, access_token, authEmail, authId);
        return () => {
            //setReloadPage(false);
        } 
    },[])

    

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

        
        <Grid container sx={{ pt: 2, flexDirection: 'row', flexWrap: 'wrap' }} direction={'row'} alignItems="center" columnSpacing={2} rowSpacing={2} spacing={2}>
            { serviceList ? serviceList.map((service, index) => (
                <Grid item xs={12} md={4} lg={3} sm={4} key={index}>
                    <StyledCardService sx={{ minWidth: '200px', maxWidth: '350px', maxHeight: '220px', minHeight: '155px'}} onClick={() => handleClick(service)}>
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
                                <Stack spacing={0.5}>
                                    <Typography variant="body2" component="p">
                                        {service.description ? service.description : null}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                    <TimelapseOutlined fontSize="small"/>
                                        Duration: {service.duration}
                                    </Typography>
                                    <Typography  variant="body2" component="p">
                                        <AttachMoneyOutlined fontSize="small" />
                                        Cost: {service.cost}
                                    </Typography>
                                    <Typography  variant="body2" component="p">
                                        {service.public ? <LockRounded fontSize="small" />: <LockOpenRounded fontSize="small" /> }
                                        Public: {service.public ? 'True': 'False'}
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

        <Dialog keepMounted={true} maxWidth={'xs'} fullWidth={'xs'} TransitionComponent={Transition} open={dialog} onClose={handleClose}>
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


            <DialogContent>
                <Stack spacing={1}>
                        <Divider />
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" fontWeight={'bold'}>Active</Typography>
                                <Typography variant="body2">Allow your staff to use</Typography>
                                <FormControlLabel
                                    sx={{ marginLeft: 0}}
                                    control={<Switch color="warning" inputProps={{ 'aria-label': 'controlled' }} checked={form.active} onChange={e => setForm((item) => ({...item, active: e.target.checked}) ) } />}
                                    label={ form && form.active ? 'On' : 'Off'}
                                /> 
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" fontWeight={'bold'}>Public</Typography>
                                <Typography variant="body2">Allow the public to view</Typography>
                                <FormControlLabel
                                    sx={{ marginLeft: 0}}
                                    control={<Switch color="warning" inputProps={{ 'aria-label': 'controlled' }} checked={form.public} onChange={e => setForm((item) => ({...item, public: e.target.checked}) ) } />}
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
                                <Typography variant="subtitle1">{employee.fullname}</Typography>
                            </MenuItem>
                            ))
                        }
                        </Select>
                        { service.employeeTags ? (
                            <>
                        <Divider />
                        <Typography variant={"body2"} fontWeight={'bold'} textAlign={'left'}>Current employees assigned to this service.</Typography>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="body2">#</Typography>
                                            </TableCell>
                                            <TableCell>
                                            <Typography variant="body2">Fullname</Typography>
                                            </TableCell>
                                            <TableCell>
                                            <Typography variant="body2">Delete</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                        service ? getEmployeeTags(service.employeeTags, employees).map((employee, index) => {
                                            
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell><Typography variant="caption">{++index}</Typography></TableCell>
                                                    <TableCell> <Typography variant="body2">{employee.fullname}</Typography> </TableCell>
                                                    <TableCell>
                                                    <Tooltip title="Remove employee from service.">
                                                    <IconButton disabled={!canEmployeeEdit(employee._id, 'EMPL_DETACH')} onClick={() => removeEmployeeService(employee._id, service._id)} aria-label="delete">
                                                        <DeleteIcon />
                                                    </IconButton> 
                                                    </Tooltip>
                                                    </TableCell>
                                                    
                                                </TableRow>
                                            )
                                        }): null
                                            
                                        }
                                    </TableBody>
                                </Table>
                                                    
                            </TableContainer>  
                        </>
                        ):null}
                        
                        
                    </Stack>

            </DialogContent>

            <DialogActions>
                <LoadingButton loading={loading} sx={{borderRadius: 5, textTransform: 'lowercase', fontWeight: 'bold'}} disabled={!checkPermission('SERV_CHANGE')} variant="contained" onClick={() => handleUpdateService()}> Submit</LoadingButton>
            </DialogActions> 
        </Dialog>

      
        <AddService reloadParent={reloadCurrentPage}/>
        </>
    )
}