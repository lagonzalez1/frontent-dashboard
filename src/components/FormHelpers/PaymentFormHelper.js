import axios from "axios";
import { getHeaders, getStateData } from "../../auth/Auth";
import { DateTime } from "luxon";



export const updateUserSubscription = (subscription_id, price_id) => {
    return new Promise((resolve, reject) => {
        const headers = getHeaders();
        const timestamp = DateTime.now().plus({days: 1}).toISO();
        axios.post('/api/internal/update-subscription', {subscription_id, price_id, timestamp}, headers)
        .then(response => {
            resolve(response)
        })
        .catch(error => {
            console.log(error);
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


export const manageUserSubscription = (customer_id) => {
    return new Promise((resolve, reject) => {
        const headers = getHeaders()
        axios.post('/api/internal/create-portal-session', {customer_id}, headers)
        .then(res => {
            resolve(res.data.link);
        })
        .catch(error => {
            console.log(error);
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

export const getUserStripeInformation = (stripe_ref) => {
    return new Promise((resolve, reject) => {
        const headers = getHeaders();
        axios.post('/api/internal/stripe_info_user', {ref: stripe_ref}, headers)
        .then(response => {
            resolve(response.data.payload);
        })
        .catch(error => {
            console.log(error);
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