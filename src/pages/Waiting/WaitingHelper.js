

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