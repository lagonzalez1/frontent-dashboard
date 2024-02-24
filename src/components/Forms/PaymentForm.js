import React, { useState, useEffect } from 'react';
import { Card,Button, Container, InputLabel, MenuItem, Select, TextField, CardActions, CardContent, Typography, CardActionArea, Box, Dialog, Stack, Divider, Alert, CircularProgress, AlertTitle } from '@mui/material';
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
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { DateTime } from 'luxon';

const SubscriptionForm = () => {

  // Plan will end up being a stripe unid and or the price_id of current plan.
  //const plan = useSelector((state) => state.business.currentPlan); // plan_id will be saved as string in db.
  const trial = useSelector((state) => state.user.trialStatus);
  const ref = useSelector((state) => state.business.stripe.ref);


  const stripeIssues = useSelector((state) => state.business.stripe.issue);
  const stripeTitle = useSelector((state) => state.business.stripe.message.title);
  const stripeBody = useSelector((state) => state.business.stripe.message.body);
  const stripeSeverity = useSelector((state)=> state.business.stripe.message.severity);
  const stripeActive = useSelector((state) => state.business.stripe.active);
  const term_date = useSelector((state) => state.business.terminating);

    
  const [register, setRegister] = useState(false);
  const [cancelPlan, setCancelPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscription, setSubcription] = useState(false);
  const [loading, setLoading] = useState(false);

  const [stripe, setStripe] = useState({
    session_id: '',
    customer_id: '',
    product_id: '',
    subscription_id: ''
  })
  

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
        handlePlanChange(response.data.payload.product_id);
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

  const handleCancelPlan = () => {
    setCancelPlan(true);
  }
  const onCloseCancel = () => {
    setCancelPlan(false);
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


  const DisplayAccountStatus = ({active}) => {
    if (active) {
      return (
        <>
        <Alert severity={stripeSeverity}>
          <AlertTitle><strong>{stripeTitle}</strong></AlertTitle>
          <Stack>
            <Typography> <strong>Active:</strong> {stripeActive ? 'True': 'False'} </Typography>                  
            <Typography>{stripeBody}</Typography>
          </Stack>
        </Alert>
        
        </>
      )
    }
    else {
      return (
        <>
        <Alert severity={'error'}>
          <AlertTitle><strong>{stripeTitle}</strong></AlertTitle>
          <Stack>
            <Typography>{stripeBody}</Typography>
            <Typography>{`Your account is set to be terminated on ${DateTime.fromISO(term_date).toLocaleString()}.`}</Typography>
          </Stack>
        </Alert>

        </>
      )
    }
  }



  return (
    <>
      <Container id="plans">
      

        <Container sx={{ width: '100%', display: 'flex', justifyContent: 'center', pb: 2}}>
          <Stack direction={'row'} spacing={1} divider={<Divider orientation="vertical" flexItem />}>
          <Button sx={{borderRadius: 10}} variant='contained' size='small' color='warning' onClick={() => setSubcription(true)} startIcon={<KeyboardArrowRightRoundedIcon/>}> Start subscription</Button>
          <Button sx={{borderRadius: 10}} disabled={trial} size='small' variant='contained' color='success' onClick={() => setRegister(true)} startIcon={<AddIcon />}> add business</Button>
          <Button sx={{borderRadius: 10}} disabled={trial} size='small'  variant='contained' color='info' onClick={() => manageSubscription()} startIcon={<OpenInNewOutlinedIcon/>}>Manage Subscription</Button>
          </Stack>
        </Container>

        {

          <Box sx={{ display: 'flex', pb: 2, width: '100%'}}>
          <DisplayAccountStatus active={stripeActive}/>
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
