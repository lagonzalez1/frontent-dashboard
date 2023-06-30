import React, { useEffect, useState } from "react";
import { Box, Container,Paper, Typography, Divider, Grid, Stack, List,ListItemButton, ListItemText, ListItem } from "@mui/material";
import LocationForm from "../../components/Forms/LocationForm";
import OpeningHoursForm from "../../components/Forms/OpeningHoursForm";
import BusinessForm from "../../components/Forms/BuisnessForm";
import PaymentForm from "../../components/Forms/PaymentForm";
import { getResourceList, getServiceList } from "./SettingsHelper";
import { useSelector } from "react-redux";
import RService from "../../components/Dialog/RServices";



export default function Settings() {

    const buisness = useSelector((state) => state.buisness);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (buisness){
            setLoading(false);
        }
    }, [loading])


    const serviceSelected = (service) => {

        return (
            <>
                <RService open={true} data={service}/>
            </>
        )
    }



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
                                        Your location name {'Buisness name'} is displayed across many areas including on your online pages and messages to client
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid xs={12} md={6} sm={12} lg={6}>
                                <LocationForm />
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
                                        Your location name {'Buisness name'} is displayed across many areas including on your online pages and messages to client
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid xs={12} md={6} sm={12} lg={6}>
                                <OpeningHoursForm/>
                            </Grid>
                        </Grid>

                        <Divider sx={{backgroundColor: 'lightgray'}} />
                        <Grid container id="buisness">
                            <Grid sx={{ p: 3}} xs={12} md={6} sm={12} lg={6} >
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
                        <Divider sx={{backgroundColor: 'lightgray'}} />

                        <Grid container id="payment">
                            <Grid sx={{ p: 3}} xs={12} md={6} sm={12} lg={6} >
                                <Stack>
                                    <Typography fontWeight='bold' variant="h6">
                                        Resources and services
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        A resource can be for exmaple a 'table 1' in a restaurant establishment.
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        A service can be for example a 'mens haircut' that last 30 min. 
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid xs={12} md={6} sm={12} lg={6}>
                                    <Typography fontWeight='bold' variant="body2">
                                        Resources
                                    </Typography>
                                <List>
                                {
                                    getResourceList().map((item) => (
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemText primary={item.title} secondary={item.description} />
                                            </ListItemButton>
                                        </ListItem>
                                      ))
                                }

                                
                                </List>
                                <Typography fontWeight='bold' variant="body2">
                                        Services
                                    </Typography>
                                <List>
                                {
                                    getServiceList().map((item) => (
                                        <ListItem disablePadding>
                                            <ListItemButton onClick={() => serviceSelected(item) }>
                                                <ListItemText primary={item.title} secondary={item.description} />
                                            </ListItemButton>
                                        </ListItem>
                                      ))
                                }
                                </List>
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