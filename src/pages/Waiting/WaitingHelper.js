

import axios from "axios";



export const getIdentifierData = (link, unid, timestamp) => {
    return new Promise((resolve, reject) => {
        axios.get('/api/external/identifierRequest',{ params: {link, unid, timestamp} } )
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            reject(error);
        })
    });
}

export const leaveWaitlistRequest = () => {

}