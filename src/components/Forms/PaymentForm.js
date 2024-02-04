import React, { useState, useEffect } from 'react';
import { Card,Button, Container, InputLabel, MenuItem, Select, TextField, CardActions, CardContent, Typography, CardActionArea, Box, Dialog, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NewRegister from '../Dialog/NewRegister';
import RemovePlan from '../Dialog/RemovePlan';
import { useSelector } from 'react-redux';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import StartSubscription from '../Dialog/StartSubscription';
import axios from 'axios';
import { getHeaders } from '../../auth/Auth';
import { WAITLIST_APP_ANALYTICS_PLAN, WAITLIST_APP_PLAN, WAITLIST_PLAN } from '../../static/static';

const SubscriptionForm = () => {


  // Plan will end up being a stripe unid and or the price_id of current plan.
  const plan = useSelector((state) => state.business.currentPlan); // plan_id will be saved as string in db.
  const trial = useSelector((state) => state.user.trialStatus);
  const [register, setRegister] = useState(false);
  const [cancelPlan, setCancelPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(plan);
  const [subscription, setSubcription] = useState(false);

  const [success, setSuccess] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [billCycle, setBillCycle] = useState(false);

  const [cardError, setCardError] = useState(null);

  const plans = {
    0: 'ID_BASIC_PLAN',
    1: 'ID_FULL_PLAN',
    2: 'ID_MED_PLAN'
  }


  useEffect(() => {
    // I will need to retrive the status of the subscriptions.
    // 
    setSelectedPlan(plan);
  }, [])

  const handleSubmit = async (event, elements, stripe) => {

  };

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan)
  };

  const onCloseRegister = () => {
    setRegister(false);
  }

  const handleCancelPlan = () => {
    setCancelPlan(true);
  }
  const onCloseCancel = () => {
    setCancelPlan(false);
  }

  const onCloseSubscription = () => {
    setSubcription(false);
  }

  const manageSubscription = (sessionId) => {
    const header = getHeaders();
    axios.post('/create-portal-session', {sessionId}, header)
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.log(error);
    })
  }



  // Once a sessionId exist and or customerId this will be available for the user to change/ update
  // That is the user has already managed or subscribed.
  const SuccessDisplay = ({sessionId}) => {
    return (
      <Container>
        <Typography variant='subtitle1' fontWeight={'bold'}>Subscription plan details.</Typography>
        <Button variant='contained' onChange={() => manageSubscription(sessionId)}></Button>
      </Container>
    )
  }


  // This will check if a redirect back to this page exist.
  // This should only trigger once a new user subscribes or new user. 
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('successs')) {
      setSuccess(true);
      setSessionId(query.get('session_id'));

    }
    if (query.get('cancelled')) {
      setSuccess(false);
      setSessionId('');

    }
  }, [sessionId])





  return (
    <>
      <Container id="plans">
        <Container sx={{ width: '100%', display: 'flex', justifyContent: 'center', pb: 2}}>
          <Stack direction={'row'} spacing={1}>
          <Button sx={{borderRadius: 10}} variant='contained' color='warning' onClick={() => setSubcription(true)} startIcon={<KeyboardArrowRightRoundedIcon/>}> Start subscription</Button>
          <Button sx={{borderRadius: 10}} disabled={trial} variant='contained' color='success' onClick={() => setRegister(true)} startIcon={<AddIcon />}> add business</Button>
          <Button sx={{borderRadius: 10}} disabled={trial}  variant='contained' color='info' onClick={() => setBillCycle(true)} startIcon={<ReceiptLongRoundedIcon/>}> View bill cycle</Button>
          </Stack>
        </Container>
        <Card sx={{ borderRadius: 4, backgroundColor: selectedPlan === WAITLIST_PLAN ? "lightgray": ""}} variant="outlined" id="waitlist">
        <CardActionArea onClick={() => handlePlanChange(WAITLIST_PLAN)} >
          <CardContent>
          <Typography variant='caption' color="text.secondary" gutterBottom>
              Basic
            </Typography>
            <Typography color="primary" variant="subtitle1" fontWeight={'bold'} component="div">
              Waitlist
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="secondary">
              Price: $6.99 USD
            </Typography>
            <Typography variant="body2">
              This allows you to manage an online waitlist with client reminders. 
              Add employees, resources, and services. 
            </Typography>
          </CardContent>
          </CardActionArea>
        </Card>
        <br/>
        <Card sx={{ borderRadius: 4, backgroundColor: selectedPlan === WAITLIST_APP_ANALYTICS_PLAN ? "lightgray": ""}} variant="outlined" id="appointment">
        <CardActionArea onClick={() => handlePlanChange(WAITLIST_APP_ANALYTICS_PLAN)}>
          <CardContent>
          <Typography variant='caption' color="text.secondary" gutterBottom>
              Best value
            </Typography>
            <Typography color="primary" variant="subtitle1" fontWeight={'bold'} component="div">
              Waitlist & Appointments & Customers
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="secondary">
              Price: $15.99 USD
            </Typography>
            <Typography variant="body2">
              This allows you to manage an online waitlist with client reminders. 
              Add employees, resources, and services. 
              Also, you will also be able to manage business analytics and metrics.
            </Typography>
          </CardContent>
          </CardActionArea>
        </Card>
        <br/>

        <Card sx={{ borderRadius: 4, backgroundColor: selectedPlan === WAITLIST_APP_PLAN ? "silver": ""}} variant="outlined">
          <CardActionArea onClick={() => handlePlanChange(WAITLIST_APP_PLAN)}>
          <CardContent>
            <Typography variant='caption' color="text.secondary" gutterBottom>
              Good
            </Typography>
            <Typography color="primary" variant="subtitle1" fontWeight={'bold'} component="div">
              Waitlist & appointments 
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="secondary">
              Price: $9.99 USD
            </Typography>
            <Typography variant="body2">
              This allows you to manage an online waitlist and appointments with client reminders. 
              Add employees, resources, and services. 
            </Typography>
          </CardContent>
          </CardActionArea>
        </Card>
      </Container>
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1}}>
        <Button variant="text" onClick={() => handleCancelPlan()}>Cancel</Button>
      </Box>

      <RemovePlan open={cancelPlan} onClose={onCloseCancel} />
      <NewRegister open={register} onClose={onCloseRegister} />
      <StartSubscription plan={selectedPlan} open={subscription} onClose={onCloseSubscription}/>
    </>
  );
};

export default SubscriptionForm;
