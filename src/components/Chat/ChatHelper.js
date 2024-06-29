import axios from "axios";
import { getAccessToken, getHeaders, getStateData } from "../../auth/Auth";



// MISSING MIDDLEWARE

export const sendChatFromClient = (unid, message, time, direction) => {
    return new Promise((resolve, reject) => {
        axios.post('/api/external/client_chat', {unid, message, time, direction})
        .then((response) => {
            resolve(response);
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

    });
}


export const getChat = (unid) => {
    return new Promise((resolve, reject) => {
        axios.get('/api/external/chatter', { params: {unid} , timeout: 90000, timeoutErrorMessage: 'Timeout error' })
        .then((response) => {
            resolve(response.data.messages);
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

    });
}


export const getChatFromBusiness = (id, email, access_token) => {
    return new Promise((resolve, reject) => {
        const headers = { headers : { 'x-access-token': access_token} }
        axios.get('/api/internal/chatter_business', {...headers, params: { b_id: id, email}, timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
        .then((response) => {
            resolve(response);
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

    });
}


export const sendChatFromBusiness = (message, timestamp, direction, chatter_id) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const headers = getHeaders();
        const payload = { bid: business._id, email: user.email, message, timestamp, direction, chatter_id}
        axios.post('/api/internal/business_chat', payload, { ...headers, timeout: 900000, timeoutErrorMessage: 'Timeout error'})
        .then((response) => {
            resolve(response);
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
    });
}