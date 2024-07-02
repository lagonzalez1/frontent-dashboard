import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, Alert, CircularProgress, Stack, 
    Avatar, Divider, IconButton, List, ListItem, ListItemText, Chip, Dialog, DialogTitle, DialogContent, DialogActions, 
    Grid,
    Zoom,
    Slide,
    AlertTitle,
    Icon} from "@mui/material";
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getBusinessPresent, getBusinessTimezone, isBusinesssOpen } from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import "../../css/Welcome.css";
import { ThemeProvider } from "@emotion/react";
import { ClientWelcomeTheme, ClientWelcomeThemeDark } from "../../theme/theme";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { FacebookLogo, InstagramLogo, TwitterLogo, XLogo } from "phosphor-react";



export default function Welcome() {

    const { link } = useParams();
    const [open, setOpen] = useState(false);


    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({title: null, body: null});
    const [disable, setDisabled] = useState(false);
    const [iconImageLink, setIconImage] = useState(null);
    const [waittimeRange, setWaittimeRange] = useState(null);
    const [position, setPosition] = useState(null);

    
    const [businessPresent, setBusinessPresent] = useState({
        position: null,
        waittime: null,
        waitlist: null,
        services: null,
        employees: null,
        resources: null,
        servicePrice: null
    });

    const [system, setSystem] = useState({
        waitlist: null,
        appointments: null,
        equalDate: null,
        autoDelete: null,
        maxAppointmentDate: null
    })

    const [businessInfo, setShowBusinessInfo] = useState(false);
    const [business, setBusinessInfo] = useState({
        businessName: null,
        businessAddress: null,
        businessPhone: null,
        businessWebsite: null
    })
    const [social, setSocial] = useState({
        instagram: null,
        twitter: null,
        facebook: null
    })

    const [acceptingStatus, setAcceptingStatus] = useState({waitlist: false, appointments: false})
    const [nextDate, setNextAvailableDate] = useState(null);
    const [zoomIntoView, setZoomIntoView] = useState(false);


    const [timezone, setTimezone] = useState(null);
    
    
    const getTimezone = () => {
        getBusinessTimezone(link)
        .then(response => {
            setTimezone(response.timezone)
        })
        .catch(error => {
            setErrors({title: 'Error', body: error.msg});
            setDisabled(true); 
        })
    }


    const navigate = useNavigate();


    const startJoinList = () => {
        setZoomIntoView(false);
        navigate(`/welcome/${link}/size`);
    }


    useEffect(() => {
        getTimezone()
        getBusinessData();
    }, [])


    // 1. Waittime data
    // 2. Check if closed overall.
    // 3. If open or closed. {appointment, waitlist}
    const getBusinessData = () => {
        setLoading(true);
        const currentTime = DateTime.local().toISO();
        Promise.all([
            isBusinesssOpen(link, currentTime),
            getBusinessPresent(link, currentTime)
        ])
        .then(([businessOpenResponse, businessPresentResponse]) => {
            setOpen(businessOpenResponse.isOpen);
            setNextAvailableDate(businessPresentResponse.nextAvailable);
            setAcceptingStatus({
                appointments: businessOpenResponse.acceptingAppointments, 
                waitlist: businessOpenResponse.acceptingWaitlist});
            setBusinessPresent(businessPresentResponse.presentables);
            setSystem(businessPresentResponse.system);
            setWaittimeRange(businessPresentResponse.waittimeRange);
            setBusinessInfo(businessPresentResponse.businessInformation);
            setSocial(businessPresentResponse.social)
            setIconImage(businessPresentResponse.profileLink);
            setPosition(businessPresentResponse.position);
        })
        .catch(error => {
            if (error.error.status === 404) {
                setDisabled(true)
                setErrors({title: 'Error', body: error.error.data.msg});
                setOpen(false);
                setNextAvailableDate(null);
                return;
            }
            else {
                setDisabled(true)
                setErrors({title: 'Error', body: error.error.data.msg});
                setOpen(false);
                setNextAvailableDate(null);
                return;
            }
        })
        .finally(() => {
            setZoomIntoView(true);
            setLoading(false);
        });
    }


    const openSocial = (type) => {
        
        switch(type) {
            case 'FACE':
                const facebook = window.open(social.facebook, '_blank', 'noopener,noreferrer')
                if (facebook) window.opener = null;    
            break;
            case 'TWIT':
                const twitter = window.open(social.twitter, '_blank', 'noopener,noreferrer')
                if (twitter) window.opener = null;
                break;
            case 'INSTA':
                const instagram = window.open(social.instagram, '_blank', 'noopener,noreferrer')
                if (instagram) window.opener = null;
                break;
        }
        
    }

    const PresentWaitlineInformation = ({present, acceptingStatus}) => {
        return (
            <Stack spacing={0.2} mb={0.5}>
                { present.position === true && acceptingStatus.waitlist === true && <Typography textAlign={'center'}  variant="caption">Currently <strong>{position}</strong> in line..</Typography>}     
                { present.waittime === true && acceptingStatus.waitlist === true && <Typography textAlign={'center'}  variant="caption">Est wait <strong>{waittimeRange}</strong></Typography>}                
            </Stack>
        )
    }

    const closeBusinessInfo = () => {
        setShowBusinessInfo(false);
    }


    const ErrorNotFound = () => {
        return (
            <Box>
                <Typography textAlign={'center'} variant="h4" component="div" fontWeight="bold" gutterBottom sx={{ pt: 2}}>Welcome!</Typography>
                <Typography textAlign={'center'} variant="body2" gutterBottom>Unfortunately the link you have used does not exist.</Typography> 
                <br/>
                <Typography textAlign={'center'} variant="body2" fontWeight={'bold'} gutterBottom>Possible issues</Typography>
                <Typography textAlign={'center'} variant="body2" gutterBottom>- incorrect or case sensitive value after www.waitlist.com/welcome/BUSINESS-NAME</Typography>
                <Typography textAlign={'center'} variant="body2" gutterBottom>- not connected to a stable internet</Typography>

            
            </Box>
        )
    }

    const CheckBusinessArguments = () => {
        if ( nextDate === 'No upcoming available dates in the schedule.' || nextDate === null) { 
            return <ErrorNotFound />
        }
        // Closed for both options
        if (open === false && acceptingStatus.appointments === false) {
            const start = DateTime.fromFormat( nextDate.start, "HH:mm").toFormat('h:mm a');
            const end = DateTime.fromFormat( nextDate.end, "HH:mm").toFormat('h:mm a');
            return (
                <>
                    <Typography textAlign={'center'} sx={{ pt: 2}} variant="h5" fontWeight='bolder'>
                            This waitlist is currently closed.
                    </Typography>

                    <Container sx={{ justifyContent: 'center', justifyItems: 'center', pt: 2}}>
                    <Stack spacing={0}>
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
            <Typography textAlign={'center'} variant="h4" component="div" fontWeight="bolder" gutterBottom sx={{ pt: 1}}>Welcome!</Typography>
            <br/>
            {businessPresent ? <PresentWaitlineInformation present={businessPresent} acceptingStatus={acceptingStatus}/> : <CircularProgress  size={20}/> }
            <Button fullWidth={true} sx={{p: 1, borderRadius: 10}} variant="contained" color="primary" onClick={() => startJoinList()}>
                <Typography variant="body2"  fontWeight="bold" sx={{color: ' white', margin: 1 }}>
                    { acceptingStatus.waitlist === true && acceptingStatus.appointments === false ? 'Join waitlist' : 'create appointment'}
                </Typography>
            </Button>
            </>
        )
    }
    
    return (
        <>  
            <ThemeProvider theme={ClientWelcomeThemeDark}>
                <Box className="center-box">
                <Grid 
                    container
                    sx={{pt: 2}}
                    spacing={1}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"                      
                >   
                    <Slide direction="up" in={zoomIntoView} mountOnEnter unmountOnExit>
                    <Grid className="grid-item" item xs={12} md={3} lg={3} xl={3}>
                    <Card variant="outlined"  sx={{pt: 1, borderRadius: 3, p: 4}}>
                            { loading ? 
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 2}}>
                                <CircularProgress size={20}/>
                            </Box> : 
                            (<>
                            {errors.title ? <Alert color={errors.title === "Error" ? 'error': 'success'}>
                                <AlertTitle>
                                    <Typography fontWeight={'bold'} variant="body1">{errors.title}</Typography>
                                </AlertTitle>
                                {errors.body}
                            </Alert>: null}
                            <CardContent>
                                <Typography textAlign={'center'} variant="body2" fontWeight="bold" color="gray" gutterBottom>
                                    {link}
                                </Typography>
                                {iconImageLink ? (
                                <Avatar sx={{ width: 96, height: 97, mx: 'auto' }} src={iconImageLink} />
                            ) : null}
                                <CheckBusinessArguments />
                            </CardContent>
                            </>
                            )}
                            <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 1, pt: 7}}>
                                <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                                <br/>                        
                            </CardActions>
                            <Box textAlign={'center'}>
                            <IconButton onClick={() => setShowBusinessInfo(true)}>
                                <InfoOutlinedIcon fontSize="small"/>
                            </IconButton>
                            <br/>
                            <Typography variant="caption" fontWeight="bold" color="gray">Turn VPN off*</Typography>
                            </Box>

                        </Card>
                    </Grid>
                    </Slide>
                </Grid>
                </Box>

                


            <Dialog
                open={businessInfo}
                onClose={closeBusinessInfo}
                id="businessInfo"
            >
            <DialogTitle><Typography variant="h6" fontWeight={'bolder'}>Business information</Typography></DialogTitle>
            <Divider />
            <DialogContent>
                { business ? (
                    <Stack>
                        <Typography variant="caption" fontWeight={'bold'}>Name</Typography>
                        <Typography variant="subtitle2">{business.businessName} </Typography>
                        <Typography variant="caption" fontWeight={'bold'}>Address</Typography>
                        <Typography variant="subtitle2" >{business.businessAddress} </Typography>
                        <Typography variant="caption" fontWeight={'bold'}>Phone</Typography>
                        <Typography variant="subtitle2">{business.businessPhone} </Typography>
                        <Typography variant="caption" fontWeight={'bold'}>Website</Typography>
                        <Typography variant="subtitle2">{business.businessWebsite} </Typography>
                        <Typography variant="caption" fontWeight={'bold'}>Social</Typography>
                        <Stack direction={'row'} spacing={3} justifyContent={'center'}>
                            <IconButton disabled={disable} onClick={() => openSocial('INSTA')}>
                                <InstagramLogo size={25} />
                            </IconButton>
                            <IconButton disabled={disable} onClick={() => openSocial('TWIT')}>
                                <TwitterLogo size={25} />
                            </IconButton>
                            <IconButton disabled={disable} onClick={() => openSocial('FACE')}>
                                <FacebookLogo size={25} />
                            </IconButton>
                        </Stack>
                    </Stack>
                )
                : null}
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button sx={{borderRadius: 7}} variant='contained' onClick={closeBusinessInfo}>Close</Button>
            </DialogActions>
            </Dialog>
            
            </ThemeProvider>

        </>
    )
}

