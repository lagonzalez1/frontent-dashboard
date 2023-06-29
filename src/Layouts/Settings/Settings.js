import React from "react";
import { Box, Container,Paper, Typography, Divider, Grid, Stack} from "@mui/material";
import LocationForm from "../../components/Forms/LocationForm";
import OpeningHoursForm from "../../components/Forms/OpeningHoursForm";
import BusinessForm from "../../components/Forms/BuisnessForm";
import PaymentForm from "../../components/Forms/PaymentForm";



export default function Settings() {


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
                            <Grid sx={{ p: 2}} xs={12} md={6} sm={12} lg={6}>
                                <Stack>
                                    <Typography fontWeight='bold'  variant="h6">
                                        Location
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Your location name {'Buisness name'} is displayed across many areas including on your online pages and messages to client
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid xs={12} md={6} sm={12} lg={6}>
                                <LocationForm />
                            </Grid>
                        </Grid>
                        <Divider/>
                        <Grid container id="hours">
                            <Grid sx={{ p: 2}} xs={12} md={6} sm={12} lg={6} >
                                <Stack>
                                    <Typography fontWeight='bold' variant="h6">
                                        Hours
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Your location name {'Buisness name'} is displayed across many areas including on your online pages and messages to client
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid xs={12} md={6} sm={12} lg={6}>
                                <OpeningHoursForm/>
                            </Grid>
                        </Grid>

                        <Divider/>
                        <Grid container id="buisness">
                            <Grid sx={{ p: 2}} xs={12} md={6} sm={12} lg={6} >
                                <Stack>
                                    <Typography fontWeight='bold' variant="h6">
                                        Buisness info
                                    </Typography>
                                    <Typography variant="subtitle2">
                                    Your business info is displayed on your online pages and messages to client
                                </Typography>
                                </Stack>
                            </Grid>
                            <Grid xs={12} md={6} sm={12} lg={6}>
                                <BusinessForm/>
                            </Grid>
                        </Grid>


                        <Grid container id="payment">
                            <Grid sx={{ p: 2}} xs={12} md={6} sm={12} lg={6} >
                                <Stack>
                                    <Typography fontWeight='bold' variant="h6">
                                        Payment info
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Thank you for the continuous support by paying for this service.

                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid xs={12} md={6} sm={12} lg={6}>
                                Free
                            </Grid>
                        </Grid>



                    </Stack>

                </Paper>
            </Box>
        </>
    )
}