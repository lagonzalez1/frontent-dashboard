import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, Alert, CircularProgress, Stack, Chip, Divider, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { allowClientJoin, requestBusinessArguments, requestBusinessSchedule } from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';


export default function Welcome() {

    const { link } = useParams();
    const [open, setOpen] = useState(false);
    const [listSize, setListSize] = useState(null);

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState();
    const [args, setArgs] = useState();
    const [schedule, setSchedule] = useState({});

    const navigate = useNavigate();


    


    const startJoinList = () => {
        navigate(`/welcome/${link}/size`);
    }


    useEffect(() => {
        checkBuisnessState();
        getBusinessArgs();
        getBusinessSchedule();
        return () => {
            if (args && open){
                setLoading(false);
            }
        }
    }, [])

    const getBusinessSchedule = () => {
        setLoading(true);
        requestBusinessSchedule(link)
        .then(response => {
            setSchedule(response);
        })
        .catch(error => {
            console.log(error);
            setErrors('Error found when collecting arguments.')
        })
        
    }


    const getBusinessArgs = () => {
        setLoading(true);
        requestBusinessArguments(link)
        .then(response => {
            setArgs(response);
            
        })
        .catch(error => {
            console.log(error);
            setErrors('Error found when collecting arguments.')
        })
        
    }


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


    const CheckBusinessArguments = () => {
        
        if (open === false) {
            return (
                <>
                    <Typography variant="h6" fontWeight='bold'>
                            This waitlist is currently closed.
                    </Typography>

                    <Container sx={{ justifyContent: 'center', justifyItems: 'center'}}>
                    <List dense={true}>
                            {
                                schedule ? Object.keys(schedule).map((item, key) => {
                                    if(item === "_id"){
                                        return null;
                                    }
                                    return (
                                        <ListItem key={key}>
                                            <ListItemText 
                                                primary={item}
                                                secondary={
                                                    schedule[item].start + " - " + schedule[item].end
                                                }
                                            />
                                        </ListItem>
                                    )
                                }): null
                            }
                    </List>
                    </Container>
                </>
            )
        }

        return(
            <>
            {args.present.position ? <Typography variant="subtitle1" gutterBottom>Currently {listSize} in line.</Typography> : null}
            <br/>
            <Button disabled={!open} fullWidth={true} sx={{p: 1, borderRadius: 10}} variant="contained" color="primary" onClick={() => startJoinList()}>
                <Typography variant="body2" fontWeight="bold" sx={{color: ' white', margin: 1 }}>
                    Join waitlist
                </Typography>
            </Button>
            </>
        )


    }
    
    


    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3 }}>
                <Card sx={{ minWidth: 465, textAlign:'center', p: 3, borderRadius: 5, boxShadow: 0 }}>
                    { loading ? <CircularProgress/> : 
                    (<>
                    <CardContent>
                        <Typography variant="body2" fontWeight="bold" color="gray" gutterBottom>
                            {link}
                        </Typography>
                        <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>Welcome</Typography>
                        <CheckBusinessArguments />
            

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

