

import axios from "axios";



export const getIdentifierData = (link, unid) => {
    return new Promise((resolve, reject) => {
        axios.get('/api/external/identifierRequest',{ params: {link, unid} } )
        .then(response => {
            resolve(response);
        })
        .catch(error => {
            reject(error);
        })
    });
}


export const requestClientStatus = (payload) => {
    return new Promise ((resolve, reject) => {
        axios.post('/api/external/updateClientStatus', payload)
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            reject(error);
        })
    })
}

export const leaveWaitlistRequest = (link, unid) => {
    return new Promise((resolve, reject) => {
        axios.delete('/api/external/removeRequest', {params: { link, unid}})
        .then(response => {
            resolve(response);
        }) 
        .catch(error => {
            reject(error);
        })
    })
}

export const requestBusinessArguments = (link) => {
    return new Promise((resolve, reject) => {
        axios.get(`/api/external/businessArgs`, {params: {link}})
        .then(response => {
            resolve(response.data.payload);
        }) 
        .catch(error => {
            reject(error);
        })
    })
}