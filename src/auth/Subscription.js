import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PermissionContext = createContext();


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
        // Need to change this on all checkers
        //                 disabled={!checkSubscription('ANALYTICS-customers')}

        2: ['WAITLIST', 'APPOINTMENTS', 'CUSTOMERS', 'ANALYTICS'],
    }
    
    const checkSubscription = (required) => {
        return subscriptions[currentSubscription].includes(required);
    };
    return (
        <PermissionContext.Provider value={{ checkSubscription }}>
            {children}
        </PermissionContext.Provider>
    );
};

export const useSubscription = () => {
  return useContext(PermissionContext);
};

