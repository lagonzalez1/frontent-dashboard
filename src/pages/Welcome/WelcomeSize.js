import React, { useEffect, useState } from "react";
import { Box, Container, Button, Typography, Card, CardActions, CardContent, 
    Fade, CircularProgress, Stack, ToggleButtonGroup, ToggleButton, IconButton, Zoom, TextField, ThemeProvider, paperClasses, 
    Grid,
    Grow,
    Collapse,
    Slide,
    Alert,
    AlertTitle} from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { allowClientJoin, getBusinessServeMax, getMax, isBusinesssOpen, requestBusinessArguments} from "./WelcomeHelper";
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import { CLIENT } from "../../static/static";
import "../../css/Welcome.css";
import { ClientWelcomeTheme } from "../../theme/theme";
import {
    Unstable_NumberInput as BaseNumberInput,
    numberInputClasses,
  } from '@mui/base/Unstable_NumberInput';
  import { styled } from '@mui/system';
  
  const NumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
    return (
      <BaseNumberInput
        slots={{
          root: StyledInputRoot,
          input: StyledInputElement,
          incrementButton: StyledButton,
          decrementButton: StyledButton,
        }}
        slotProps={{
          incrementButton: {
            children: '▴',
          },
          decrementButton: {
            children: '▾',
          },
        }}
        {...props}
        ref={ref}
      />
    );
  });



export default function WelcomeSize() {

    const { link } = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [size,setSize] = useState(1);
    const [disable, setDisable] = useState(false);

    const [maxSize, setMaxSize] = useState(0);
    const [errors, setErrors] = useState({title: null, body: null});
    const [zoomIntoView, setZoomIntoView] = useState(false);


    const navigate = useNavigate();


    const setDataAndContinue = () => {
        const object = {
            partySize: size
        }
        sessionStorage.setItem(CLIENT, JSON.stringify(object));
        setZoomIntoView(false);
        navigate(`/welcome/${link}/selector`);
    }

    const getAnySavedFields = () => {
        const user = sessionStorage.getItem(CLIENT);
        if (user) {
            let userObject = JSON.parse(user);
            if (userObject.partySize) {
                setSize(userObject.partySize);
            }
            return;
        }
    }
    
    useEffect(() => {
        getAnySavedFields();
        getBusinessData();
        return() => {
            setLoading(false);
        }
    }, [loading]);


    const getBusinessData = () => {
        const time = DateTime.local().toISO();
        Promise.all([
            isBusinesssOpen(link, time),
            getBusinessServeMax(link)
        ])
        .then(([businessOpenResponse, businessMaxResponse]) => {
            if (businessOpenResponse.isOpen === false && businessOpenResponse.acceptingAppointments === false) { 
                setDisable(true);
                setErrors({title: 'Error', body: 'Business is currently not accepting request.'});
                return;
            }
            setDisable(false);
            setMaxSize(businessMaxResponse.serveMax);
            
        })
        .catch(error => {
            if (error.response.status === 404) {
                navigate(`/welcome/${link}`);
            }
            else {
                setErrors({title: 'Error', body: 'Business is currently not accepting request.'});
            }
        })
        .finally(() => {
            setZoomIntoView(true);
        })
    }

   
   
    const handleChange = (event, value) => {
        if (value === 6){
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

        <ThemeProvider theme={ClientWelcomeTheme}>
            <Box className="center-box">
                <Grid 
                    container
                    sx={{pt: 2}}
                    spacing={1}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"                      
                >
                <Slide direction="down" in={zoomIntoView} mountOnEnter unmountOnExit>
                <Grid className="grid-item" item xs={12} md={4} lg={4} xl={4}>
                <Card className="wcard" variant="outlined" sx={{pt: 1, borderRadius: 5, p: 3}}>
                    <Container sx={{}}>
                        <IconButton onClick={ () => redirectBack() }>
                            <KeyboardBackspaceIcon textAlign="left" fontSize="small"/>
                        </IconButton>
                    </Container>
                    {errors.title ? (
                        <Alert variant="filled" color={errors.title === "Error" ? 'error': 'warning'}>
                            <AlertTitle>{errors.title}</AlertTitle>
                            - {errors.body}
                        </Alert>
                    ) : null}
                    <CardContent>
                        <Typography variant="body2" fontWeight="bold" color="gray" textAlign={'center'} gutterBottom>
                            {link}
                        </Typography>
                        <Typography variant="h4" fontWeight="bolder" textAlign={'center'}>
                            Party size
                        </Typography>
                        <Typography variant="body2" fontWeight={'normal'} textAlign={'center'}>
                            Is anyone joining you ?
                        </Typography>

                        <Stack direction='row' spacing={2} sx={{ pt: 5, p: 2}}>
                        <ToggleButtonGroup
                            value={size}
                            onChange={handleChange}
                            fullWidth={true}
                            exclusive
                            size="large"
                            >
                            {Array(6).fill().map((_, index) => (
                                <ToggleButton
                                value={index+1}
                                key={index+1}                               
                                >
                                    <strong>{index + 1}{index === 5 ? '+' : ''}</strong>
                                </ToggleButton>
                            ))}
                            </ToggleButtonGroup>
                            
                        </Stack>


                        <Box sx={{ display: 'flex', pt: 2, height: open ? 'auto' : 0, justifyContent: 'center' }}>
                            <Fade in={open}>
                            <NumberInput
                                aria-label="party-size"
                                placeholder="Party size"
                                value={size}
                                onChange={(event, val) => setSize(val)}
                                max={maxSize}
                                min={6}
                                />
                            </Fade>
                        </Box>

                        
                        <Container sx={{ pt: 2}}>
                            <Button disabled={disable} fullWidth={true} sx={{p: 1, borderRadius: 10}} variant="contained" color="primary" onClick={() => setDataAndContinue()}>
                                <Typography variant="body2" fontWeight="bold" sx={{color: 'white', margin: 1 }}>
                                    Next
                                </Typography>
                            </Button> 
                        </Container>
                                    
                    </CardContent>


                    <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 7}}>
                        <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                    </CardActions>
                </Card>
                </Grid>
                </Slide>
                    

                </Grid>
            </Box>
        </ThemeProvider>

        </>
    )
}
const blue = {
    100: '#DAECFF',
    200: '#80BFFF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
  };
  
  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };
  
  const StyledInputRoot = styled('div')(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 400;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    display: grid;
    grid-template-columns: 1fr 19px;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
    column-gap: 8px;
    padding: 4px;
  
    &.${numberInputClasses.focused} {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );
  
  const StyledInputElement = styled('input')(
    ({ theme }) => `
    font-size: 0.875rem;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.5;
    grid-column: 1/2;
    grid-row: 1/3;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: inherit;
    border: none;
    border-radius: inherit;
    padding: 8px 12px;
    outline: 0;
  `,
  );
  
  const StyledButton = styled('button')(
    ({ theme }) => `
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    appearance: none;
    padding: 0;
    width: 19px;
    height: 19px;
    font-family: system-ui, sans-serif;
    font-size: 0.875rem;
    line-height: 1;
    box-sizing: border-box;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 0;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
      cursor: pointer;
    }
  
    &.${numberInputClasses.incrementButton} {
      grid-column: 2/3;
      grid-row: 1/2;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border: 1px solid;
      border-bottom: 0;
      &:hover {
        cursor: pointer;
        background: ${blue[400]};
        color: ${grey[50]};
      }
  
    border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    }
  
    &.${numberInputClasses.decrementButton} {
      grid-column: 2/3;
      grid-row: 2/3;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border: 1px solid;
      &:hover {
        cursor: pointer;
        background: ${blue[400]};
        color: ${grey[50]};
      }
  
    border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    }
    & .arrow {
      transform: translateY(-1px);
    }
  `,
  );