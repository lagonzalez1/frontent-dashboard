import React, { useState, useEffect } from "react";
import { useInView } from 'react-intersection-observer';
import { Container, Grid, Typography, Stack, Box, Button, CardContent, Fade,
    useMediaQuery, useTheme , Slide, Zoom, Grow, CardMedia, ThemeProvider } from "@mui/material";
import Footer from "../Footer/Footer.js";
import Navbar from '../Navbar/Navbar'

import DASH_IMG from "../../assets/images/dash_image.png";
import IPHONE from "../../assets/images/iphone_appointment.png"; 
import WAITLIST from "../../assets/images/iphone_waitlist.png";
import pickup from "../../assets/images/pickup.png"
import queue from "../../assets/images/queue.png"
import analytics from "../../assets/images/analytics.png";

import { styled } from '@mui/system';
import { Card } from '@mui/material';
import "../../css/homepage.css";
import { HomePageTheme } from "../../theme/theme.js";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, ChartLine, Storefront , Car  } from "phosphor-react"; 


export default function Homepage() {

    const [mode, setMode] = useState(0);
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));
    const navigate = useNavigate();

    const [sectionRef, inView] = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    const [selectionRef1, inView1] = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });
    
    return (
        <ThemeProvider theme={HomePageTheme}>
            <Navbar/>
            <Container sx={{ pt: isXs ? 10 : 0}}>
                <Grid container sx={{height: '80vh'}}>
                <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} item xs={12} sm={12} md={6} lg={6}>
                        <Slide in={true} direction="right" mountOnEnter>
                        <Stack>
                            <Typography gutterBottom textAlign='left' variant="h2">Lightweight waitlist</Typography>
                            <Typography textAlign='left' variant="subtitle1" fontWeight='normal'>Your clients are busy, have them wait in a virtual line.</Typography>
                            <Typography textAlign='left' variant="subtitle1" fontWeight={'normal'}>Boost your sales with customer flow.</Typography>
                            <Typography textAlign='left' variant="subtitle1" fontWeight={'normal'}>Advertise, analyze your business trends.</Typography>

                            <Box sx={{ pt: 2, pb: 2}}>
                                <Button onClick={() => navigate('/Register')} variant="contained">
                                  <Typography sx={{ pt: 1, pl: 1, pr: 1, pb: 1}} variant="subtitle1" fontWeight={'bold'}>
                                    Get started
                                  </Typography>
                                </Button>
                            </Box>
                            <Typography textAlign='left' variant="caption">No credit card required*</Typography>
                        </Stack>
                        </Slide>

                    </Grid>
                    <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} item xs={12} sm={12} md={6} lg={6}>
                        <Box>
                            <Slide in={true} direction="up" mountOnEnter>
                                <img src={DASH_IMG} height={300} width={450} />
                            </Slide>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <section className="section_benefits" >
            <Container>
              <Typography textAlign='center' color={HomePageTheme.palette.primary.contrastText} fontWeight={'bold'} variant="h3">
                Get rid of lines
              </Typography>
              <Typography textAlign='center' color={HomePageTheme.palette.primary.contrastText} fontWeight={'bold'} variant="h3">
                Makes customers happy
              </Typography>
            </Container>

            <Container sx={{ pt: 5 }} ref={sectionRef}>
              <Grow in={inView}>
              <Grid container columnSpacing={2}>
                <Grid
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'  }}
                  item xs={12} md={6} lg={6}
                >
                  <Box sx={{ backgroundColor: 'blue' }}>
                    <img src={IPHONE} height={275} width={175} />
                  </Box>
                </Grid>
                <Grid
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'  }}
                  item xs={12} md={6} lg={6}
                >
                  <Stack>
                    <Typography gutterBottom textAlign='left' variant="h5" fontWeight={'bold'} color={HomePageTheme.palette.primary.contrastText}>Provide flexibility</Typography>
                    <Typography textAlign='left' variant="body2" color={HomePageTheme.palette.primary.contrastText}>Once they've signed up, your customers can wait anywhere while doing anything they like, so waiting doesn't really feel like waiting at all.</Typography>
                    <Box sx={{ pt: 2, pb: 2 }}>
                      <Button variant="contained" color="warning">
                        <Typography fontWeight={'normal'} variant='inherit' color={HomePageTheme.palette.primary.contrastText}>
                          Read more
                        </Typography>
                      </Button>
                    </Box>
                  </Stack>
                </Grid>


                <Grid
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'  }}
                  item xs={12} md={6} lg={6}
                >
                  <Stack>
                    <Typography gutterBottom textAlign='left' variant="h5" fontWeight={'bold'} color={HomePageTheme.palette.primary.contrastText}>Let guests join from anywhere</Typography>
                    <Typography textAlign='left' variant="body2" color={HomePageTheme.palette.primary.contrastText}>Have your guests join the waitlist online, from a kiosk, or through a website. They'll be able to sign up in a real-time line.</Typography>
                    <Box sx={{ pt: 2, pb: 2 }}>
                      <Button variant="contained" color='warning'>
                      <Typography fontWeight={'normal'} variant='inherit' color={HomePageTheme.palette.primary.contrastText}>
                          Read more
                        </Typography>
                      </Button>
                    </Box>
                  </Stack>
                </Grid>

                <Grid
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'  }}
                  item xs={12} md={6} lg={6}
                >
                  <Box sx={{ backgroundColor: 'blue' }}>
                    <img src={WAITLIST} height={275} width={175} />
                  </Box>
                </Grid>
              </Grid>
              </Grow>
            </Container>
            </section>

            
            <section className="section_uses" ref={selectionRef1}> 
                <Container sx={{pt: 1}}>
                    <Typography gutterBottom textAlign='center' fontWeight='bold' variant="h3">
                        Just a few ways you can use our service
                    </Typography>
                    <Typography textAlign='center' variant="subtitle1">
                        Give your guests even more reason to smile by letting them line up virtually using their smart device.                    
                    </Typography>
                </Container>


                <Container sx={{ pt: 4}}>
                    <Grow in={inView1}>
                    
                    
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={2}>
                        <Grid item xs={12} md={4} sm={4}>
                        <Card elevation={0} sx={{ minWidth: 275, p: 2 }}>
                          <CardContent>
                            <Users size={36}/>
                            <Typography gutterBottom fontWeight={'bold'} variant="h6">
                              Queue managment
                            </Typography>

                            <Typography gutterBottom fontWeight={'bold'} variant="body2">
                              Give your guest even more of a reason to smile by letting them line up virtually using their smart device.
                            </Typography>
                          </CardContent>
                        </Card>
                        </Grid>
                        <Grid item xs={12} md={4} sm={4}>
                        <Card elevation={0} sx={{ minWidth: 275, p: 2 }}>
                          <CardContent>
                            <Calendar  size={36}/>
                            <Typography gutterBottom fontWeight={'bold'} variant="h6">
                              Appointment scheduling
                            </Typography>

                            <Typography gutterBottom fontWeight={'bold'} variant="body2">
                              Make it easy for your guest to pick their service and schedule appointments in advance.
                            </Typography>
                          </CardContent>
                        </Card>
                        </Grid>
                        <Grid item xs={12} md={4} sm={4}>
                        <Card elevation={0} sx={{ minWidth: 275, p: 2 }}>
                          <CardContent>
                            <ChartLine  size={36}/>
                            <Typography gutterBottom fontWeight={'bold'} variant="h6">
                              Operation analysis
                            </Typography>

                            <Typography gutterBottom fontWeight={'bold'} variant="body2">
                              Gather real time data, and view trend lines to optimize certain business metrics.
                            </Typography>
                          </CardContent>
                        </Card>
                        </Grid>

                        <Grid item xs={12} md={4} sm={4}>
                        <Card elevation={0} sx={{ minWidth: 275, p: 2 }}>
                          <CardContent>
                            <Storefront size={36}/>
                            <Typography gutterBottom fontWeight={'bold'} variant="h6">
                              Event registration
                            </Typography>

                            <Typography gutterBottom fontWeight={'bold'} variant="body2">
                              Make event registration easy by allowing guest to check in via their smart phone.
                            </Typography>
                          </CardContent>
                        </Card>
                        </Grid>

                        <Grid item xs={12} md={4} sm={4}>
                        <Card elevation={0} sx={{ minWidth: 275, p: 2 }}>
                          <CardContent>
                            <Car size={36}/>
                            <Typography gutterBottom fontWeight={'bold'} variant="h6">
                              Curbside pickup
                            </Typography>

                            <Typography gutterBottom fontWeight={'bold'} variant="body2">
                              Put your guest first by allowing them a convenient way to pick up their purchases.  
                            </Typography>
                          </CardContent>
                        </Card>
                        </Grid>
                    
                    </Grid>
                    
                    </Grow>
                </Container>

            </section>
            <Footer />
        </ThemeProvider>
    )
}