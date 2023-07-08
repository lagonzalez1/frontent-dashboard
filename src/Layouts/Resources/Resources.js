import React, { useState } from "react";
import { Grid, Typography, Stack,CardContent,Avatar, Container, Dialog, DialogActions, DialogTitle, DialogContent, Switch, Button,
Select, MenuItem, FormControlLabel, CardActionArea, IconButton, FormLabel, Paper, TableContainer, TableHead, TableCell, TableBody, TableRow, Table, FormControl, InputLabel } from '@mui/material';
import { getResourcesAvailable, StyledCardService, stringAvatar,
    StyledTableCell, findResourceTag, findServingSize, update } from "./ResourcesHelper"; 
import { getEmployeeList, findClient, getResourceData } from "../../hooks/hooks";
import AddResource from "../../components/AddResource/AddResource.js";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useSelector } from "react-redux";
import buisness from "../../reducers/buisness";

export default function Resources() {
    const resourceList = getResourcesAvailable();
    const employeeList = useSelector((state) => state.buisness.employees);
    const resourceData = useSelector((state) => state.buisness.resources);

    const [dialog, setDialog] = useState(false);
    const [resource, setResource] = useState({});
    
    const [form, setForm] = useState({
        resourceId: null,
        employeeId: null,
        toggle: null
    })

    const styles = {
        container: {
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
        },
      };

    const handleResourceClick = (object) => {
        setDialog(true);
        setResource(object);
        setForm((prev) => ({...prev, resourceId: object._id, toggle: object.active }))
    }
    const handleCloseDialog = () => {
        setDialog(false)
        setResource({});
        setForm({
            resourceId: null,
            employeeId: null,
            toggle: null});
    }

    const saveResourceAt = async () => {
        if (!form){ return; }
        update(form);
      };

    

    return(
        <>
        <Grid container
            spacing={2}    
        >
            <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                <Stack direction={'row'} sx={{alignItems: 'center'}} spacing={2}>
                    <Typography variant="h6"><strong> Available resources</strong></Typography>
                    <Typography variant="caption"> <FiberManualRecordIcon fontSize="xs" htmlColor="#00FF00"/> 4 Active</Typography>
                    <Typography variant="caption"> <FiberManualRecordIcon fontSize="xs" htmlColor="#FF0000"/> 0 Unavailable</Typography>
                </Stack>
                
            </Grid>
            <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'right'}}>
            
            </Grid>
        </Grid>

        
        <Grid container style={styles.container} sx={{ pt: 2}} spacing={1} columns={{ xs: 1, sm: 2, md: 2, lg: 2 }}>
            { resourceData? resourceData.map((resource) => (
                <Grid item key={resource._id}>
                    <StyledCardService onClick={() => handleResourceClick(resource)}>
                        <CardActionArea>
                        <CardContent>
                            <Stack direction="row" spacing={2} sx={{ alignItems: 'center'}}>
                            <Avatar {...stringAvatar(resource.title)} />
                            <Container>    
                            <Typography variant="subtitle1" component="p" style={{ fontWeight: 'bold' }}>
                            {resource.active ? (<FiberManualRecordIcon fontSize="xs" htmlColor="#00FF00"/>):
                             (<FiberManualRecordIcon fontSize="xs" htmlColor="#FF0000"/>)}
                                { ' ' + resource.title}
                            </Typography>
                            <Typography color="#9C9B9B" fontWeight="bold" variant="caption" component="p">
                                    Assigned: {findResourceTag(resource._id).fullname}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                
                            <Typography color="#9C9B9B" fontWeight="bold" variant="caption" component="p">
                                    Waitlist: {resource.waitlist ? 1 : 0}
                                </Typography>
                                <Typography color="#9C9B9B" fontWeight="bold" variant="caption" component="p">
                                    Serving: {findServingSize(resource._id) }
                                </Typography>
                                
                                
                            </Stack>
                                <Typography color="#9C9B9B" fontWeight="bold" variant="caption" component="p">
                                    Max: {resource.serveSize}
                                </Typography>
                            </Container>
                            </Stack>    
                        </CardContent>   
                        </CardActionArea> 
                    </StyledCardService>
                
                </Grid>
            )): null}
        </Grid>


        <Dialog maxWidth={'sm'} fullWidth={'sm'}  open={dialog} onClose={handleCloseDialog}>
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
            { resource ? resource.title: null }</DialogTitle>
            <DialogContent>
          
            <Grid direction="row"
                justifyContent="space-between"
                alignItems="center" 
                container  
                rowSpacing={2}>



                <Grid item >
                <Stack spacing={1}>

                <FormControlLabel
                        control={<Switch color="opposite" inputProps={{ 'aria-label': 'controlled' }} checked={form.toggle} onChange={e => setForm((item) => ({...item, toggle: e.target.checked}) ) } />}
                        label={ form && form.toggle ? 'Active' : 'Unavailable'}
                    />  
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
                                        </TableRow>
                                    )
                                }):
                                null 
                                    
                                }
                            </TableBody>
                        </Table>
                        
                    </TableContainer>   
                    </Stack>
                </Grid>

                <Grid item>
                    <Stack spacing={1}>
                    <Typography variant="subtitle1" textAlign={'left'}>Assigned: {findResourceTag(resource._id).fullname} </Typography>
                    <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="select-employee-tag">Employee</InputLabel>

                    <Select labelId="select-employee-tag" value={form.employeeId} onChange={(e) => setForm((prev) => ({...prev, employeeId: e.target.value}))}>
                        <MenuItem value="">None</MenuItem>
                        {employeeList.map((employee, index) => (
                        <MenuItem key={index} value={employee._id}>
                            {employee.fullname}
                        </MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                    </Stack>
                    
                </Grid>

            </Grid>


          
            </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => saveResourceAt()} > Save</Button>
                </DialogActions> 
        </Dialog>

        <AddResource />

        </>
    )
}