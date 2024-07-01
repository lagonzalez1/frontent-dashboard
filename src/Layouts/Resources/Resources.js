import React, { useEffect, useState, useRef} from "react";
import { Grid, Typography, Stack,CardContent,Avatar, Container, Dialog, DialogActions, DialogTitle, DialogContent, Switch, Button,
Select, MenuItem, FormControlLabel, CardActionArea, IconButton, FormLabel, Paper, TableContainer, TableHead, TableCell, TableBody, TableRow, Table, FormControl, InputLabel, Divider, Slide, Box, CircularProgress } from '@mui/material';
import { getResourcesTotal, StyledCardService, stringAvatar,
 findResourceTag, updateResources, Transition, resourceInUse } from "./ResourcesHelper"; 
import AddResource from "../../components/AddResource/AddResource.js";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useSelector, useDispatch } from "react-redux";
import { setReload, setSnackbar } from "../../reducers/user";
import { usePermission } from "../../auth/Permissions.js";
import LoadingButton from '@mui/lab/LoadingButton';
import { User } from "phosphor-react";
import { reloadBusinessData } from '../../hooks/hooks';
import { authFields, authTokens } from "../../selectors/authSelectors";
import { payloadAuth } from "../../selectors/requestSelectors.js";

export default function Resources() {

    const { checkPermission } = usePermission();
    const {active, inactive} = getResourcesTotal();

    const employeeList = useSelector((state) => state.business.employees);
    const resourceData = useSelector((state) => state.business.resources);
    const appointments = useSelector((state) => state.business.appointments)
    const currentClients = useSelector((state) => state.business.currentClients)
    const {id, bid, email} = useSelector((state) => payloadAuth(state));


    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [dialog, setDialog] = useState(false);
    const [resource, setResource] = useState({});
    const [reloadPage, setReloadPage] = useState(false);
    
    const [form, setForm] = useState({
        resourceId: null,
        employeeId: null,
        active: null,
        publicValue: null
    })
    const handleResourceClick = (object) => {
        setDialog(true);
        setResource(object);
        setForm({ resourceId: object._id, active: object.active, employeeId: object.employeeTag, publicValue: object.public });
    }
    const handleCloseDialog = () => {
        setDialog(false);
        setResource({});
        setForm({
            publicValue: null,
            resourceId: null,
            employeeId: null,
            active: null});
    }

    const handleUpdateResource = async () => {
        if (!form){ return; }
        setLoading(true);
        updateResources(form, bid, email)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}));
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            setLoading(false)
            reloadCurrentPage();
            handleCloseDialog();
        })
      };

      const reloadCurrentPage = () => {
        setReloadPage(true);
      }



      useEffect(() => {

        //reloadBusinessData( email, bid);
        return () => {
            //setReloadPage(false);
        }
      }, []);





    const RenderResourceInUse = ({id}) => {
        let inUse = resourceInUse(appointments, currentClients, id);
        if (inUse.length <= 0) { return null}
        return (
            <Box>
            <Typography variant="caption">In use</Typography>
            <Divider />
            {inUse.map((client, index) => 
                <>
                <Typography variant="body2" component="p">Name: <strong>{client.fullname}</strong></Typography>
                <Typography variant="body2" component="p">Party size: <strong>{client.partySize}</strong></Typography>
                <Divider />
                </>
            )}
            </Box>
        )
    }

    return(
        <>
        <Grid container spacing={2}>
            <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                <Stack direction={'row'} sx={{alignItems: 'center'}} spacing={2}>
                    <Typography variant="h6"><strong> Available resources</strong></Typography>
                    <Typography variant="caption"> <FiberManualRecordIcon fontSize="xs" htmlColor="#00FF00"/> {active} Active</Typography>
                    <Typography variant="caption"> <FiberManualRecordIcon fontSize="xs" htmlColor="#FF0000"/> {inactive} Unavailable</Typography>
                </Stack>
                
            </Grid>
            <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'right'}}>
            </Grid>
        </Grid>

        
        <Grid container sx={{ pt: 2, flexDirection: 'row', flexWrap: 'wrap' }} columnSpacing={2} rowSpacing={2} >
            { resourceData ? resourceData.map((resource, index) => (
                    <Grid item xs={12} md={4} lg={3} sm={4} key={index}>
                        <StyledCardService sx={{ minWidth: '300px', maxWidth: '350px', maxHeight: '200px', minHeight: '175px'}} onClick={() => handleResourceClick(resource)}>
                        <CardActionArea>
                        <CardContent>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', pt: 1, pb: 1}}>
                            <Avatar {...stringAvatar(resource.title)} />
                                <Box sx={{ paddingLeft: 1, paddingRight: 1}}>    
                                <Typography variant="subtitle1" component="p" style={{ fontWeight: 'bold' }}>
                                {resource.active ? (<FiberManualRecordIcon fontSize="xs" htmlColor="#00FF00"/>):
                                (<FiberManualRecordIcon fontSize="xs" htmlColor="#FF0000"/>)}
                                    { ' ' + resource.title}
                                </Typography>
                                <Stack spacing={0.5}>
                                <Typography variant="body2" component="p">
                                        <User size={18} weight="duotone" />
                                        Assigned: { findResourceTag(resource.employeeTag) }
                                </Typography>
                                <Typography variant="body2" component="p">
                                         Serving max: {resource.size}
                                </Typography> 
                                <Typography variant="body2" component="p">
                                        Desc:  {resource.description}
                                </Typography>    
                                </Stack> 
                                </Box>
                            </Stack>
                            <RenderResourceInUse id={resource._id} />
                        </CardContent>   
                        </CardActionArea> 
                        </StyledCardService>
                
                </Grid>
            )): null}
        </Grid>


        <Dialog maxWidth={'xs'} TransitionComponent={Transition} fullWidth={true} open={dialog} onClose={handleCloseDialog}>
        <DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={handleCloseDialog}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton> 
                Resource - <strong>
            { resource ? resource.title: null }</strong></DialogTitle>

            <DialogContent>
                <Stack spacing={2}>
                
                    <RenderResourceInUse id={resource._id} />

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
                                    control={<Switch color="warning" inputProps={{ 'aria-label': 'controlled' }} checked={form.publicValue} onChange={e => setForm((item) => ({...item, publicValue: e.target.checked}) ) } />}
                                    label={ form && form.public ? 'On' : 'Off'}
                                /> 
                            </Grid>
                        </Grid>
                        <Typography variant="subtitle2" textAlign={'left'} fontWeight={'bold'}>
                            Assign a employee to this resource
                        </Typography>
                        <FormControl fullWidth={true}>
                        
                        <Select labelId="select-employee-tag" value={form.employeeId} onChange={(e) => setForm((prev) => ({...prev, employeeId: e.target.value}))}>
                            <MenuItem value="NONE">None</MenuItem>
                            {employeeList.map((employee, index) => (
                            <MenuItem key={index} value={employee._id}>
                                {employee.fullname}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        <Divider />

                
                    </Stack>  
            </DialogContent>


                <DialogActions>
                    <LoadingButton loading={loading} disabled={!checkPermission('RESO_CHANGE','EMPL_ATTACH')} sx={{borderRadius: 5, textTransform: 'lowercase', fontWeight: 'bold'}} variant="contained" onClick={() => handleUpdateResource()} > Submit</LoadingButton>
                </DialogActions> 
        </Dialog>

        <AddResource reloadParent={reloadCurrentPage} />

        </>
    )
}