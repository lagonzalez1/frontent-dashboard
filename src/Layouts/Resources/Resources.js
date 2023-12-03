import React, { useEffect, useState, useRef} from "react";
import { Grid, Typography, Stack,CardContent,Avatar, Container, Dialog, DialogActions, DialogTitle, DialogContent, Switch, Button,
Select, MenuItem, FormControlLabel, CardActionArea, IconButton, FormLabel, Paper, TableContainer, TableHead, TableCell, TableBody, TableRow, Table, FormControl, InputLabel, Divider, Slide, Box, CircularProgress } from '@mui/material';
import { getResourcesTotal, StyledCardService, stringAvatar,
 findResourceTag, findServingSize, updateResources, removeResourceTag } from "./ResourcesHelper"; 
import { findClient, reloadBusinessData } from "../../hooks/hooks";
import AddResource from "../../components/AddResource/AddResource.js";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useSelector, useDispatch } from "react-redux";
import { setReload, setSnackbar } from "../../reducers/user";

export default function Resources() {
    const {active, inactive} = getResourcesTotal();

    const employeeList = useSelector((state) => state.business.employees);
    const resourceData = useSelector((state) => state.business.resources);
    const permissionLevel = useSelector((state) => state.user.permissions);

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [dialog, setDialog] = useState(false);
    const [resource, setResource] = useState({});
    
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
        updateResources(form)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}));
            handleCloseDialog();
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            console.log("Called")
            setLoading(false);
        })
      };

      useEffect(() => {
        reloadBusinessData(dispatch);
      }, [loading])

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
                    <Grid item key={resource._id}>
                        <StyledCardService sx={{ minWidth: '300px', maxWidth: '350px'}} onClick={() => handleResourceClick(resource)}>
                        <CardActionArea>
                        <CardContent>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center'}}>
                            <Avatar {...stringAvatar(resource.title)} />
                            <Box sx={{ paddingLeft: 1, paddingRight: 1}}>    
                            <Typography variant="subtitle1" component="p" style={{ fontWeight: 'bold' }}>
                            {resource.active ? (<FiberManualRecordIcon fontSize="xs" htmlColor="#00FF00"/>):
                             (<FiberManualRecordIcon fontSize="xs" htmlColor="#FF0000"/>)}
                                { ' ' + resource.title}
                            </Typography>
                            <Typography variant="body2" component="p">
                                    <strong>Assigned: </strong> { findResourceTag(resource.employeeTag) }
                            </Typography>
                            <Typography  variant="body2" component="p">
                                    <strong>Serving: </strong> {findServingSize(resource._id).fullname }
                                </Typography>
                            <Stack direction="row" spacing={1}>
                                
                                <Typography  variant="body2" component="p">
                                    <strong>Size:</strong> {findServingSize(resource._id).partySize }
                                </Typography>
                                <Typography variant="body2" component="p">
                                    <strong>Max: </strong> {resource.size}
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


        <Dialog maxWidth={'xs'} fullWidth={true}  open={dialog} onClose={handleCloseDialog}>
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

            {loading ? (
                <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </DialogContent>
              
            ):
            <DialogContent>
                <Stack spacing={2}>
                { resource.attached ? (
                    <>
                    <Typography variant="subtitle1" textAlign={'left'}>Current clients</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Name
                                    </TableCell>
                                    <TableCell>
                                        Party size
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                resource.attached ? resource.attached.map((id) => {
                                    const client = findClient(id);
                                    return (
                                        <TableRow>
                                            <TableCell >{client.fullname}</TableCell>
                                            <TableCell>{ client.partySize } </TableCell>
                                            <TableCell>
                                               
                                            </TableCell>
                                        </TableRow>
                                    )
                                }):
                                null 
                                    
                                }
                            </TableBody>
                        </Table>
                        
                    </TableContainer>   
                    <Divider />
                    <Typography variant="subtitle1" textAlign={'left'}>Current clients</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Name
                                    </TableCell>
                                    <TableCell>
                                        Party size
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                resource.attached ? resource.attached.map((id) => {
                                    const client = findClient(id);
                                    return (
                                        <TableRow>
                                            <TableCell>{client.fullname}</TableCell>
                                            <TableCell>{ client.partySize } </TableCell>
                                            <TableCell>

                                            </TableCell>
                                        </TableRow>
                                    )
                                }):
                                null 
                                    
                                }
                            </TableBody>
                        </Table>
                        
                    </TableContainer>   
                    <Divider />
                    </>
                )

                :null}
                    

                    <Divider />
                    

                    
                    <Grid container>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" fontWeight={'bold'}>Active</Typography>
                                <Typography variant="body2">Allow your staff to use</Typography>
                                <FormControlLabel
                                    sx={{ marginLeft: 0}}
                                    control={<Switch color="opposite" inputProps={{ 'aria-label': 'controlled' }} checked={form.active} onChange={e => setForm((item) => ({...item, active: e.target.checked}) ) } />}
                                    label={ form && form.active ? 'On' : 'Off'}
                                /> 
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" fontWeight={'bold'}>Public</Typography>
                                <Typography variant="body2">Allow the public to view</Typography>
                                <FormControlLabel
                                    sx={{ marginLeft: 0}}
                                    control={<Switch color="opposite" inputProps={{ 'aria-label': 'controlled' }} checked={form.publicValue} onChange={e => setForm((item) => ({...item, publicValue: e.target.checked}) ) } />}
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
            }


                <DialogActions>
                    <Button disabled={(permissionLevel === 2|| permissionLevel === 3) ? true: false} sx={{ borderRadius: 10}} variant="contained" onClick={() => handleUpdateResource()} > Save</Button>
                </DialogActions> 
        </Dialog>

        <AddResource />

        </>
    )
}