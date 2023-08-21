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
        //checkBuisnessState();
        //getBusinessArgs();
        //getBusinessSchedule();
        gatherBusinessData();

    }, [])


    const gatherBusinessData = () => {
        setLoading(true);
        const currentTime = DateTime.local().toISO();
       
        // Execute both requests concurrently using Promise.all()
        Promise.all([
            requestBusinessSchedule(link),
            requestBusinessArguments(link),
            allowClientJoin(currentTime, link)
        ])
        .then(([scheduleResponse, argsResponse, stateResponse]) => {
            setSchedule(scheduleResponse);
            setArgs(argsResponse);
            if (stateResponse.status === 200){
                if (stateResponse.data.isAccepting){
                    setOpen(true)
                    setListSize(stateResponse.data.waitlistLength);
                    setLoading(false);
                }else {
                    setOpen(false);
                    setLoading(false);
                }
                return;
            }
            if (stateResponse.status === 203){
                setOpen(false);
                setErrors(stateResponse.data.msg);
                setLoading(false);
                return;
            }
            if (stateResponse.status === 404){
                setOpen(false);
                setErrors(stateResponse.data.msg);
                setLoading(false);
                return;
            }
        })
        .catch(error => {
            console.log(error);
            if (error.response.status === 404) {
                setErrors('This business does not exist.');
            }
            else {
                setErrors('Error found when collecting data.');
            }
        })
        .finally(() => {
            setLoading(false);
        });
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
            {args ? <Typography variant="subtitle1" gutterBottom>Currently {listSize} in line.</Typography> : null}
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
                    {errors ? <Alert color="error">{errors}</Alert>: null}
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

