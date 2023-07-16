import React, { useState, useEffect } from "react";
import Navbar from '../Navbar/Navbar'
import { useInView } from 'react-intersection-observer';
import { Container, Grid, Typography, Stack, Box, Button, CardContent, Fade,
    useMediaQuery, useTheme , Slide, Zoom, Grow, CardMedia } from "@mui/material";
import Footer from "../Footer/Footer.js";
import DASH_IMG from "../../assets/images/dash_image.png";
import IPHONE from "../../assets/images/iphone_appointment.png"; 
import WAITLIST from "../../assets/images/iphone_waitlist.png";
import pickup from "../../assets/images/pickup.png"
import queue from "../../assets/images/queue.png"
import analytics from "../../assets/images/analytics.png";

import { styled } from '@mui/system';
import { Card } from '@mui/material';
import "../../css/homepage.css";


export default function Homepage() {

    const [mode, setMode] = useState(0);
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));

    const [sectionRef, inView] = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    const [selectionRef1, inView1] = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    /**
     * Card style for Register page.
     * Allows hover and change color.
     */
    const StyledCard = styled(Card)(({ theme }) => ({
        // Default styles for the card
        transition: '0.2s',
        boxShadow: theme.shadows[1],
        borderRadius: 20,
        '&:hover': {
        // Styles to apply when the card is hovered over
        transform: 'translateY(-15px)',
        boxShadow: theme.shadows[5],
        backgroundColor: theme.palette.opposite.main,
        
        },
    }));


    
    return (
        <>
            <Navbar/>

            <Container sx={{ pt: isXs ? 10 : 0}}>
                <Grid container sx={{height: '80vh'}}>
                <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} item xs={12} sm={12} md={6} lg={6}>
                        <Slide in={true} direction="right" mountOnEnter>
                        <Stack>
                            <Typography textAlign='left'  variant="h3">Lightweight waitlist</Typography>
                            <Typography textAlign='left'  variant="h6">Your clients are busy, have them wait in a virtual line.</Typography>
                            <Typography textAlign='left'  variant="h6">Boost your sales with customer flow.</Typography>
                            <Typography textAlign='left'  variant="h6">Advertise, analyze your business trends.</Typography>

                            <Box sx={{ pt: 2, pb: 2}}>
                                <Button variant="contained" sx={{ borderRadius: 10}}>Try for free</Button>
                            </Box>
                            <Typography textAlign='left' variant="caption">No credit card required.</Typography>
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

            <section className="section_benifits" >
      <Container>
        <Typography textAlign='center' fontWeight='bold' variant="h4">
          Get rid of lines
        </Typography>
        <Typography textAlign='center' fontWeight='bold' variant="h4">
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
              <Typography textAlign='left' variant="h5" fontWeight={'bold'}>Provide flexibility</Typography>
              <Typography textAlign='left' variant="subtitle1">Once they've signed up, your customers can wait anywhere while doing anything they like, so waiting doesn't really feel like waiting at all.</Typography>
              <Box sx={{ pt: 2, pb: 2 }}>
                <Button variant="contained" sx={{ borderRadius: 10 }}>Read more</Button>
              </Box>
            </Stack>
          </Grid>


          <Grid
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'  }}
            item xs={12} md={6} lg={6}
          >
            <Stack>
              <Typography textAlign='left' variant="h5" fontWeight={'bold'}>Let guests join from anywhere</Typography>
              <Typography textAlign='left' variant="subtitle1">Have your guests join the waitlist online, from a kiosk, or through a website. They'll be able to sign up in a real-time line.</Typography>
              <Box sx={{ pt: 2, pb: 2 }}>
                <Button variant="contained" sx={{ borderRadius: 10 }}>Read more</Button>
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
                <Container>
                    <Typography textAlign='center' fontWeight='bold' variant="h4">
                        Just a few ways you can use our service.
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
                        <StyledCard id="service_cards" sx={{ backgroundColor: mode === 0 ? '#ffc34d': '',boxShadow: mode === 1 ? 3: 0, p: 2 }}  onClick={() => console.log('clicked') } >
                                <CardMedia
                                    sx={{ height: 225 ,width: 225 }}
                                    image={pickup}
                                />
                                <CardContent>
                                    <Typography sx={{ textAlign: 'left'}} variant="h5" color="dark"><strong>Curbsite pickup</strong></Typography>
                                    <Typography sx={{ textAlign: 'left', pt: 2}} variant="subtitle2" color="dark">Put your customers first by giving them an additional, more convenient way to pick up their purchases.</Typography>
                                </CardContent>
                                
                        </StyledCard>
                        </Grid>
                        <Grid item xs={12} md={4} sm={4}>
                        <StyledCard id="service_cards" sx={{ backgroundColor: mode === 0 ? '#ffc34d': '',boxShadow: mode === 1 ? 3: 0, p: 2 }}  onClick={() => console.log('clicked') } >
                                <CardMedia
                                    sx={{ height: 225 ,width: 225 }}
                                    image={queue}
                                />
                                <CardContent>
                                    <Typography sx={{ textAlign: 'left'}} variant="h5" color="dark"><strong>Queue managment</strong></Typography>
                                    <Typography sx={{ textAlign: 'left', pt: 2}} variant="subtitle2" color="dark">Give your guests even more reason to smile by letting them line up virtually using their smart device.</Typography>
                                </CardContent>
                                
                        </StyledCard>
                        </Grid>
                        <Grid item xs={12} md={4} sm={4}>
                        <StyledCard id="service_cards" sx={{ backgroundColor: mode === 0 ? '#ffc34d': '',boxShadow: mode === 1 ? 3: 0, p: 2 }}  onClick={() => console.log('clicked') } >
                                <CardMedia
                                    sx={{ height: 225 ,width: 225 }}
                                    image={analytics}
                                />
                                <CardContent>
                                    <Typography sx={{ textAlign: 'left'}} variant="h5" color="dark"><strong>Operational analysis</strong></Typography>
                                    <Typography sx={{ textAlign: 'left', pt: 2}} variant="subtitle2" color="dark">Collect real-time data to see how your buisness is running and spot improvments.</Typography>
                                </CardContent>
                                
                        </StyledCard>
                        </Grid>
                    </Grid>
                    </Grow>
                </Container>

            </section>

            <Footer />
        </>
    )
}