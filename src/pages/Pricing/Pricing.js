import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, Stack, Box, Button, CardContent, Fade, Table, TableCell, TableContainer, TableHead, TableRow, TableBody,
    useMediaQuery, useTheme , Slide, Zoom, Grow, CardMedia, ThemeProvider, Card, CardHeader, Paper } from "@mui/material";
import { HomePageTheme } from "../../theme/theme";
import { Users, Calendar, Sparkle, CheckCircle } from "phosphor-react"; 
import CheckIcon from '@mui/icons-material/Check';
import Footer from "../Footer/Footer.js";
import Navbar from '../Navbar/Navbar';
import '../../css/Pricing.css'


export default function Pricing() {

    const [mode, setMode] = useState(0);
    

    const bull = (
        <Box
          component="span"
          sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
        >
          •
        </Box>
      );

      function createData(name, subname, op1, op2, op3) {
        return { name, subname, op1, op2, op3 };
      }
      
      const rows = [
        createData('Number of visits','Number of visits per month', '550 monthly', '1150 monthly', '1650 monthly'),
        createData('Number of locations', 'Use our service across multiple locations', 'Additional $3.99+ /mo', 'Additional $5.99+ /mo', 'Additional $7.99+ /mo'),
        createData('TV monitor display', 'Show your waitlist live on any screen.', <CheckCircle size={26} color='#673ab7' weight="fill"/>, <CheckCircle size={26} color='#673ab7' weight="fill"/>, <CheckCircle size={26} color='#673ab7' weight="fill"/>),
        createData('Resource management', 'Assign staff and other resources to guests and set working hours.', <CheckCircle size={26} color='#673ab7' weight="fill"/>, <CheckCircle size={26} color='#673ab7' weight="fill"/>,<CheckCircle size={26} color='#673ab7' weight="fill"/>),
        createData('Service management', 'Add services and set prices and durations.', <CheckCircle size={26} color='#673ab7' weight="fill"/>, <CheckCircle size={26} color='#673ab7' weight="fill"/>,<CheckCircle size={26} color='#673ab7' weight="fill"/>),
        createData('AI wait time estimation', 'Provide the most accurate wait times with AI powered estimation.', <CheckCircle size={26} color='#673ab7' weight="fill"/>, <CheckCircle size={26} color='#673ab7' weight="fill"/>,<CheckCircle size={26} color='#673ab7' weight="fill"/>),
        createData('Roles and permissions', 'Select roles and permission levels for user', <CheckCircle size={26} color='#673ab7' weight="fill"/>, <CheckCircle size={26} color='#673ab7' weight="fill"/>, <CheckCircle size={26} color='#673ab7' weight="fill"/>),
        createData('Send notifications', 'Send specialized notifications to your guest', '', <CheckCircle size={26} color='#673ab7' weight="fill"/>, <CheckCircle size={26} color='#673ab7' weight="fill"/>),
        createData('Detailed customer profiles', 'Select roles and permission levels for user', '', '', <CheckCircle size={26} color='#673ab7' weight="fill"/>),
        createData('Save customer data', 'Save customer meta data', '', '', <CheckCircle size={26} color='#673ab7' weight="fill"/>),
        createData('Analytics', 'See where your business might need improvments', '', '', <CheckCircle size={26} color='#673ab7' weight="fill"/>),


      ];


    return (
        <ThemeProvider theme={HomePageTheme}>
            <Navbar />
                    <Container sx={{ pt: 3}}>
                        <section className="what_we_offer">
                          <Typography variant="h3" textAlign={'center'}>What we offer</Typography>
                          <Typography variant="h6" textAlign={'center'}>We make it simple.</Typography>
                          <Typography variant="h6" textAlign={'center'}>We offer 3 packages, Waitlist, Appointments, Waitlist And Appointments</Typography>
                        </section>
                    </Container>


                <section className="pricing_info">
                <Container>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={2}>
                        <Grid item xs={12} md={4} sm={4}>
                        <Card elevation={0} sx={{ minWidth: 275, p: 2, minHeight: 350 }}>
                        
                        <CardContent>
                            <Box sx={{justifyContent: 'center', display: 'flex'}}><Users size={36}/></Box>
                            <Typography textAlign={'center'} gutterBottom fontWeight={'bold'} variant="h6">
                                Online Waitlist
                            </Typography>
                            <Typography textAlign={'center'} gutterBottom fontWeight={'bold'} variant="h6">
                                $5.99 <Typography variant="caption">/mo</Typography>
                            </Typography>
                            <Typography textAlign={'center'} gutterBottom fontWeight={'bold'} variant="body2">
                              {bull} Let guest wait in a virtual line
                              <br/>
                              {bull} Let guest update you prior to check in
                              <br/>
                              {bull} Access to waitlist service
                            </Typography>
                          </CardContent>
                        </Card>
                        </Grid>


                        <Grid item xs={12} md={4} sm={4}>
                        <Card elevation={0} sx={{ minWidth: 275, p: 2, minHeight: 350 }}>
                        
                          <CardContent>
                            <Box sx={{justifyContent: 'center', display: 'flex'}}><Calendar size={36}/></Box>
                            <Typography textAlign={'center'} gutterBottom fontWeight={'bold'} variant="h6">
                              Appointment scheduling
                            </Typography>
                            <Typography textAlign={'center'} gutterBottom fontWeight={'bold'} variant="h6">
                                $7.99 <Typography variant="caption">/mo</Typography>
                            </Typography>
                            <Typography textAlign={'center'} gutterBottom fontWeight={'bold'} variant="body2">
                              {bull} Let guest make appointments in advance
                              <br/>
                              {bull} Let guest update their appointments
                              <br/>
                              {bull} Access to waitlist service
                            </Typography>
                          </CardContent>
                        </Card>
                        </Grid>
                        <Grid item xs={12} md={4} sm={4}>
                        <Card elevation={0} sx={{ minWidth: 275, p: 2, minHeight: 350 }}>
                        
                        <CardContent>
                            <Box sx={{justifyContent: 'center', display: 'flex'}}><Sparkle size={36}/></Box>
                            <Typography textAlign={'center'} gutterBottom fontWeight={'bold'} variant="h6">
                              Appointments & Waitlist & Analytics
                            </Typography>
                            <Typography textAlign={'center'} gutterBottom fontWeight={'bold'} variant="h6">
                                $11.99 <Typography variant="caption">/mo</Typography>
                            </Typography>
                            <Typography textAlign={'center'} gutterBottom fontWeight={'bold'} variant="body2">
                              {bull} Let guest make appointments in advance
                              <br/>
                              {bull} Let guest wait in a virtual line
                              <br/>
                              {bull} Save guest metadata for promotion
                              <br/>
                              {bull} Access to your own analytics
                            </Typography>
                          </CardContent>
                        </Card>
                        </Grid>                    
                </Grid>
                </Container>
                </section>


                <section className="more_info">
                    <Container>
                        <Typography gutterBottom variant="h3" textAlign={'center'}>More details</Typography>
                        <Typography variant="subtitle2">We are perfect for small business looking for a edge in the competition.</Typography>
                        <Typography gutterBottom variant="subtitle2">Compare our options and pick which fits best!.</Typography>
                    </Container>


                    <Container sx={{ pt: 2}}>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} size="normal" aria-label="a dense table">
                            <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="right"><Typography variant="subtitle1" fontWeight={'bold'}>Waitlist</Typography></TableCell>
                                <TableCell align="right"><Typography variant="subtitle1" fontWeight={'bold'}>Appointments</Typography></TableCell>
                                <TableCell align="right"><Typography variant="subtitle1" fontWeight={'bold'}>Waitlist/Appointments +</Typography> </TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row"> 
                                    <Typography variant="subtitle1" fontWeight={'bold'}>{row.name}</Typography>
                                    <Typography variant="body2">{row.subname}</Typography>

                                </TableCell>
                                <TableCell align="right">{row.op1}</TableCell>
                                <TableCell align="right">{row.op2}</TableCell>
                                <TableCell align="right">{row.op3}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                    </Container>
                    
                    
                </section>
            <Footer />
        </ThemeProvider>
    )
}