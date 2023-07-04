import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, Alert, CircularProgress, Stack } from "@mui/material";
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
    const navigate = useNavigate();


    
    const checkBuisnessState = () => {
        const currentTime = DateTime.local().toISO();
        console.log(link)
        allowClientJoin(currentTime, link)
        .then(response => {
            if (response.data.isAccepting){
                setOpen(true)
                setListSize(response.data.waitTime);
            }else {
                setOpen(false);
            }
        })
        .catch(error => {
            console.log(error)
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
                    <CardContent>
                    <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>Welcome</Typography>
                    <Stack spacing={3}>
                    <Typography variant="subtitle1" gutterBottom>Currently {listSize} in line.</Typography>
                    { loading && <CircularProgress/> }
                    { !open ? <Alert severity="warning">
                        <Typography variant="body2" fontWeight="bold">This waitlist is closed at the moment.</Typography>
                    </Alert>: null}
                    <Button disabled={!open} rounded fullWidth={true} sx={{p: 1}} variant="contained" color="primary" onClick={() => startJoinList()}>
                        Join waitlist
                    </Button>
                    
                    </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 7}}>
                        <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                    </CardActions>
                </Card>
            </Box>


        </>
    )
}

