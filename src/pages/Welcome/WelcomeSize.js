import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, 
    Fade, CircularProgress, Stack, ToggleButtonGroup, ToggleButton, IconButton, Zoom, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { allowClientJoin, getMax, requestBusinessArguments} from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import { CLIENT } from "../../static/static";
import "../../css/Welcome.css";


export default function Welcome() {

    const { link } = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [size,setSize] = useState(1);
    const [maxSize, setMaxSize] = useState(0);
    const [acceptingStatus, setAcceptingStatus] = useState({waitlist: false, appointments: false})
    const [args, setArgs] = useState(null);
    const [waitlistSize, setWaitlistSize ] = useState(null);

    const navigate = useNavigate();


    const getBuisnessForm = () => {
        getMax(link)
        .then(data => {
            setMaxSize(data.serveMax);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const setDataAndContinue = () => {
        const object = {
            partySize: size
        }
        sessionStorage.setItem(CLIENT, JSON.stringify(object));
        navigate(`/welcome/${link}/selector`);
    }

    const getAnySavedFields = () => {
        const user = sessionStorage.getItem(CLIENT);
        if (user) {
            let userObject = JSON.parse(user);
            if (userObject.partySize) {
                setSize(userObject.partySize);
            }
            return;
        }
    }

    const businessArguments = () => {
        requestBusinessArguments(link)
        .then(response => {
            setArgs(response);
        })
        .catch(error => {
            console.log(error)
            setError('Error found when trying to reach business.');
        })

    }
    
    useEffect(() => {
        redirectStatus();
        businessArguments();
        getBuisnessForm();
        getAnySavedFields();
        return() => {
            setLoading(false)
        }
    }, [loading])

    const redirectStatus = () => {
        const currentTime = DateTime.local().toISO();       
        allowClientJoin(currentTime, link)
        .then(response => {
            if (response.status === 200) {
                setAcceptingStatus({ waitlist: response.data.isAccepting, appointments: response.data.accpetingAppointments});
                setWaitlistSize(response.data.waitlistLength);
                if (response.data.isAccepting === false && response.data.accpetingAppointments === false) {
                    navigate(`/welcome/${link}`);
                    return;
                }
            }            
            
        })
        .catch(error => {
            console.log(error);
            setError('Error found when trying to reach business.');
        })
    }
   
    const handleChange = (event, value) => {
        if (value === 6){
            setOpen(true);
            setSize(value);
        }else {
            setOpen(false);
            setSize(value);
        } 
    }

    const redirectBack = () => {
        navigate(`/welcome/${link}`)
    }

    const ShowBusinessArguments = ({businessArgs, accepting}) => {
        console.log(businessArgs);
        if (accepting.waitlist === true) {
            return (
                <Box>
                    { businessArgs && businessArgs.present.position ?  <Typography variant="subtitle1" gutterBottom>Currenlty {waitlistSize} ahead of you.</Typography>: null }                
                </Box>
            )
        }
    }

    return (
        <>
            <Box className="center-box" sx={{ pt: 3 }}>
                <Card className="custom-card"  sx={{ p: 2, borderRadius: 5, boxShadow: 0 }}>
                    <Container sx={{ textAlign: 'left'}}>
                        <IconButton onClick={ () => redirectBack() }>
                            <KeyboardBackspaceIcon textAlign="left" fontSize="small"/>
                        </IconButton>
                    </Container>
                    <CardContent sx={{ justifyContent: 'center'}}>
                        <Container>

                        <Typography variant="body2" fontWeight="bold" color="gray" textAlign={'center'} gutterBottom>
                            {link}
                        </Typography>
                            {loading ? <CircularProgress /> : null}
                        <Typography variant="h4" fontWeight="bold" textAlign={'center'}>
                            Party size
                        </Typography>

                        <Stack direction='row' spacing={2} sx={{ pt: 5, p: 2}}>
                        <ToggleButtonGroup
                            value={size}
                            onChange={handleChange}
                            fullWidth
                            exclusive
                            >
                            {Array(6).fill().map((_, index) => (
                                <ToggleButton
                                value={index+1}
                                key={index+1}                               
                                >
                                    <strong>{index + 1}{index === 5 ? '+' : ''}</strong>
                                </ToggleButton>
                            ))}
                            </ToggleButtonGroup>
                            
                        </Stack>


                        <Box sx={{ display: 'flex', pt: 2, height: open ? 'auto' : 0  }}>
                            <Fade in={open}>
                                <TextField inputProps={{ max: maxSize, min: 6 }} type="number" onChange={e => setSize(e.target.value)} fullWidth={true} id="outlined-basic" label=" Party size" variant="outlined" />
                            </Fade>
                        </Box>


                        { 
                            // Current wait time needs to be calculated. 
                        }
                        <ShowBusinessArguments businessArgs={args} accepting={acceptingStatus}/>
                        <Container sx={{ pt: 3}}>
                            <Button fullWidth={true} sx={{p: 1, borderRadius: 10}} variant="contained" color="primary" onClick={() => setDataAndContinue()}>
                                <Typography variant="body2" fontWeight="bold" sx={{color: 'white', margin: 1 }}>
                                    Next
                                </Typography>
                            </Button> 
                        </Container>
                        </Container>
                                    
                    </CardContent>


                    <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 7}}>
                        <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                    </CardActions>
                </Card>
            </Box>


        </>
    )
}