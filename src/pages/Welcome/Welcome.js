import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, Alert, CircularProgress, Stack, 
    Avatar, Divider, IconButton, List, ListItem, ListItemText, Chip, Dialog, DialogTitle, DialogContent, DialogActions, 
    Grid,
    Zoom} from "@mui/material";
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { allowClientJoin, requestBusinessArguments, requestBusinessSchedule } from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import "../../css/Welcome.css";
import { ThemeProvider } from "@emotion/react";
import { ClientWelcomeTheme } from "../../theme/theme";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function Welcome() {

    const { link } = useParams();
    const [open, setOpen] = useState(false);

    

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState();

    const [iconImageLink, setIconImage] = useState(null);
    const [system, setSystem] = useState(null);
    const [present, setPresent] = useState(null);
    const [waittime, setWaittime] = useState(null);
    const [waittimeRange, setWaittimeRange] = useState(null);
    const [position, setPosition] = useState(null);

    const [schedule, setSchedule] = useState({});

    const [businessDetails, setBusiness] = useState(null);
    const [acceptingStatus, setAcceptingStatus] = useState({waitlist: false, appointments: false})
    const [nextDate, setNextAvailableDate] = useState({});
    const [businessInfo, showBusinessInfo] = useState(false);
    const [zoomIntoView, setZoomIntoView] = useState(false);

    const navigate = useNavigate();


    const startJoinList = () => {
        setZoomIntoView(false);
        navigate(`/welcome/${link}/size`);
    }


    useEffect(() => {
        gatherBusinessData();
    }, [])

    const gatherBusinessData = () => {
        setLoading(true);
        const currentTime = DateTime.local().toISO();       
        Promise.all([
            requestBusinessSchedule(link),
            requestBusinessArguments(link),
            allowClientJoin(currentTime, link)
        ])
        .then(([scheduleResponse, argsResponse, stateResponse]) => {
            if (stateResponse.status === 404){
                setOpen(false);
                setErrors(stateResponse.data.msg);
                setLoading(false);
                return;
            }

            setSchedule(scheduleResponse.schedule); // Get schedule
            setNextAvailableDate(scheduleResponse.nextAvailable); // Get next available date
            setIconImage(argsResponse.profileLink); // Get image link
            setPresent(argsResponse.present) // What can i present to user Waittime,est time...
            setSystem(argsResponse.system); // What can i show, waitlist and or appointments.


            if (stateResponse.status === 200){
                setAcceptingStatus({ waitlist: stateResponse.data.isAccepting, appointments: stateResponse.data.acceptingAppointments});
                if (stateResponse.data.isAccepting === false && stateResponse.data.acceptingAppointments === false) {
                    navigate(`/welcome/${link}`);
                    return;
                }
                setWaittime(stateResponse.data.waittime); 
                setWaittimeRange(stateResponse.data.waittimeRange)
                setOpen(stateResponse.data.isAccepting);
                setPosition(stateResponse.data.waitlistLength);
                setBusiness(argsResponse.businessDetails);
                setLoading(false);
            }
        })
        .catch(error => {
            console.log(error);
            if (error.status === 404) {
                setErrors(errors.response.data.msg);
            }
            else {
                setErrors('Error found when collecting data.');
            }
        })
        .finally(() => {
            setZoomIntoView(true);
            setLoading(false);
        });
    }

    const PresentWaitlineInformation = ({present, acceptingStatus}) => {
        return (
            <Stack spacing={0.5} mb={1}>
                { present.position === true && acceptingStatus.waitlist === true && <Typography textAlign={'center'}  variant="body2">Currently <strong>{position}</strong> in line</Typography>}     
                { present.waittime === true && acceptingStatus.waitlist === true && <Typography textAlign={'center'}  variant="body2">Est wait <strong>{waittimeRange}</strong></Typography>}                
            </Stack>
        )
    }

    const closeBusinessInfo = () => {
        showBusinessInfo(false);
    }


    const ErrorNotFound = () => {
        return (
            <>
                <Typography textAlign={'center'} variant="h4" component="div" fontWeight="bold" gutterBottom sx={{ pt: 2}}>Welcome!</Typography>
                <Typography textAlign={'center'} variant="body2" gutterBottom>Unfortunately the link you have used does not exist.</Typography> 
                <br/>
                <Typography textAlign={'center'} variant="caption" gutterBottom>Possible issues</Typography>
                <br/>
                <Typography textAlign={'center'} variant="caption" gutterBottom>incorrect or case sensitive value after www.waitlist.com/welcome/ISSUE</Typography>
            
            </>
        )
    }

    const CheckBusinessArguments = () => {
        if ( nextDate === 'No upcoming available dates in the schedule.') { 
            return <ErrorNotFound />
        }
        // Closed for both options
        if (acceptingStatus.waitlist === false && acceptingStatus.appointments === false) {
            const start = DateTime.fromFormat( nextDate.start, "HH:mm").toFormat('h:mm a');
            const end = DateTime.fromFormat( nextDate.end, "HH:mm").toFormat('h:mm a');
            return (
                <>
                    <Typography textAlign={'center'} sx={{  pt: 2}} variant="h5" fontWeight='bold'>
                            This waitlist is currently closed.
                    </Typography>

                    <Container sx={{ justifyContent: 'center', justifyItems: 'center', pt: 2}}>
                    <Stack spacing={0.5}>
                        <Typography textAlign={'center'} variant="subtitle1">
                            {"Waitlist will open again"}
                        </Typography>
                        <Typography textAlign={'center'} variant="body2" fontWeight={'bold'}>
                            <strong>{nextDate.day}</strong>
                            {" from "+  start + " - " + end }
                        </Typography>
                    </Stack>
                    </Container>
                </>
            )
        }
        // Open for at least on option.
        return (
            <>
            <Typography textAlign={'center'} variant="h4" component="div" fontWeight="bolder" gutterBottom sx={{ pt: 2}}>Welcome!</Typography>
            { acceptingStatus.waitlist === false && acceptingStatus.appointments === true ? (<Typography textAlign={'center'} variant="body2" gutterBottom>Only appointments are available to make.</Typography> ): null }
            <br/>

            {present ? <PresentWaitlineInformation present={present} acceptingStatus={acceptingStatus}/> : <CircularProgress  size={20}/> }
            <Button fullWidth={true} sx={{p: 1, borderRadius: 10}} variant="contained" color="primary" onClick={() => startJoinList()}>
                <Typography variant="body2"  fontWeight="bold" sx={{color: ' white', margin: 1 }}>
                    { acceptingStatus.waitlist && acceptingStatus.appointments ? 'Join waitlist' : 'create appointment'}
                </Typography>
            </Button>
            </>
        )
    }
    


    return (
        <>  
            <ThemeProvider theme={ClientWelcomeTheme}>
                <Box className="center-box">
                <Grid 
                    container
                    sx={{pt: 2}}
                    spacing={1}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"                      
                >   
                    <Zoom in={zoomIntoView}>
                    <Grid className="grid-item" item xs={12} md={3} lg={4} xl={4}>
                    <Card variant="outlined" sx={{pt: 1, borderRadius: 5, p: 4}}>
                            { loading ? 
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 2}}>
                                <CircularProgress size={20}/>
                            </Box> : 
                            (<>
                            {errors ? <Alert color="error">{errors}</Alert>: null}
                            <CardContent>
                                <Typography textAlign={'center'} variant="body2" fontWeight="bold" color="gray" gutterBottom>
                                    {link}
                                </Typography>
                                {iconImageLink ? (
                                <Avatar sx={{ width: 67, height: 67, mx: 'auto' }} src={iconImageLink} />
                            ) : null}
                                <CheckBusinessArguments />
                            </CardContent>
                            </>
                            )}
                            <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 1, pt: 7}}>
                                <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                                <br/>                        
                            </CardActions>
                            {errors ? (null) : 
                            <Box textAlign={'center'}>
                            <IconButton onClick={() => showBusinessInfo(true)}>
                                <InfoOutlinedIcon fontSize="small"/>
                            </IconButton>
                            </Box>
                            }

                        </Card>
                    </Grid>
                    </Zoom>
                </Grid>

                </Box>
            <Dialog
                open={businessInfo}
                onClose={closeBusinessInfo}
                id="businessInfo"
            >
            <DialogTitle><strong>Business information</strong></DialogTitle>
            <Divider />
            <DialogContent>
                { businessDetails ? (
                    <>
                        <Typography variant="subtitle1"><strong>Name</strong> {businessDetails.name} </Typography>
                        <Typography variant="subtitle1"><strong>Address</strong> { businessDetails.address} </Typography>
                        <Typography variant="subtitle1"><strong>Phone</strong> { businessDetails.phone} </Typography>
                        <Typography variant="subtitle1"><strong>Website</strong> { businessDetails.website} </Typography>
                    </>
                )
                : null}
            </DialogContent>
            <DialogActions>
                <Button sx={{borderRadius: 7}} variant='contained' onClick={closeBusinessInfo}>Close</Button>
            </DialogActions>
            </Dialog>
            
            </ThemeProvider>

        </>
    )
}

