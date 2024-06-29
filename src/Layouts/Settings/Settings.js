import React, { useEffect, useState, lazy } from "react";
import { Box, Container,Paper, Typography, Divider, Grid, Stack } from "@mui/material";
import LocationForm from "../../components/Forms/LocationForm";
import OpeningHoursForm from "../../components/Forms/OpeningHoursForm";
import BusinessForm from "../../components/Forms/BusinessForm";
import PaymentForm from "../../components/Forms/PaymentForm";
import { useDispatch, useSelector } from "react-redux";
import ClientSignForm from "../../components/Forms/ClientSignForm";
import ClientForm from "../../components/Forms/ClientForm";
import SystemForm from "../../components/Forms/SystemForm";
import ResourceServiceForm from "../../components/Forms/ResourceServiceForm";
import AddEmployeeForm from "../../components/Forms/AddEmployeeForm";
import EmployeeTable from "../../components/Employee/EmployeeTable";
import Personalization from "../../components/Forms/Personalization";
import NotificationForm from "../../components/Forms/NotificationForm";
import { reloadBusinessData } from '../../hooks/hooks';
import { authFields, authTokens } from "../../selectors/authSelectors";




export default function Settings() {

    const business = useSelector((state) => state.business);
    const { authEmail, authId } = useSelector((state) => authFields(state));
    const dispatch = useDispatch();



    const [reload, setLoading] = useState(false);

    const reloadPage = () => {
        setLoading(true);
    }

    useEffect(() => {
        reloadBusinessData(authEmail, business._id);
        return () => {
            setLoading(false);
        }
    }, [reload])

    return(
        <>
            <Box>
                <Paper sx={{ p: 2}}>
                    <Box>
                        <Typography variant="h4" textAlign={'left'}>General settings</Typography>
                        <Divider />
                    </Box>

                    <Stack sx={{ pt: 5}} direction={'column'} spacing={5}>
                        <Grid container id="location">
                            <Grid sx={{ p: 3}} xs={12} md={6} sm={12} lg={6}>
                                <Stack>
                                    <Typography fontWeight='bold' variant="h6">
                                        Location
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Your location name <strong>{business && business.publicLink }</strong> is displayed across many areas including on your online pages and messages to clients
                                    </Typography>
                                    <Typography fontWeight='bold' variant="subtitle1">
                                        waitonline.us/welcome/{business && business.publicLink}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <LocationForm reloadPage={reloadPage} />
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
                                <Personalization reloadPage={reloadPage} />
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
                                        Opening hours - 
                                        Your business timezone is crutial information to allow clients within the correct region to join your waitlist.
                                        Your business hours are crutial for your waitlist to work properly. Please take the time to fill this out correctly.
                                    </Typography>

                                    <Typography variant="subtitle2">
                                        Closed on days - You can elect to be closed on future dates or only certain employees to be off.
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <OpeningHoursForm reloadPage={reloadPage}/>
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
                                        Waitlist and appointment system settings, choose how your will manage your clients.
                                </Typography>
                                <Typography variant="subtitle2">
                                    Also enable restrictions for waitlist.
                                </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <SystemForm reloadPage={reloadPage} />
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
                                        Control what your client sees in their notifications and emails. 
                                    </Typography>
                                    <Typography variant="subtitle2">

                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <NotificationForm reloadPage={reloadPage} />
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
                                    Your business info is displayed on your online pages, email notifications, and more.
                                </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <BusinessForm reloadPage={reloadPage}/>
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
                                    <Typography variant="subtitle2">
                                        Breaks - Assign various time block off periods for employees.
                                    </Typography>
                                    
                                    
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <EmployeeTable reloadPage={reloadPage}/>
                            </Grid>
                        </Grid>


                        <Divider sx={{backgroundColor: 'lightgray'}} />
                        <Grid container id="presentation">
                            <Grid sx={{ p: 3}} xs={12} md={6} sm={12} lg={6} >
                                <Stack>
                                    <Typography fontWeight='bold' variant="h6">
                                        Client welcome page
                                    </Typography>
                                    <Typography variant="subtitle2">
                                    Allows you to control what your client can see when joining your <strong>waitlist</strong>
                                </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <ClientSignForm reloadPage={reloadPage}/>
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
                                        Allows you to control what information you want from your client.
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <ClientForm reloadPage={reloadPage}/>
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
                                <ResourceServiceForm reloadPage={reloadPage}/>
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
                                    <Typography variant="substitle2">
                                        For any issues, questions regarding your account please feel free to email us at: <strong>support@waitonline.us</strong>
                                    </Typography>
                                    <Typography variant="substitle2">Please provide your business name and email associated with your account.</Typography>
                                </Stack>
                            </Grid>
                            <Grid sx={{p:3}} xs={12} md={6} sm={12} lg={6}>
                                <PaymentForm />
                            </Grid>
                        </Grid>



                    </Stack>

                </Paper>
            </Box>
        </>
    )
}