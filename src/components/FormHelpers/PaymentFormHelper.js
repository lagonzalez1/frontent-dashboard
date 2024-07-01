import axios from "axios";
import { getHeaders, getStateData } from "../../auth/Auth";
import { DateTime } from "luxon";



export const updateUserSubscription = (subscription_id, price_id, bid, email) => {
    return new Promise((resolve, reject) => {
        const timestamp = DateTime.now().plus({days: 1}).toISO();
        axios.post('/api/internal/update-subscription', {subscription_id, price_id, timestamp, email, bid}, { timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
        .then(response => {
            resolve(response)
        })
        .catch(error => {
            console.log(error);
            if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
                reject('Request timed out. Please try again later.'); // Handle timeout error
            }
            if (error.response) {
                console.log(error.response);
                reject({msg: 'Response error', error: error.response});
            }
            else if (error.request){
                console.log(error.request);
                reject({msg: 'No response from server', error: error.request})
            }
            else {
                reject({msg: 'Request setup error', error: error.message})
            }
            
        })
    })
}


export const manageUserSubscription = (customer_id, bid, email) => {
    return new Promise((resolve, reject) => {
        axios.post('/api/internal/create-portal-session', {customer_id, email, bid}, { timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
        .then(res => {
            resolve(res.data.link);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
                reject('Request timed out. Please try again later.'); // Handle timeout error
            }
            if (error.response) {
                console.log(error.response);
                reject({msg: 'Response error', error: error.response});
            }
            else if (error.request){
                console.log(error.request);
                reject({msg: 'No response from server', error: error.request})
            }
            else {
                reject({msg: 'Request setup error', error: error.message})
            }
            
        })
    })
}

export const getUserStripeInformation = (stripe_ref, bid, email) => {
    return new Promise((resolve, reject) => {
        axios.post('/api/internal/stripe_info_user', {ref: stripe_ref, email, bid}, { timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
                reject('Request timed out. Please try again later.'); // Handle timeout error
            }
            if (error.response) {
                console.log(error.response);
                reject({msg: 'Response error', error: error.response});
            }
            else if (error.request){
                console.log(error.request);
                reject({msg: 'No response from server', error: error.request})
            }
            else {
                reject({msg: 'Request setup error', error: error.message})
            }
            
        })
    })
}