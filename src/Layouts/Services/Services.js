import React, { useState } from "react";
import { Grid, Typography, Stack,CardContent,Avatar, Container, CardActionArea, TextField
    , Modal, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import AddService from "../../components/AddService/AddService.js";
import CloseIcon from "@mui/icons-material/Close"
import {  StyledCardService, stringAvatar } from "./ServicesHelper.js"; 
import { getServicesAvailable } from "../../hooks/hooks.js";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function Services() {
    const serviceList = getServicesAvailable();
    const [service, setService] = useState();
    const [open, setOpen] = useState(false);

    
    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        duration: Yup.string().required('Duration is required'),
        cost: Yup.number().required('Cost is required'),
    });
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
    }
    const handleClose = () =>{
        setOpen(false);
        setService(null);

    }
    const handleSubmit = (values) => {
        console.log(values); // Handle form submission logic here
        setOpen(false);
      };

    return(
        <>
        <Grid 
            container
            spacing={2}    
        >
            <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                <Stack direction={'row'} sx={{alignItems: 'center'}} spacing={2}>
                    <Typography variant="h6"><strong> Available Services</strong></Typography>
                    <Typography variant="caption"> <FiberManualRecordIcon fontSize="xs" htmlColor="#00FF00"/> 4 Active</Typography>
                    <Typography variant="caption"> <FiberManualRecordIcon fontSize="xs" htmlColor="#FF0000"/> 0 Unavailable</Typography>
                </Stack>
                
            </Grid>
            <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'right'}}>
            
            </Grid>
        </Grid>

        
        <Grid container style={styles.container} sx={{ pt: 2}} spacing={{ xs: 3, md: 3, sm: 3, lg: 2 }} columns={{ xs: 6, sm: 4, md: 4, lg: 4 }}>
            { service ? serviceList.map((service) => (
                <Grid item key={service.id}>
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
                                    Desc: {service.description ? 1 : 0}
                                </Typography>
                                <Typography color="#9C9B9B" fontWeight="bold" variant="caption" component="p">
                                    Duration: {service.duration}
                                </Typography>
                                <Typography color="#9C9B9B" fontWeight="bold" variant="caption" component="p">
                                    Cost: {service.cost}
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

        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{service ? service.title : ''}
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
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              title: service ? service.title: '',
              description: service ? service.description : '',
              duration: service ? service.duration: 0,
              cost: service ? service.cost : 0,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <Field
                  as={TextField}
                  name="title"
                  label="Title"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                />
                <Field
                  as={TextField}
                  name="description"
                  label="Description"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
                <Field
                  as={TextField}
                  name="duration"
                  label="Duration"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.duration && Boolean(errors.duration)}
                  helperText={touched.duration && errors.duration}
                />
                <Field
                  as={TextField}
                  name="cost"
                  label="Cost"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.cost && Boolean(errors.cost)}
                  helperText={touched.cost && errors.cost}
                />
                <DialogActions>
                  <Button variant="contained" type="submit">
                    Save
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

        <AddService/>
        </>
    )
}