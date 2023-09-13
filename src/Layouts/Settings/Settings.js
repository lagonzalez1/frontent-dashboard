import React, { useEffect, useState } from "react";
import { Box, Container,Paper, Typography, Divider, Grid, Stack } from "@mui/material";
import LocationForm from "../../components/Forms/LocationForm";
import OpeningHoursForm from "../../components/Forms/OpeningHoursForm";
import BusinessForm from "../../components/Forms/BusinessForm";
import PaymentForm from "../../components/Forms/PaymentForm";
import { useSelector } from "react-redux";
import ExtrasForm from "../../components/Forms/ExtrasForm";
import ClientForm from "../../components/Forms/ClientForm";
import SystemForm from "../../components/Forms/SystemForm";
import ResourceServiceForm from "../../components/Forms/ResourceServiceForm";
import AddEmployeeForm from "../../components/Forms/AddEmployeeForm";
import EmployeeTable from "../../components/Employee/EmployeeTable";
import Personalization from "../../components/Forms/Personalization";
import NotificationForm from "../../components/Forms/NotificationForm";



export default function Settings() {

    const business = useSelector((state) => state.business);


    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (business){
            setLoading(false);
        }
    }, [loading])


    



    return(
        <>
            <Box>
                <Paper sx={{ p: 2}}>
                    <Container>
                        <Typography variant="h4">General settings</Typography>
                        <Divider light={false} />
                    </Container>

                    <Stack sx={{ pt: 5}} direction={'column'} spacing={5}>
                        <Grid container id="location">
                            <Grid sx={{ p: 3}} xs={12} md={6} sm={12} lg={6}>
                                <Stack>
                                    <Typography fontWeight='bold'  variant="h6">
                                        Location
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Your location name <strong>{business && business.publicLink }</strong> is displayed across many areas including on your online pages and messages to client
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <LocationForm />
                            </Grid>
                        </Grid>
                        <Divider sx={{backgroundColor: 'lightgray'}} />
                        <Grid container id="Personalize">
                            <Grid sx={{ p: 3}} xs={12} md={6} sm={12} lg={6}>
                                <Stack>
                                    <Typography fontWeight='bold'  variant="h6">
                                        Personalize
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Generate a QR code to show to your clients. 
                                        Elect to have a icon on your welcome page.

                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <Personalization />
                            </Grid>
                        </Grid>
                        <Divider sx={{backgroundColor: 'lightgray'}} />
                        <Grid container id="hours">
                            <Grid sx={{ p: 3}} xs={12} md={6} sm={12} lg={6} >
                                <Stack>
                                    <Typography fontWeight='bold' variant="h6">
                                        Hours
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Your business timezone is crutial information to allow clients within the correct region to join your waitlist.
                                        Your business hours are crutial for your waitlist to work properly. Please take the time to fill this out correctly.
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <OpeningHoursForm/>
                            </Grid>
                        </Grid>

                        <Divider sx={{backgroundColor: 'lightgray'}} />
                        <Grid container id="presentation">
                            <Grid sx={{ p: 3}} xs={12} md={6} sm={12} lg={6} >
                                <Stack>
                                    <Typography fontWeight='bold' variant="h6">
                                        System
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Appointment system settings, choose how your will manage your waitlist.
                                </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <SystemForm/>
                            </Grid>
                        </Grid>

                        <Divider sx={{backgroundColor: 'lightgray'}} />

                        <Grid container id="notifications">
                            <Grid sx={{ p: 3}} xs={12} md={6} sm={12} lg={6} >
                                <Stack>
                                    <Typography fontWeight='bold' variant="h6">
                                        Notification settings
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Control what your client sees in their notification and when they receive it. 
                                    </Typography>
                                    <Typography variant="subtitle2">

                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <NotificationForm />
                            </Grid>
                        </Grid>

                        <Divider sx={{backgroundColor: 'lightgray'}} />
                        <Grid container id="business">
                            <Grid sx={{ p: 3}} xs={12} md={6} sm={12} lg={6} >
                                <Stack>
                                    <Typography fontWeight='bold' variant="h6">
                                        Business info
                                    </Typography>
                                    <Typography variant="subtitle2">
                                    Your business info is displayed on your online pages and messages to client
                                </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <BusinessForm/>
                            </Grid>
                        </Grid>

                        <Divider sx={{backgroundColor: 'lightgray'}} />

                        <Grid container id="payment">
                            <Grid sx={{ p: 3}} xs={12} md={6} sm={12} lg={6} >
                                <Stack>
                                    <Typography fontWeight='bold' variant="h6">
                                        Add employees
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Employees will be able to login in and make changes depending on the permission level set.
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Only root user will be able to add new employees.
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <EmployeeTable/>
                            </Grid>
                        </Grid>


                        <Divider sx={{backgroundColor: 'lightgray'}} />
                        <Grid container id="presentation">
                            <Grid sx={{ p: 3}} xs={12} md={6} sm={12} lg={6} >
                                <Stack>
                                    <Typography fontWeight='bold' variant="h6">
                                        Client signup page
                                    </Typography>
                                    <Typography variant="subtitle2">
                                    Allows you to control what your client can see when joining your waitlist
                                </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <ExtrasForm/>
                            </Grid>
                        </Grid>

                        <Divider sx={{backgroundColor: 'lightgray'}} />
                        <Grid container id="presentation">
                            <Grid sx={{ p: 3}} xs={12} md={6} sm={12} lg={6} >
                                <Stack>
                                    <Typography fontWeight='bold' variant="h6">
                                        Client form 
                                    </Typography>
                                    <Typography variant="subtitle2">
                                    Allows you to control what information your clients give you
                                </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <ClientForm/>
                            </Grid>
                        </Grid>


                        <Divider sx={{backgroundColor: 'lightgray'}} />

                        <Grid container id="payment">
                            <Grid sx={{ p: 3}} xs={12} md={6} sm={12} lg={6} >
                                <Stack>
                                    <Typography fontWeight='bold' variant="h6">
                                        Resources and services
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Common example are, Table 1, Seat 1.
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        A service can be for example a 'mens haircut' that last 30 min. 
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <ResourceServiceForm/>
                            </Grid>
                        </Grid>
                        <Divider sx={{backgroundColor: 'lightgray'}} />

                        <Grid container id="payment">
                            <Grid sx={{ p: 3}} xs={12} md={6} sm={12} lg={6} >
                                <Stack>
                                    <Typography fontWeight='bold' variant="h6">
                                        Payment info
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Thank you for the continuous support by paying for this service.
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                Free
                            </Grid>
                        </Grid>



                    </Stack>

                </Paper>
            </Box>
        </>
    )
}