import React, { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
  ElementsConsumer,
} from '@stripe/react-stripe-js';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const SubscriptionForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [selectedPlan, setSelectedPlan] = useState('');
  const [cardError, setCardError] = useState(null);

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
  };

  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.log('Error:', error);
      setCardError(error.message);
    } else {
      console.log('PaymentMethod:', paymentMethod);
      // Send paymentMethod.id to your server to complete the subscription creation
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
      <TextField label="Cardholder Name" variant="outlined" required fullWidth />

      <FormControl variant="outlined" required fullWidth>
        <InputLabel id="select-plan-label">Subscription Plan</InputLabel>
        <Select
          labelId="select-plan-label"
          value={selectedPlan}
          onChange={handlePlanChange}
          label="Subscription Plan"
        >
          <MenuItem value="plan1">Plan 1</MenuItem>
          <MenuItem value="plan2">Plan 2</MenuItem>
          {/* Add more MenuItem components for other subscription plans */}
        </Select>
      </FormControl>

      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
          },
        }}
      />
      {cardError && <p>{cardError}</p>}

      <Button type="submit" variant="contained" color="primary" disabled={!stripe}>
        Subscribe
      </Button>
    </form>
  );
};

const WrappedSubscriptionForm = () => (
  <ElementsConsumer>
    {({ elements, stripe }) => (
      <SubscriptionForm elements={elements} stripe={stripe} />
    )}
  </ElementsConsumer>
);

const StripeSubscription = () => {
  return (
    <Elements stripe={''}>
      <WrappedSubscriptionForm />
    </Elements>
  );
};

export default StripeSubscription;
