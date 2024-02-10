import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const SubscriptionContext = createContext();


// Since the authentication is still taking place while this has completed the render. 
// currentSubscription is null and throwing an Error.
export const SubscriptionProvider = ({ children }) => {
    const currentSubscription = useSelector((state) => state.user.subscription);
    if (currentSubscription === null || currentSubscription === undefined) {
        // Return null or a loading indicator while waiting for the subscription data
        return null;
      }

    let subscriptions = {
        0: ['WAITLIST'],
        1: ['WAITLIST', 'APPOINTMENTS', 'CUSTOMERS'],
        2: ['WAITLIST', 'APPOINTMENTS', 'CUSTOMERS', 'ANALYTICS'],
    }
    
    const checkSubscription = (required) => {
        return subscriptions[currentSubscription].includes(required);
    };
    return (
        <SubscriptionContext.Provider value={{ checkSubscription }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => {
  return useContext(SubscriptionContext);
};

