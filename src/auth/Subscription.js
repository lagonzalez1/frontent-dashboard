import { DateTime } from 'luxon';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const SubscriptionContext = createContext();


// Since the authentication is still taking place while this has completed the render. 
// currentSubscription is null and throwing an Error.
export const SubscriptionProvider = ({ children }) => {
    const currentSubscription = useSelector((state) => state.user.subscription);
    console.log("Current subscription", currentSubscription);
    const termDate = useSelector((state) => state.business.terminating);
    if (currentSubscription === null || currentSubscription === undefined) {
        // Return null or a loading indicator while waiting for the subscription data
        return null;
    }
/**
 * 
 * 
 * NEEDS UPDATE: Feb 22 24
 * 
 * 
 * Issue: 99 subsciption status 99 needs to prevent user from making any types of changes. Only allow user to view data (Customers, Analytics);
 * Sol: Each editable page and component needs to be provisioned.
 * 
 */

    let subscriptions = {
        99: ['CANCELLED'],
        0: ['WAITLIST'],
        1: ['WAITLIST', 'APPOINTMENTS', 'CUSTOMERS'],
        2: ['WAITLIST', 'APPOINTMENTS', 'CUSTOMERS', 'ANALYTICS'],
    }
    
    const checkSubscription = (required) => {
        return subscriptions[currentSubscription].includes(required);
    };


    const cancelledSubscription = () => { return currentSubscription === 99 ? true: false }


    return (
        <SubscriptionContext.Provider value={{ checkSubscription, cancelledSubscription }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => {
  return useContext(SubscriptionContext);
};

