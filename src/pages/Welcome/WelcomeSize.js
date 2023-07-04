import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, 
    Fade, CircularProgress, Stack, ToggleButtonGroup, ToggleButton, IconButton, Zoom, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { buisnessForms} from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import "../../css/WelcomeSize.css";


export default function Welcome() {

    const { link } = useParams();
    const [services, setServices] = useState();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [size,setSize] = useState(0);
    const [maxSize, setMaxSize] = useState(0);

    const navigate = useNavigate();


    const getBuisnessForm = () => {
        buisnessForms(link)
        .then(data => {
            setServices(data.services);
            setMaxSize(data.serveMax);
        })
        .catch(error => {
            console.log(error);
        })
    }
    
    useEffect(() => {
        getBuisnessForm();
        return() => {
            setLoading(false)
        }
    }, [])
   
    const handleChange = (event, value) => {
        if (value === 5){
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
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3 }}>
                <Card sx={{ minWidth: 475, textAlign:'center', p: 3, borderRadius: 5, boxShadow: 0 }}>
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
                                value={index}
                                key={index}                               
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



                        <Typography sx={{ pt: 3}} variant="body2" fontWeight="bold">Current wait time 8 min.</Typography>
                        <Container sx={{ pt: 3}}>
                            <Button fullWidth={true} sx={{p: 1}} variant="contained" color="primary" onClick={() => console.log(size)}>
                                Next
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