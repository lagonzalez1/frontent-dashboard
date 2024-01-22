import React, { useState, useEffect } from 'react';
import { Card,Button, Container, InputLabel, MenuItem, Select, TextField, CardActions, CardContent, Typography, CardActionArea, Box, Dialog } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NewRegister from '../Dialog/NewRegister';

const SubscriptionForm = () => {

  const [register, setRegister] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [cardError, setCardError] = useState(null);
  const plans = {
    0: 'ID_BASIC_PLAN',
    1: 'ID_FULL_PLAN',
    2: 'ID_MED_PLAN'
  }

  const handleSubmit = async (event, elements, stripe) => {
    
  };

  const handlePlanChange = (planNumber) => {
    setSelectedPlan(planNumber)
  };

  const onCloseRegister = () => {
    setRegister(false);
  }

  return (
    <>
      <Container id="plans">
        <Container sx={{ width: '100%', display: 'flex', justifyContent: 'center', pb: 2}}>
          <Button onClick={() => setRegister(true)} startIcon={<AddIcon />}> add business</Button>
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
              Price: $9.99 USD
            </Typography>
            <Typography variant="body2">
              This allows you to manage an online waitlist with client reminders. 
              Add employees, resources, and services. 
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
              Price: $7.99 USD
            </Typography>
            <Typography variant="body2">
              This allows you to manage an online waitlist with client reminders. 
              Add employees, resources, and services. 
            </Typography>
          </CardContent>
          </CardActionArea>
        </Card>
      </Container>

      <NewRegister open={register} onClose={onCloseRegister} />
    </>
  );
};

export default SubscriptionForm;
