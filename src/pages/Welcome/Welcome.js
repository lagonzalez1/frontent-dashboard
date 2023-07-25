import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, Alert, CircularProgress, Stack, Divider } from "@mui/material";
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { allowClientJoin } from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';


export default function Welcome({ path }) {

    const { link } = useParams();
    const [open, setOpen] = useState(false);
    const [listSize, setListSize] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState();
    const navigate = useNavigate();


    
    const checkBuisnessState = () => {
        const currentTime = DateTime.local().toISO();
        allowClientJoin(currentTime, link)
        .then(response => {
            switch (response.status) {
                case 200:
                    if (response.data.isAccepting){
                        setOpen(true)
                        setListSize(response.data.waitlistLength);
                        setLoading(false);
                    }else {
                        setOpen(false);
                        setLoading(false);
                    }
                    return;
                case 203:
                    setOpen(false);
                    setErrors(response.data.msg);
                    setLoading(false);
                    return;
            }
        })
        .catch(error => {
            console.log(error)
            setLoading(false);
        })
    }


    const startJoinList = () => {
        navigate(`/welcome/${link}/size`);
    }


    useEffect(() => {
        checkBuisnessState();
        return() => {
            setLoading(false)
        }
    }, [])


    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3 }}>
                <Card sx={{ minWidth: 475, textAlign:'center', p: 3, borderRadius: 5, boxShadow: 0 }}>
                    { loading ? (<CircularProgress/> ): 
                    (<>
                    <CardContent>
                    {errors ? (<Alert severity="error">{errors}</Alert>):
                        (<>
                        <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>Welcome</Typography>
                        <Stack spacing={3}>

                        
                        <Typography variant="subtitle1" gutterBottom>Currently {listSize} in line.</Typography>
                        
                        
                        { !open ? <Alert severity="warning">
                            <Typography variant="body2" fontWeight="bold">This waitlist is closed at the moment.</Typography>
                        </Alert>: null}
                        <Button disabled={!open} fullWidth={true} sx={{p: 1, borderRadius: 10}} variant="contained" color="primary" onClick={() => startJoinList()}>
                        <Typography variant="body2" fontWeight="bold" sx={{color: ' white', margin: 1 }}>
                            Join waitlist
                        </Typography>
                        </Button>
                        
                        </Stack>
                        <Divider />
                        </>)
                    }
                    </CardContent>
                    </>
                    )}
                    <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 7}}>
                        <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                    </CardActions>
                </Card>
            </Box>


        </>
    )
}

