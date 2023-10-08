import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, 
    Fade, CircularProgress, Stack, IconButton, Zoom, ButtonGroup } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { requestBusinessArguments} from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import "../../css/WelcomeSize.css";
import { APPOINTMENT, CLIENT, WAITLIST } from "../../static/static";
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';


export default function WelcomeSelector() {

    const { link } = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [size,setSize] = useState(1);
    const [args, setArguments] = useState(null);
    const [systemTypeSelected, setSystem] = useState(null);
    const currentDate = DateTime.now();

    const [appointmentData, setAppointmentData] = useState({
        date: null,
        start: null,
        end: null
    })

    const navigate = useNavigate();


    const getBuisnessForm = () => {
        requestBusinessArguments(link)
        .then(data => {
            console.log(data)
            setArguments(data);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            setLoading(false);
        })
    }

    const setDataAndContinue = (pass) => {
        if (systemTypeSelected === APPOINTMENT){


            const payload = sessionStorage.getItem(CLIENT);
            let previousData = JSON.parse(payload);
            const object = {
                TYPE: APPOINTMENT,
                ...appointmentData,
                ...previousData
            }
            sessionStorage.setItem(CLIENT, JSON.stringify(object));
            navigate(`/welcome/${link}/details`);
        }
        if (systemTypeSelected === WAITLIST){
            const payload = sessionStorage.getItem(CLIENT);
            let previousData = JSON.parse(payload);
            const object = {
                ...previousData,
            }
            sessionStorage.setItem(CLIENT, JSON.stringify(object));
            navigate(`/welcome/${link}/details`);
        }

    }
    
    useEffect(() => {
        getBuisnessForm();
        return() => {
            setLoading(false);
        }
    }, [loading])
   
    const typeChange = (TYPE) => {
        setSystem(TYPE);
    }

    const redirectBack = () => {
        navigate(`/welcome/${link}/size`)
    }

    const handleDateChange = (date) => {
        setAppointmentData((prev) => ({...prev, date: date}))
    }



    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3 }}>
                <Card sx={{ minWidth: 465, textAlign:'center', p: 3, borderRadius: 5, boxShadow: 0 }}>
                    <Container sx={{ textAlign: 'left'}}>
                        <IconButton onClick={ () => redirectBack() }>
                            <KeyboardBackspaceIcon textAlign="left" fontSize="small"/>
                        </IconButton>
                    </Container>

                    {loading ? (<CircularProgress />): 
                    <CardContent>
                    
                        <Typography variant="body2" fontWeight="bold" color="gray" gutterBottom>
                            {link}
                        </Typography>
                            {loading ? <CircularProgress /> : null}
                        <Typography variant="h5" fontWeight="bold">
                            Type
                        </Typography>
                        <br/>
                        <ButtonGroup fullWidth={true} variant="outlined">
                            <Button disabled={args && !args.system.waitlist} variant={systemTypeSelected === WAITLIST ? 'contained': 'outlined'} onClick={() => typeChange(WAITLIST)}> Waitlist</Button>
                            <Button disabled={args && !args.system.appointments} variant={systemTypeSelected === APPOINTMENT ? 'contained': 'outlined'} onClick={() => typeChange(APPOINTMENT)}> Appointment</Button>
                        </ButtonGroup>

                        {
                            loading ? (<CircularProgress /> ):

                            systemTypeSelected === APPOINTMENT 
                            &&
                            <Box sx={{ pt: 1}}>
                                    <StaticDatePicker
                                    sx={{
                                        '& .MuiPickersToolbar-root': {
                                          borderRadius: 5,
                                          borderWidth: 1,
                                          border: '1px solid',
                                        },
                                      }}
                                      onChange={(newDate) => handleDateChange(newDate) }
                                      
                                    defaultValue={currentDate} />
                            </Box>
                        }



                        <Container sx={{ pt: 3}}>
                            <Button disabled={appointmentData.start === null} fullWidth={true} sx={{p: 1, borderRadius: 10}} variant="contained" color="primary" onClick={() => setDataAndContinue()}>
                                <Typography variant="body2" fontWeight="bold" sx={{color: 'white', margin: 1 }}>
                                    Next
                                </Typography>
                            </Button> 
                        </Container>
                                    
                    </CardContent>
                    }


                    <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 7}}>
                        <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                    </CardActions>
                </Card>
            </Box>


        </>
    )
}