import React, { useState, useEffect } from "react";
import { ThemeProvider ,Container, Typography, Grid, Card, CardContent} from "@mui/material";
import { HomePageTheme } from "../../theme/theme";
import Footer from "../Footer/Footer.js";
import Navbar from '../Navbar/Navbar'
import "../../css/Features.css"


export default function Features() {

    const [mode, setMode] = useState(0);
   
    
    return (
        <ThemeProvider theme={HomePageTheme}>
            <Navbar />
                    <section className="features_header">
                        <Container sx={{ pt:  4}}>
                        <Typography variant="h3" textAlign={'left'} color={HomePageTheme.palette.primary.contrastText}>Features</Typography>
                        <Typography variant="h6" textAlign={'left'} color={HomePageTheme.palette.primary.contrastText}>Some of the things we do best.</Typography>
                        </Container>
                    </section>


                    <Container>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="stretch"
                        >
                        <Grid item xs={6} md={6} sm={6}>
                            <Card sx={{ p: 1}} elevation={0}>
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight={'bold'}>
                                        Real time updates
                                    </Typography>
                                    <Typography variant="body2" fontWeight={'normal'}>
                                        Allow your clients to update their locations to gather resources and prepare for your session. 
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={6} md={6} sm={6}>

                        </Grid>


                        <Grid item xs={6} md={6} sm={6}>

                        </Grid>

                        <Grid item xs={6} md={6} sm={6}>
                            <Card sx={{ p: 1}} elevation={0}>
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight={'bold'}>
                                        Easy appointments 
                                    </Typography>
                                    <Typography variant="body2" fontWeight={'normal'}>
                                        Making appointments is as easy as 2 simple steps. Pick the employee, date availability, and sign up! 
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>


                        <Grid item xs={6} md={6} sm={6}>
                            <Card sx={{ p: 1}} elevation={0}>
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight={'bold'}>
                                        Show real time waitlist length
                                    </Typography>
                                    <Typography variant="body2" fontWeight={'normal'}>
                                        Allow your clients to view the current line via their smart device or your own TV.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={6} md={6} sm={6}>

                        </Grid>


                        <Grid item xs={6} md={6} sm={6}>

                        </Grid>

                        <Grid item xs={6} md={6} sm={6}>
                            <Card sx={{ p: 1}} elevation={0}>
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight={'bold'}>
                                        Alert your clients live
                                    </Typography>
                                    <Typography variant="body2" fontWeight={'normal'}>
                                        Notify your clients via personalized messages, that show up in their online portal.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        </Grid>
                    </Container>
            <Footer />
        </ThemeProvider>
    )
}