import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, CardMedia, Container, Grid, Typography} from "@mui/material";
import Hours from "../../assets/images/hours-calendar.jpg";
import LogoHelp from "../../assets/images/logo-help.png";
import EmployeeHelp from "../../assets/images/employee-help.png";
import CombinedHelp from "../../assets/images/combined-help.jpg";


export default function Help() {



    useEffect(() => {

    }, [])

    
    return(
        <Box>
            <Typography variant="h6" fontWeight={'bold'}>Help: Getting started</Typography>
            <Typography variant="subtitle1">Check your business operation hours, personalize your welcome page, add your employees and finally assign your employees services that they offer! </Typography>
            <Grid sx={{pt: 2}} container spacing={2}>
            <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            sx={{ height: 250}}
                            image={Hours}
                            title="Title"
                        />
                        <CardContent>
                            <Typography variant="subtitle2" fontWeight={'bold'}>1. Business hours</Typography>
                            <Typography variant="subtitle2">Verify your business hours for each day of the week. This will restrict your clients from joining on hours you will be off. </Typography>
                            <Typography variant="subtitle2">Request closed dates by visiting: settings, hours, 'closed on dates' button.</Typography>

                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            sx={{ height: 250, objectFit: 'contain'}}
                            image={LogoHelp}
                            title="Title"
                        />
                        <CardContent>
                        <Typography variant="subtitle2" fontWeight={'bold'}>2. Icon image</Typography>
                        <Typography variant="subtitle2">Show off your logo to be easily distinguished from your competitors.  </Typography>
                        <Typography variant="subtitle2">Take a look at your welcome page by clicking the drop down button on your main page.  </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            sx={{ height: 250, objectFit: 'contain'}}
                            image={EmployeeHelp}
                            title="Title"
                        />
                        <CardContent>
                        <Typography variant="subtitle2" fontWeight={'bold'}>3. Add employees</Typography>
                        <Typography variant="subtitle2">Add your employees so your can utilize your appointments! Each employee can now be booked all day. </Typography>
                        <Typography variant="subtitle2">Edit your employee schedule by visiting: settings, employees, edit icon. </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            sx={{ height: 250, objectFit: 'contain'}}
                            image={CombinedHelp}
                            title="Title"
                        />
                        <CardContent>
                        <Typography variant="subtitle2" fontWeight={'bold'}>4. Services and resources</Typography>
                        <Typography variant="subtitle2">Add your services and resources to have your employees and clients select from. </Typography>
                        <Typography variant="subtitle2">Keep track of the resources you use. </Typography>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
        </Box>
    )
}