import React, { useEffect, useState } from "react";
import { Box, Container, Button, Link, Typography, Avatar, Grow, Stack, CircularProgress, Alert, Switch, FormControl, FormControlLabel, IconButton, Divider} from "@mui/material"
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import UploadIcon from '@mui/icons-material/Upload';
import { getAccessToken, getStateData } from "../../auth/Auth";
import { useTheme } from "../../theme/ThemeContext";
import { usePermission } from "../../auth/Permissions";
import { setSnackbar } from '../../reducers/user';
import { useSubscription } from "../../auth/Subscription";
import { LoadingButton } from "@mui/lab";
import { Lock, QrCode } from "phosphor-react";
import { Close } from "@mui/icons-material";
import { payloadAuth } from "../../selectors/requestSelectors";

export default function Personalization ({reloadPage}) {

    const { theme, updateTheme } = useTheme();
    const { checkPermission } = usePermission();

    const {cancelledSubscription } = useSubscription();
    const link = useSelector((state) => state.business.publicLink);
    const imageRef = useSelector((state) => state.business.settings.profileImage);
    const dispatch = useDispatch();
    const {id, bid, email} = useSelector((state) => payloadAuth(state));

    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    const [currentTheme, setTheme] = useState(theme);


    const [checked, setChecked] = useState(false);
    const [publicLink, setPublicLink] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (imageRef){
            getCurrentProfileImage();
        }
        if (link) {
            const fullLink = "https://waitonline.us/welcome/" + link;
            setPublicLink(fullLink)
        }   
    }, [])

    
    const generateQRCode = () => {
        setChecked(!checked);
    }


    const getCurrentProfileImage = () => {

        const config = {
            headers : {
                'Content-type': 'multipart/form-data'
            },
            timeout: 90000,
            timeoutErrorMessage: 'Timeout error'
        }
        axios.get('/api/internal/get_profile_image', {...config, params: {id: imageRef, email, bid},  timeout: 90000, timeoutErrorMessage: 'Timeout error.' })
        .then(response => {
            if (response.status === 200) {
                setProfileImage(response.data);
                return;
            }
        })
        .catch(error => {
            console.log(error);
            if (error.response) {
                dispatch(setSnackbar({requestMessage:'Response error', requestStatus: true}) );
            }
            else if (error.request){
                dispatch(setSnackbar({requestMessage:'No response from server', requestStatus: true}) );
            }
            else {
                dispatch(setSnackbar({requestMessage:'Request setup error', requestStatus: true}) );
            }
        })
        .finally(() => {
            setLoading(false);
        })
    }

    function handleThemeChange (e) {
        const change = e.target.checked;
        setTheme(change === true? 'light':'dark');
        updateTheme(change === true ? 'light': 'dark');

    }

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                setImage((prev) => ({
                    ...prev,
                    image: e.target.result,
                    name: event.target.files[0].name
                }))
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }
    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    const uploadImage = () => {
        const config = {
            headers : {
                'Content-type': 'multipart/form-data'
            },
            timeout: 90000,
            timeoutErrorMessage: 'Timeout error'
        }
        
        const formData = new FormData();
        const file = dataURLtoBlob(image.image);
        formData.append('profile_image', file, image.name);
        formData.append('b_id', bid)
        formData.append('profileImage', imageRef ? imageRef: null);
        formData.append('email', email);
        setLoading(true);
        axios.post('/api/internal/upload_profile_image', formData, config)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.data.msg, requestStatus: true}))
        })
        .catch(error => {
            console.log(error);
            if (error.response) {
                dispatch(setSnackbar({requestMessage:'Response error', requestStatus: true}) );
            }
            else if (error.request){
                dispatch(setSnackbar({requestMessage:'No response from server', requestStatus: true}) );
            }
            else {
                dispatch(setSnackbar({requestMessage:'Request setup error', requestStatus: true}) );
            }
        })
        .finally(() => {
            setLoading(false);
            reloadPage();
        })
        
    }

    return (
        <>
            <Box>
                { error ? (
                    <Alert
                    action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setError(null);
                        }}
                        >
                            <Close fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                    >
                    {error}
                    </Alert>
                ): null}

                <Typography variant="subtitle2" fontWeight={'bold'}>Dashboard theme</Typography>
                <FormControlLabel
                    control={<Switch color="warning" checked={currentTheme === "light"? true: false} onChange={handleThemeChange} name={'Theme'} />}
                    label={currentTheme === "light" ? "Light" : "Dark"}
                />
                <br/>

                <Typography variant="subtitle2" fontWeight={'bold'}>Generate QR code</Typography>
                <Button startIcon={<QrCode size={20} />} size="small" sx={{borderRadius: 5, textTransform: 'lowercase', fontWeight: 'bold'}} variant="outlined" onClick={() => generateQRCode()}>QR code</Button>
                <Box sx={{ display: 'flex' }}>
                    <Grow in={checked}>
                    <div id='QR_code' style={{ height: checked ? 'auto': 0,  maxWidth: 100, width: "100%" }}>
                        <br/>
                        {publicLink ? 
                        <QRCode 
                            value={publicLink}
                            size={256}
                            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                            viewBox={`0 0 256 256`}
                        />: null}
                        <br/>
                        {publicLink ? <Link href={publicLink}>{publicLink}</Link> : null }
                    </div>
                    </Grow>
                </Box>
                <br/>
                
                <Typography variant="subtitle2" fontWeight={'bold'}>Add a icon to your waitlist welcome screen</Typography>
                <Stack direction={'row'} spacing={1}>
                    { profileImage &&  (
                        <>
                            <Stack spacing={1} direction={'row'} sx={{ alignItems: 'center'}}>
                            <Avatar alt="Remy Sharp" src={profileImage} sx={{ width: 72, height: 72 }}/>
                            <Typography variant="body2" fontWeight={'bold'}>Current</Typography>
                            </Stack>
                            
                        </>
                    ) }
                    { image && ( 
                    <>
                    <Stack spacing={1} direction={'row'} sx={{ alignItems: 'center'}}>
                        <Avatar alt="Remy Sharp" src={image.image} sx={{ width: 72, height: 72 }} /> 
                        <Typography variant="body2" fontWeight={'bold'}>New</Typography>
                    </Stack>
                    </> 
                    )}
                </Stack>
                
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-input"
                    type="file"
                    onChange={onImageChange}
                />
                <label htmlFor="image-input">
                    <Button
                    variant="contained"
                    component="span" ss
                    sx={{borderRadius: 5, textTransform: 'lowercase', fontWeight: 'bold'}}
                    startIcon={<UploadIcon />}
                    disabled={!checkPermission('PERS_IMG') ? true: false}
                    >
                    Upload Image
                    </Button>
                </label>
                <br/>
                {image ? 
                (
                <>
                <LoadingButton fullWidth={false} loading={loading} disabled={!checkPermission('PERS_IMG') || cancelledSubscription()} sx={{borderRadius: 5, textTransform: 'lowercase', fontWeight: 'bold'}} variant="outlined" onClick={() => uploadImage()}>Save</LoadingButton>
                </>)
                : null}

                <Box sx={{pt: 2}}>
                    <Typography variant="subtitle2" fontWeight={'bold'}>Welcome screen theme</Typography>
                    <Stack direction={'row'}>
                        <Typography variant="body2">
                            coming soon 
                        </Typography>
                        <Lock size={20}/>

                    </Stack>
                </Box>
        
            </Box>
            
        </>
    )
}