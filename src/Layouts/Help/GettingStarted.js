import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import hours from "../../assets/images/hours.png";
import employees from "../../assets/images/employees-help.png";
import service from "../../assets/images/service-helper.png";
import dashboard from "../../assets/images/dashboard-help.png";
import { Card, CardContent, Container, Fade, Stack } from '@mui/material';
import { CheckCircle, Flag } from 'phosphor-react';
import { completeQuickStart } from './GettingStartedHelper';
import { setReload, setSnackbar } from '../../reducers/user';
import { useDispatch } from 'react-redux';

const steps = ['Business hours', 'Employees', 'Services & Resources', 'Start booking'];

export default function GettingStarted({close}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const dispatch = useDispatch();


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const requestQuickstartComplete = () => {
      completeQuickStart()
      .then(response => {
        dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
    })
    .catch(error => {
        dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
    })
    .finally(() => {
      close();
    })
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>
                <Typography variant='subtitle2' fontWeight={'bold'}>{label}</Typography>
                </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length - 1 ? (
        <React.Fragment>
            <Card elevation={0} sx={{pt: 1}}>
                <CardContent>
                    <Box sx={{display: 'flex', justifyContent: 'center', alignContent: 'center', pt: 2}}>
                        <Flag size={30} weight='duotone' />
                        <Typography variant='h6' fontWeight={'bold'}>You are ready!</Typography>
                    </Box>
                </CardContent>
            </Card>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={() => requestQuickstartComplete()}>Complete</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
            <Container sx={{ pt: 1, minHeight: 300}}>
          {
            activeStep === 0 ? (
            <Box sx={{ pt: 1, pl: 1, pr: 1}}>
                <Fade in={activeStep === 0 ? true: false}>
                    <Card elevation={0} sx={{pt: 1}}>
                        <CardContent sx={{minHeight: 300}}>
                            { /* <img src={hours} style={{ height: '50%', width: '100%', objectFit: 'contain' }}/>  */}
                            <Box
                                component="img"
                                sx={{
                                height: '50%',
                                display: 'block',
                                width: '100%',
                                objectFit: 'contain'
                                }}
                                src={hours}
                                alt={'Hours image'}
                            />                          
                                <React.Fragment>
                                    <Typography variant='body1'>To ensure the accuracy of your business operating hours, please visit the settings page to make any necessary final adjustments..</Typography>
                                    <Typography variant='body1'>Having accurate operating hours is crucial for your clients to successfully join your appointments and waitlist.</Typography>
                                    <Typography variant='body1' fontWeight={'bold'}>{'Settings > Closed on dates'}</Typography>
                                </React.Fragment>
                        </CardContent>
                    </Card>
                </Fade>
                
            </Box>
            ): null
          }
          {
            activeStep === 1 ? (
                <Box sx={{ pt: 1, pl: 1, pr: 1}}>
                <Fade in={activeStep === 1 ? true: false}>
                    <Card elevation={0} sx={{pt: 1}}>
                        <CardContent sx={{minHeight: 300}}>
                            <Box
                                component="img"
                                sx={{
                                height: '50%',
                                display: 'block',
                                width: '100%',
                                objectFit: 'contain'
                                }}
                                src={employees}
                                alt={'employees image'}
                            />  
                                        <React.Fragment>
                                        <Typography variant='body1'>Have your clients choose their perfered employee.</Typography>
                                        <Typography variant='body1'>In order to utilize appointments, you must have employees with services.</Typography>
                                        <Typography variant='body1' fontWeight={'bold'}>{'Settings > Employees > Add'}</Typography>
                                        </React.Fragment>
                                   
                            </CardContent>
                    </Card>
                </Fade>
                </Box>
            ): null
          }

{
            activeStep === 2 ? (
                <Box sx={{ pt: 1, pl: 1, pr: 1 }}>
                    <Fade in={activeStep === 2 ? true: false}>
                    <Card elevation={0} sx={{ pt: 1 }}>
                        <CardContent sx={{minHeight: 300}}>
                        <Box
                                component="img"
                                sx={{
                                height: '50%',
                                display: 'block',
                                width: '100%',
                                objectFit: 'contain'
                                }}
                                src={service}
                                alt={'Hours image'}
                            />                      
                            <React.Fragment>
                                <Typography variant='body1'>Add services so your clients can book.</Typography>
                                <Typography variant='body1'>Also you can assign certain services to each employee.</Typography>
                                <Typography variant='body1' fontWeight='bold'>{'Services > + icon'}</Typography>
                            </React.Fragment>
                        
                        </CardContent>
                    </Card>
                    </Fade>
                </Box>
            ): null
          }
          
          </Container>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button variant='contained' sx={{borderRadius: 7, p: 1}} onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
