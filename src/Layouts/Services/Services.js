import React, { useState } from "react";
import { Grid, Typography, Stack,CardContent,Avatar, Container, CardActionArea, TextField
    , Modal, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import AddService from "../../components/AddService/AddService.js";
import CloseIcon from "@mui/icons-material/Close"
import {  StyledCardService, stringAvatar, getServicesTotal } from "./ServicesHelper.js"; 
import { getServicesAvailable } from "../../hooks/hooks.js";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function Services() {

    const {active, unactive} = getServicesTotal();
    const [service, setService] = useState();
    const [open, setOpen] = useState(false);
    const serviceList = getServicesAvailable(); 
    
    const styles = {
        container: {
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
        },
      };


    const handleClick = (service) => {
        setOpen(true);
        setService(service);
        // Here i want to add employee or set the mode.
        // Put request.
    }
    const handleClose = () =>{
        setOpen(false);
        setService(null);

    }

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

        
        <Grid container style={styles.container} sx={{ pt: 2}} spacing={{ xs: 3, md: 3, sm: 3, lg: 2 }} columns={{ xs: 6, sm: 4, md: 4, lg: 4 }}>
            { serviceList ? serviceList.map((service) => (
                <Grid item key={service._id}>
                    <StyledCardService onClick={() => handleClick(service)}>
                        <CardActionArea>
                        <CardContent>
                            <Stack direction="row" spacing={2}>
                                <Avatar {...stringAvatar(service.title)} />
                            <Container>    
                            <Typography variant="subtitle1" component="p" style={{ fontWeight: 'bold' }}>
                            {service.active ? (<FiberManualRecordIcon fontSize="xs" htmlColor="#00FF00"/>):
                             (<FiberManualRecordIcon fontSize="xs" htmlColor="#FF0000"/>)}
                                { ' ' + service.title}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <Typography color="#9C9B9B" fontWeight="bold" variant="caption" component="p">
                                    Duration: {service.duration}
                                </Typography>
                                <Typography color="#9C9B9B" fontWeight="bold" variant="caption" component="p">
                                    Cost: {service.cost}
                                </Typography>
                                <Typography color="#9C9B9B" fontWeight="bold" variant="caption" component="p">
                                    Public: {service.public ? 'True': 'False'}
                                </Typography>
                            </Stack>
                            </Container>
                            </Stack>    
                        </CardContent>  
                        </CardActionArea>  
                    </StyledCardService>
                
                </Grid>
            )): null}
        </Grid>

      
        <AddService/>
        </>
    )
}