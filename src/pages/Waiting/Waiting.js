import React, {useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Swtich , Paper, Slide, Alert, Card, CardContent, Typography, Stack, Container, Button, Divider, CardActions, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions, ButtonBase, Snackbar} from "@mui/material";
import { getIdentifierData, leaveWaitlistRequest } from "./WaitingHelper.js";
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PunchClockTwoToneIcon from "@mui/icons-material/PunchClockTwoTone"
import { useNavigate } from "react-router-dom";
import "../../css/Waiting.css";
import { DateTime } from "luxon";

export default function Waiting() {

    const { link, unid } = useParams();
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);
    const [titles, setTitles] = useState({});
    const [openSnack, setOpenSnack] = useState(false);


    const closeSnack = () => {
        setOpenSnack(false);
    }

    const handleChange = () => {
        setChecked((prev) => !prev);
    } 

    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        setLoading(true);
        loadUser();
        return () => {
            setLoading(false);
        }
    }, [])


    const copyToClipboardHandler = () => {
        copyToClipboard()
        .then(() => {
            setOpenSnack(true);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const navigateToWaitlist = () => {
        navigate(`/welcome/${link}/waitlist`);
    }

    async function copyToClipboard () {
        let currentLink = window.location.href;
        if ('clipboard' in navigator){
            return await navigator.clipboard.writeText(currentLink);
        }else {
            return document.execCommand('copy', true, currentLink)
        }        
    }

    const loadUser = () => {
        const timestamp = DateTime.local().toUTC().toString();
        getIdentifierData(link, unid, timestamp)
        .then(response => {
            setTitles(response.positionTitles);
            setUser(response.client);
        })
        .catch(error => {
            setErrors('Error: ' + error);
        })
    }

    const leaveWaitlist = () => {
        leaveWaitlistRequest()
        .then(response => {
            console.log(response)
        })
        .catch(error => {

        })
    }


    return(
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3 }}>
                <Slide direction="up" in={loading} mountOnEnter unmountOnExit>
                    <Card sx={{ minWidth: 465, textAlign:'center', p: 3, borderRadius: 5, boxShadow: 0 }}>
                        <CardContent>
                            
                        { errors ? <Alert color="warning">{errors}</Alert>: null} 
                        <Typography variant="body2" fontWeight="bold" color="gray" gutterBottom>
                            {link}
                        </Typography>
                        <Stack sx={{ pt: 2}} spacing={3}>
                            <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <div className="circle_yellow">
                                    <NotificationsRoundedIcon htmlColor="#ffbb00" sx={{ fontSize: 50}} />
                                </div>
                            </Container>

                            <Typography variant="h4" fontWeight="bold" > {titles ? titles.title : ''} </Typography>
                            <Typography variant="body1" gutterBottom> {titles ? titles.desc : ''}</Typography>

                            <Button onClick={() => setOpen(true)} variant="outlined" color="error" sx={{ borderRadius: 10}}>
                                <Typography variant="body2" fontWeight="bold" sx={{color: 'black', margin: 1 }}>I'm not comming
                                </Typography>
                                </Button>
                            <Divider />
                            <Container sx={{ textAlign: 'left'}}>
                                <Typography variant="subtitle2" sx={{ color: "gray"}}> Name </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.fullname : '' }</Typography>

                                <Typography variant="subtitle2" sx={{ color: "gray"}}> Phone </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.phone : ''}</Typography>

                                <Typography variant="subtitle2" sx={{ color: "gray"}}> Email </Typography>
                                <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{user ? user.email : ''}</Typography>

                        
                            </Container>
                            
                            <Divider />
                            <Container sx={{ justifyContent: 'left',  alignItems: 'left', display: 'flex'}}>
                                <Stack direction={'row'} spacing={1}>
                                    <Button size="small" variant="info" onClick={() => copyToClipboardHandler()}>share link</Button>
                                    <Button variant="info" onClick={() => navigateToWaitlist() }> View waitlist</Button>
                                    <Button variant="info" onClick={() => setOpen(true)}> Leave waitlist</Button>
                                </Stack>
                            </Container>
                            <Divider />
                        </Stack>
                    
                    
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 7}}>
                            <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                        </CardActions>
                    </Card>
                </Slide>
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                
            >
            <DialogTitle>
                Remove myself from waitlist.  
            </DialogTitle>
            <DialogContent>
                    
                <Stack spacing={2}>
                    
                    <Button sx={{ borderRadius: 10, color: 'white'}} variant="contained" color="primary" onClick={handleClose}>No</Button>

                    <Button sx={{ borderRadius: 10}} variant="outlined" color="error" onClick={() => leaveWaitlist()}>Yes</Button>
                </Stack>
                
            </DialogContent>
            <DialogActions>
                
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