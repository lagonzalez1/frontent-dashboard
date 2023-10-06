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
import { APPOINTMENT, CLIENT } from "../../static/static";


export default function WelcomeSelector() {

    const { link } = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [size,setSize] = useState(1);
    const [args, setArguments] = useState(null);
    const [systemTypeSelected, setSystem] = useState(null);

    const navigate = useNavigate();


    const getBuisnessForm = () => {
        requestBusinessArguments(link)
        .then(data => {
            setArguments(data);
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
        navigate(`/welcome/${link}/details`);
    }
    
    useEffect(() => {
        getBuisnessForm();
        return() => {
            setLoading(false)
        }
    }, [])
   
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
        navigate(`/welcome/${link}/size`)
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
                    <CardContent>
                    
                        <Typography variant="body2" fontWeight="bold" color="gray" gutterBottom>
                            {link}
                        </Typography>
                            {loading ? <CircularProgress /> : null}
                        <Typography variant="h4" fontWeight="bold">
                            Type
                        </Typography>
                        <br/>
                        <ButtonGroup fullWidth={true} variant="outlined">
                            <Button> Waitlist</Button>
                            <Button> Appointment</Button>
                        </ButtonGroup>


                        
                        


                        



                        <Container sx={{ pt: 3}}>
                            <Button fullWidth={true} sx={{p: 1, borderRadius: 10}} variant="contained" color="primary" onClick={() => setDataAndContinue()}>
                                <Typography variant="body2" fontWeight="bold" sx={{color: 'white', margin: 1 }}>
                                    Next
                                </Typography>
                            </Button> 
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