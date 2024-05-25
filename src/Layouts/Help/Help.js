import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, CardMedia, Container, Grid, Typography} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Sparkle } from "phosphor-react";

export default function Help() {
    useEffect(() => {
    }, [])
    
    return(
        <Box>
            <Typography variant="h6" fontWeight={'bold'} gutterBottom>Help: Getting started</Typography>
            <Grid xs={{ pt: 2}} container>
                <Grid item xs={6}>
                <div>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    >
                    <Typography variant="subtitle1" fontWeight={'bold'}>Why can't my clients book appointments ? </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="subtitle1">
                        In order for your clients to book appointments, there are three main requirements. <br/>
                        First, you need to have employees added on your account. <br/>
                        Secondly, you must offer services that your employees can utilize. <br/>
                        Finally, each employee can be linked to a service.

                    </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    >
                    <Typography variant="subtitle1" fontWeight={'bold'}>My approximate wait-time is not correct?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="subtitle1">
                        Several factor can play into your approximate wait time. <br/>
                        The amount of employees your establishment has plays a role in the calculation. <br/>
                        Each client being served shrinks your wait time. <br/>
                        The duration of each service with the combination of employees plays a role in calculation.
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    >
                    <Typography variant="subtitle1" fontWeight={'bold'}>I have double booked appointments?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="subtitle1">
                        Due to the variations of internet speeds and possible connection issues to our servers. It is possible for your to have a double booking for a single date. <br/>
                        This is rare but if double bookings {`(appointments)`} happen often please email support@waitlist.com so we can look for possible issues with your account settings.
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    >
                    <Typography variant="subtitle1" fontWeight={'bold'}>Why is my wait list and appointment dates out of sync?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="subtitle1">
                        This is a common issue if your establishment has moved recently. Most commonly if your business has moved to a different timezone.<br/>
                        For example, if your business operated in los angeles/california and now in operates in dallas/texas, your avaailable appointments will be based on california date system.
                        To correct, update in <strong>{`Settings > timezone`}</strong>.
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    >
                    <Typography variant="subtitle1" fontWeight={'bold'}>How do appointments utilize my time?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="subtitle1">
                        In order for a client to book an appointment, a open timeslot must me open. <br/>
                        The timeslot needed to create an aappointment is based on the accuracy of your service duration. <br />
                        It's quite simple, if there is are two booked appointments but there is a 30 min window open then any service with less than or equal to 30 min will be available to be booked.
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    >
                    <Typography variant="subtitle1" fontWeight={'bold'}>How does waitlist work? </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="subtitle1">
                        A waitlist is an online version of a line. First come first serve is the basis of how a line works. <br />
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    >
                    <Typography variant="subtitle1" fontWeight={'bold'}> <Sparkle size={20} weight="duotone" />  Features coming soon <Sparkle size={20} weight="duotone" />  </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="subtitle1">
                        <strong>1. Resource and service based appointments</strong> - <br/>
                        No longer will your clients need employees to book an aappointment. <br /> 
                        <strong>2. Images for services, resources and employees</strong> - <br />
                        Have your clients see on their mobile device who and what they are booking. <br /> 
                        <strong>3. Chat with your bookies</strong> - <br />
                        Have the ability to chat with your clients before they visit your business.
                    </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    >
                    <Typography variant="subtitle1" fontWeight={'bold'}>Request new features ? </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="subtitle1">
                        We are open to feedback! Have an idea? let us know and if we deem it valuable then we will create it!<br/>
                        Please email us and title the subject 'feature-us' at: <strong>support@waitonline.us</strong> 
                    </Typography>
                    </AccordionDetails>
                </Accordion>

                </div>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ p: 2}}>
                        <Typography variant="subtitle1">
                            For all other concerns not listed, please feel free to email <strong>support@waitonline.com</strong> <br/>
                            Thank you for your continued support. <br/>
                            
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            
        </Box>
    )
}