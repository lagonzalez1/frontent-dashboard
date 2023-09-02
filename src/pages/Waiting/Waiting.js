import React, {useState, useEffect } from "react";
import { Box, Swtich , Paper, Slide, Alert, Card, CardContent, Typography, Stack, Container, Button, Divider, CardActions,
    AlertTitle, Dialog, DialogContent, DialogTitle, RadioGroup, FormControlLabel, Radio, DialogActions, ButtonBase, Snackbar, CircularProgress, Link, 
Collapse, IconButton, DialogContentText} from "@mui/material";
import { getIdentifierData, leaveWaitlistRequest, requestBusinessArguments, requestClientStatus } from "./WaitingHelper.js";
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PunchClockTwoToneIcon from "@mui/icons-material/PunchClockTwoTone"
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import CloseIcon from "@mui/icons-material/Close";
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { useNavigate, useParams } from "react-router-dom";
import "../../css/Waiting.css";
import { DateTime } from "luxon";

export default function Waiting() {

    const { link, unid } = useParams();
    const navigate = useNavigate();
    
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState(null);


    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);
    const [titles, setTitles] = useState({});
    const [status, setStatus] = useState(false);

    const [openStatus, setOpenStatus ] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [args, setArgs] = useState(null);

    const [clientStatus, setClientStatus] = useState({
        here: false,
        parking: false,
        late: false
    })


    function isOnlyOneTrue(obj) {
        const trueValues = Object.values(obj).filter(value => value === true);
        return trueValues.length === 1;
      }

    const closeSnack = () => {
        setOpenSnack(false);
    }


    const handleClose = () => {
        setOpen(false);
    }

    const handleStatusClose = () => {
        setOpenStatus(false);
        setClientStatus({here: false, parking: false, late: false});
    }

    useEffect(() => {
        loadUserAndBusinessArgs();
    }, []);
    
    const loadUserAndBusinessArgs = () => {
        setLoading(true);
        const timestamp = DateTime.local().toUTC();
        Promise.all([
            getIdentifierData(link, unid, timestamp),
            requestBusinessArguments(link)
        ])
        .then(([userResponse, argsResponse]) => {
            if (userResponse.status === 201) {
                setErrors(userResponse.data.msg);
                setUser({});
            } else if (userResponse.status === 200) {
                setTitles(userResponse.data.positionTitles);
                setUser(userResponse.data.client); 
                setStatus(userResponse.data.statusTrigger); 
            }
            setArgs(argsResponse);
        })
        .catch(error => {
            setErrors('Error: ' + error);
        })
        .finally(() => {
            setLoading(false);
        });
    };
    


    const copyToClipboardHandler = () => {
        copyToClipboard()
        .then(() => {
            setOpenSnack(true);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            setLoading(false);
        })
    }

    const navigateToWaitlist = () => {
        if (args.present.waitlist === true) {
            navigate(`/welcome/${link}/waitlist`);
        }
        else {
            setAlert(true);
            setMessage('Waitlist is currently disabled for this business.');
        }
    }

    async function copyToClipboard () {
        let currentLink = window.location.href;
        if ('clipboard' in navigator){
            return await navigator.clipboard.writeText(currentLink);
        }else {
            return document.execCommand('copy', true, currentLink)
        }        
    }

    

    const leaveWaitlist = () => {
        leaveWaitlistRequest(link, unid)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            handleClose();
        })
    }


    const statusRequest = () =>{
        if (!isOnlyOneTrue(clientStatus)){
            handleStatusClose();
            setAlert(true);
            setMessage('Please only select one status button.');
            return;
        }
        const payload = { unid, link, ...clientStatus}
        requestClientStatus(payload)
        .then(response => {
            setMessage(response);
        })
        .catch(error => {
            setMessage(error)
        })
        .finally(() => {
            setAlert(true);
            handleStatusClose();
        })


    }



    return(
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3, pl: 2, pr: 2 }}>
                    <Card sx={{ minWidth: 350, maxWidth: 475, textAlign:'center', p: 2, borderRadius: 5, boxShadow: 0 }}>
                        
                    <Box sx={{ width: '100%' }}>
                    <Collapse in={alert}>
                        <Alert
                        action={
                            <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setAlert(false);
                                setMessage(null);
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        >
                        {message}
                        </Alert>
                    </Collapse>
                    
                    </Box>


                        <Typography variant="body2" fontWeight="bold" color="gray" gutterBottom>
                            <Link underline="hover" href={`/welcome/${link}`}>{link}</Link>
                        </Typography>
                        {loading ? <CircularProgress /> : 
                        <CardContent>
                            
                        { errors ? <Alert severity="error">
                            <AlertTitle sx={{ textAlign: 'left', fontWeight: 'bold'}}>Error</AlertTitle>
                            <Typography sx={{ textAlign: 'left'}}>{errors}</Typography>
                            </Alert>: null} 
                        
                        <Stack sx={{ pt: 2}} spacing={3}>
                            
                            <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                {errors ? 
                                (
                                <div className="circle_red">
                
                                    <PriorityHighIcon htmlColor="#fc0303" sx={{ fontSize: 50}} />
                                </div>
                                ): 
                                (
                                <div className="circle_yellow">
                                    
                                    <NotificationsRoundedIcon htmlColor="#ffbb00" sx={{ fontSize: 50}} />
                                </div>
                                )
                                }
                            </Container>
                            

                            <Typography variant="h4" fontWeight="bold" > {titles ? titles.title : ''} </Typography>
                            <Typography variant="body2"> {titles ? titles.desc : ''}</Typography>
                            
                            {
                                status ? (
                                <>
                                <Divider />
                                <Button onClick={() => setOpenStatus(true)} variant="outlined" color="success" sx={{ borderRadius: 10}}>
                                    <Typography variant="body2" fontWeight="bold" sx={{color: 'black', margin: 1 }}>Status
                                    </Typography>
                                </Button>
                                </>
                                ) : 
                                <>
                                <Button disabled={errors ? true: false} onClick={() => setOpen(true)} variant="outlined" color="error" sx={{ borderRadius: 10}}>
                                    <Typography  variant="body2" fontWeight="bold" sx={{color: 'black', margin: 1 }}>I'm not comming
                                    </Typography>
                                </Button>
                                </>
                            }

                            <Divider />
                            {errors ? (null) : 
                            <Container sx={{ textAlign: 'left'}}>
                                <Typography variant="subtitle2" sx={{ color: "gray"}}> Name </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.fullname : '' }</Typography>

                                <Typography variant="subtitle2" sx={{ color: "gray"}}> Phone </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.phone : ''}</Typography>

                                <Typography variant="subtitle2" sx={{ color: "gray"}}> Email </Typography>
                                <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{user ? user.email : ''}</Typography>
                            </Container>
                            }
                            
                            <Divider />
                            <Container sx={{ justifyContent: 'left',  alignItems: 'left', display: 'flex'}}>
                                <Stack direction={'row'} spacing={1}>
                                    <Button disabled={errors ? true: false} size="small" variant="info" onClick={() => copyToClipboardHandler()}>share link</Button>
                                    <Button disabled={errors ? true: false} variant="info" onClick={() => navigateToWaitlist() }> View waitlist</Button>
                                    <Button disabled={errors ? true: false} variant="info" onClick={() => setOpen(true)}> Leave waitlist</Button>
                                </Stack>
                            </Container>
                            <Divider />
                        </Stack>
                    
                    
                        </CardContent>
                        }
                        <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 2}}>
                            <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                        </CardActions>
                    </Card>
            </Box>

            <Dialog
                id="leave_dialog"
                open={open}
                onClose={handleClose}
                maxWidth={'xs'}
            >
            <DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" fontWeight={'bold'}>Leave waitlist ?</Typography>  
            </DialogTitle>
            <DialogContent>
                <Typography variant="caption">This means that you will no longer receive notifications or updates regarding your position in the queue.</Typography>  
                <Container sx={{pt: 2, pb: 2, pr: 2, pl: 2}}>
                    <Stack spacing={2}>
                        <Button sx={{ borderRadius: 15}} variant="contained" color="primary" onClick={handleClose}>No</Button>
                        <Button sx={{ borderRadius: 15}} variant="outlined" color="error" onClick={() => leaveWaitlist()}>Yes</Button>
                    </Stack>
                </Container>
            </DialogContent>
            <DialogActions>
                
            </DialogActions>
            </Dialog>

            <Dialog
                id="status_dialog"
                open={openStatus}
                onClose={handleStatusClose}
                minWidth={'xs'}
                maxWidth={'sm'}
            >
            <DialogTitle>
                <Typography variant="h6" fontWeight={'bold'}>Set status</Typography>  
                <IconButton
                    aria-label="close"
                    onClick={handleStatusClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Divider />
                <DialogContentText>
                    <Typography variant="body2" gutterBottom>Let us know where you are at!</Typography>  
                </DialogContentText>
                
                <Container sx={{ width: '100%'}}>
                <Stack spacing={2}>
                    <Button size="large" color="primary" sx={{ borderRadius: 10}} variant={clientStatus.late ? "contained" : "outlined"} startIcon={<WatchLaterIcon /> } onClick={() => setClientStatus((prev) => ({...prev, late: !clientStatus.late})) }>Late</Button>
                    <Button size="large"  color="primary"sx={{ borderRadius: 10}} variant={clientStatus.here ? "contained" : "outlined"}  startIcon={<EmojiPeopleIcon /> } onClick={() => setClientStatus((prev) => ({...prev, here: !clientStatus.here})) }>Here</Button>
                    <Button size="large"  color="primary" sx={{ borderRadius: 10}} variant={clientStatus.parking ? "contained" : "outlined"}  startIcon={<DirectionsCarFilledIcon /> } onClick={() => setClientStatus((prev) => ({...prev, parking: !clientStatus.parking})) }>Parking</Button>
                </Stack>
                </Container>
            </DialogContent>
            <DialogActions>
                <Button sx={{ borderRadius: 10, color: 'black'}} variant="text" onClick={() => statusRequest() }>Update</Button>
            </DialogActions>
            </Dialog>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
                open={openSnack}
                onClose={closeSnack}
                autoHideDuration={3000}
                message={'Copied to clipboard.'}
            >
            </Snackbar>
            
        
        </>
    )
}