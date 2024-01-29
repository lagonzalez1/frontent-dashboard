import React, { useState, useEffect } from 'react';
import { Card,Button, Container, InputLabel, MenuItem, Select, TextField, CardActions, CardContent, Typography, CardActionArea, Box, Dialog, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NewRegister from '../Dialog/NewRegister';
import RemovePlan from '../Dialog/RemovePlan';
import { useSelector } from 'react-redux';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import StartSubscription from '../Dialog/StartSubscription';

const SubscriptionForm = () => {


  const plan = useSelector((state) => state.business.currentPlan);
  const trial = useSelector((state) => state.user.trialStatus);
  const [register, setRegister] = useState(false);
  const [cancelPlan, setCancelPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(plan);
  const [subscription, setSubcription] = useState(false);
  const [billCycle, setBillCycle] = useState(false);

  const [cardError, setCardError] = useState(null);
  const plans = {
    0: 'ID_BASIC_PLAN',
    1: 'ID_FULL_PLAN',
    2: 'ID_MED_PLAN'
  }


  useEffect(() => {
    setSelectedPlan(plan);
  }, [])

  const handleSubmit = async (event, elements, stripe) => {

  };

  const handlePlanChange = (planNumber) => {
    setSelectedPlan(planNumber)
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
        <Card sx={{ borderRadius: 4, backgroundColor: selectedPlan === 0 ? "lightgray": ""}} variant="outlined" id="waitlist">
        <CardActionArea onClick={() => handlePlanChange(0)} >
          <CardContent>
          <Typography variant='caption' color="text.secondary" gutterBottom>
              Basic
            </Typography>
            <Typography color="primary" variant="subtitle1" fontWeight={'bold'} component="div">
              Waitlist
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="secondary">
              Price: $5.99 USD
            </Typography>
            <Typography variant="body2">
              This allows you to manage an online waitlist with client reminders. 
              Add employees, resources, and services. 
            </Typography>
          </CardContent>
          </CardActionArea>
        </Card>
        <br/>
        <Card sx={{ borderRadius: 4, backgroundColor: selectedPlan === 1 ? "lightgray": ""}} variant="outlined" id="appointment">
        <CardActionArea onClick={() => handlePlanChange(1)}>
          <CardContent>
          <Typography variant='caption' color="text.secondary" gutterBottom>
              Best value
            </Typography>
            <Typography color="primary" variant="subtitle1" fontWeight={'bold'} component="div">
              Waitlist & Appointments & Customers
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="secondary">
              Price: $14.99 USD
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

        <Card sx={{ borderRadius: 4, backgroundColor: selectedPlan === 2 ? "silver": ""}} variant="outlined">
          <CardActionArea onClick={() => handlePlanChange(2)}>
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
      <StartSubscription open={subscription} onClose={onCloseSubscription}/>
    </>
  );
};

export default SubscriptionForm;
