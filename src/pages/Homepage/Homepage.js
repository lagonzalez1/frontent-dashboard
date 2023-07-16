import React, { useState, useEffect } from "react";
import Navbar from '../Navbar/Navbar'
import { Container, Grid, Typography, Stack, Box, Button, CardContent } from "@mui/material";
import Footer from "../Footer/Footer.js";
import DASH_IMG from "../../assets/images/dash_image.png";
import IPHONE from "../../assets/images/iphone_appointment.png"; 
import WAITLIST from "../../assets/images/iphone_waitlist.png";
import { styled } from '@mui/system';
import { Card } from '@mui/material';
import "../../css/homepage.css";


export default function Homepage() {

    const [mode, setMode] = useState(0);

/**
 * Card style for Register page.
 * Allows hover and change color.
 */
const StyledCard = styled(Card)(({ theme }) => ({
    // Default styles for the card
    transition: '0.3s',
    boxShadow: theme.shadows[1],
    '&:hover': {
      // Styles to apply when the card is hovered over
      transform: 'translateY(-6px)',
      boxShadow: theme.shadows[5],
      backgroundColor: theme.palette.opposite.main,
      color: theme.palette.dark.main,
      
    },
  }));

    
    return (
        <>
            <Navbar/>

            <Container sx={{ pt: 0}}>
                <Grid container sx={{height: '80vh'}}>
                <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} item xs={12} md={6} lg={6}>
                        <Stack>
                            <Typography textAlign='left'  variant="h3">Lightweight waitlist</Typography>
                            <Typography textAlign='left'  variant="h6">Your clients are busy, have them wait in a virtual line.</Typography>
                            <Typography textAlign='left'  variant="h6">Boost your sales with customer flow.</Typography>
                            <Typography textAlign='left'  variant="h6">Advertise, analyze your buisness trends.</Typography>

                            <Box sx={{ pt: 2, pb: 2}}>
                                <Button variant="contained" sx={{ borderRadius: 10}}>Try for free</Button>
                            </Box>
                            <Typography textAlign='left' variant="caption">No credit card required.</Typography>
                        </Stack>

                    </Grid>
                    <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} item xs={12} md={6} lg={6}>
                        <img src={DASH_IMG} height={300} width={450} />
                    </Grid>
                </Grid>
            </Container>

            <section className="section_benifits">
            <Container>
                <Typography textAlign='center' fontWeight='bold' variant="h4">
                    Get rid of lines
                </Typography>
                <Typography textAlign='center' fontWeight='bold' variant="h4">
                    Makes customers happy
                </Typography>
            </Container>

            <Container sx={{ pt: 5}}>
                <Grid container columnSpacing={2}>
                    <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} item xs={12} md={6} lg={6}>
                        <Box sx={{ backgroundColor: 'blue'}}>
                            <img src={IPHONE} height={250} width={150} />
                        </Box>
                    </Grid>
                    <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} item xs={12} md={6} lg={6}>
                            <Stack>
                                <Typography textAlign='left' variant="h5"fontWeight={'bold'}>Provide flexibillty</Typography>
                                <Typography textAlign='left' variant="subtitle1">Once they've signed up, your  customers can wait anywhere while doing anything they lise so waiting doesnt really feel like waiting at all.</Typography>
                                <Box sx={{ pt: 2, pb: 2}}>
                                    <Button variant="contained" sx={{ borderRadius: 10}}>Read more</Button>
                                </Box>
                            </Stack>
                    </Grid>


                    <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} item xs={12} md={6} lg={6}>
                            <Stack>
                                <Typography textAlign='left' variant="h5" fontWeight={'bold'}>Let guest join from anywhere</Typography>
                                <Typography textAlign='left' variant="subtitle1">Have your guest join the waitlist online, from a kiosk or through a website. They'll be able to sign up in a real-time line.</Typography>
                                <Box sx={{ pt: 2, pb: 2}}>
                                    <Button variant="contained" sx={{ borderRadius: 10}}>Read more</Button>
                                </Box>
                            </Stack>
                    </Grid>

                    <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} item xs={12} md={6} lg={6}>
                        <Box sx={{ backgroundColor: 'blue'}}>
                            <img src={WAITLIST} height={250} width={150} />
                        </Box>
                    </Grid>
                    
                </Grid>
            </Container>
            </section>

            <section className="section_uses"> 
                <Container>
                    <Typography textAlign='center' variant="h4">
                        Just a few ways you can use our service.
                    </Typography>
                    <Typography textAlign='center' variant="subtitle1">
                        Give your guests even more reason to smile by letting them line up virtually using their smart device.                    
                    </Typography>
                </Container>


                <Container>

                    <Grid 
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={2}>
                        <Grid item xs={12} md={4} sm={4}>
                        <StyledCard sx={{ backgroundColor: mode === 0 ? '#ffc34d': '',boxShadow: mode === 1 ? 3: 0 }}  onClick={() => console.log('clicked') } id="selection_card">
                                <CardContent>
                                    <Typography sx={{ textAlign: 'left'}} variant="h5" color="dark"><strong>Curbsite pickup</strong></Typography>
                                    <Typography sx={{ textAlign: 'left', pt: 2}} variant="subtitle2" color="dark">Put your customers first by giving them an additional, more convenient way to pick up their purchases.</Typography>
                                </CardContent>
                                
                        </StyledCard>
                        </Grid>
                        <Grid item xs={12} md={4} sm={4}>
                        <StyledCard sx={{ backgroundColor: mode === 0 ? '#ffc34d': '',boxShadow: mode === 1 ? 3: 0 }}  onClick={() => console.log('clicked') } id="selection_card">
                                <CardContent>
                                    <Typography sx={{ textAlign: 'left'}} variant="h5" color="dark"><strong>Queue managment</strong></Typography>
                                    <Typography sx={{ textAlign: 'left', pt: 2}} variant="subtitle2" color="dark">Give your guests even more reason to smile by letting them line up virtually using their smart device.</Typography>
                                </CardContent>
                                
                        </StyledCard>
                        </Grid>
                        <Grid item xs={12} md={4} sm={4}>
                        <StyledCard sx={{ backgroundColor: mode === 0 ? '#ffc34d': '',boxShadow: mode === 1 ? 3: 0 }}  onClick={() => console.log('clicked') } id="selection_card">
                                <CardContent>
                                    <Typography sx={{ textAlign: 'left'}} variant="h5" color="dark"><strong>Operational analysis</strong></Typography>
                                    <Typography sx={{ textAlign: 'left', pt: 2}} variant="subtitle2" color="dark">Collect real-time data to see how your buisness is running and spot improvments.</Typography>
                                </CardContent>
                                
                        </StyledCard>
                        </Grid>
                    </Grid>

                </Container>

            </section>

            <Footer />
        </>
    )
}