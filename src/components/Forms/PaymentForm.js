import React, { useState, useEffect } from 'react';
import { Card,Button, Container, InputLabel, MenuItem, Select, TextField, CardActions, CardContent, Typography, CardActionArea, Box, Dialog, Stack, Divider, Alert, CircularProgress, AlertTitle, Zoom, Grow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NewRegister from '../Dialog/NewRegister';
import RemovePlan from '../Dialog/RemovePlan';
import { useSelector } from 'react-redux';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import StartSubscription from '../Dialog/StartSubscription';
import axios from 'axios';
import { getHeaders } from '../../auth/Auth';
import { CURRENT_PLANS, WAITLIST_APP_ANALYTICS_PLAN, WAITLIST_APP_PLAN, WAITLIST_PLAN } from '../../static/static';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { DateTime } from 'luxon';

const SubscriptionForm = () => {

  // Plan will end up being a stripe unid and or the price_id of current plan.
  //const plan = useSelector((state) => state.business.currentPlan); // plan_id will be saved as string in db.
  const trial = useSelector((state) => state.user.trialStatus);
  const ref = useSelector((state) => state.business.stripe.ref);
  const termDate = useSelector((state) => state.business.terminating);


  const [register, setRegister] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [subscription, setSubcription] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateSub, setUpdateSubscription] = useState(false);


  const [stripe, setStripe] = useState({
    session_id: '',
    customer_id: '',
    price_id: '',
    subscription_id: '',
    active: false,
  });

  const [stripeMessage, setStripeMessage] = useState({
    title: null,
    body: null,
    severity: null
  });
  
  useEffect(() => {
    retriveStripeInformation();
  }, []);


  const retriveStripeInformation = () => {
    // Get Stripe info if exist in Stripe collections.
    setLoading(true);
    const stripeRef = ref;
    const headers = getHeaders();
    axios.post('/api/internal/stripe_info_user', {ref: stripeRef}, headers)
    .then(response => {
      if (response.data.payload) {
        setStripe(response.data.payload);
        setSelectedPlan(response.data.payload.price_id);
        setStripeMessage(response.data.payload.message);
      }

    })
    .catch(error => {
      console.log(error)
    })
    .finally(() => {
      setLoading(false);
    })
  }

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan)
  };

  const onCloseRegister = () => {
    setRegister(false);
  }
  const onCloseSubscription = () => {
    setSubcription(false);
  }

  const manageSubscription = () => {
    if (!stripe.customer_id) { return; }

    const customer_id = stripe.customer_id;
    const header = getHeaders();
    axios.post('/api/internal/create-portal-session', {customer_id}, header)
    .then(res => {
      window.location.href = res.data.link;
    })
    .catch(error => {
      console.log(error);
    })
  }


  const updateSubscription = () => {
    console.log(selectedPlan);
    console.log(stripe.price_id);
    // Handle wrongfull updates.
    if (!stripe.customer_id) { return; }
    if (selectedPlan === null) {return; }
    if (selectedPlan === stripe.price_id) { return; }
    
    const price_id = selectedPlan;
    const subscription_id = stripe.subscription_id;
    const header = getHeaders();
    axios.post('/api/internal/update-subscription', {subscription_id, price_id}, header)
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.log(error);
    })
  }


  const DisplayAccountStatus = ({title, body, severity}) => {
    return (
      <>
      <Alert severity={severity === "error" ? 'error': 'success'}>
        <AlertTitle><strong>{title}</strong></AlertTitle>
        <Stack>
          <Typography>{body}</Typography>
        </Stack>
      </Alert>
      </>
    )
  }

  const DisplayUpdateWarning = () => {
    
    return (
        <Alert severity="info" onClose={() => setUpdateSubscription(false)}>
        <AlertTitle><strong>{'Updating subscription '}</strong></AlertTitle>
        <Stack>
          <Typography variant='body2'>{`Your current subscription `} <strong>{ CURRENT_PLANS[stripe.price_id].title }</strong>{ ` will be updated to `} <strong>{ CURRENT_PLANS[selectedPlan].title }</strong> </Typography>
          *
          <Typography variant='caption'>
            By default, we prorate subscription changes. For example, if a customer signs up on May 1 for a 100 USD price, they’ll be billed 100 USD immediately. 
            If on May 15 they switch to a 200 USD price, then on June 1 they’ll be billed 250 USD (200 USD for a renewal of her subscription, plus a 50 USD prorating adjustment for half of the previous month’s 100 USD difference). 
            Similarly, a downgrade generates a credit that is applied to the next invoice.
          </Typography>
          <Button color='primary' variant='contained' onClick={() => updateSubscription()}>Accept</Button>
        </Stack>
      </Alert>
    )
  }



  return (
    <>
      <Container id="plans">
      

        <Container sx={{ width: '100%', display: 'flex', justifyContent: 'center', pb: 2}}>
          <Stack direction={'row'} spacing={1} divider={<Divider orientation="vertical" flexItem />}>
          {
            stripe && stripe.customer_id !== '' ? (
              <>
                <Button sx={{borderRadius: 10}} variant='contained' size='small' color='warning' onClick={() => setUpdateSubscription(true)} startIcon={<KeyboardArrowRightRoundedIcon/>}> Update subscription </Button>
              </>
            )
            : 
            <Button sx={{borderRadius: 10}} variant='contained' size='small' color='warning' onClick={() => setSubcription(true)} startIcon={<KeyboardArrowRightRoundedIcon/>}> Start subscription</Button>
          }
          <Button sx={{borderRadius: 10}} disabled={trial} size='small' variant='contained' color='success' onClick={() => setRegister(true)} startIcon={<AddIcon />}> add business</Button>
          <Button sx={{borderRadius: 10}} disabled={trial} size='small'  variant='contained' color='info' onClick={() => manageSubscription()} startIcon={<OpenInNewOutlinedIcon/>}>Manage Subscription</Button>
          </Stack>
        </Container>

        {

          <Box sx={{ display: 'flex', pb: 2, width: '100%'}}>
            <Stack spacing={1}>
            {stripeMessage ? <DisplayAccountStatus title={stripeMessage.title} severity={stripeMessage.severity} body={stripeMessage.body} /> : null}
            {updateSub ? ( <DisplayUpdateWarning /> ): null}
            </Stack>
          </Box>
          
        }


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

      <NewRegister open={register} onClose={onCloseRegister} />
      <StartSubscription plan={selectedPlan} open={subscription} onClose={onCloseSubscription}/>
    </>
  );
};

export default SubscriptionForm;
