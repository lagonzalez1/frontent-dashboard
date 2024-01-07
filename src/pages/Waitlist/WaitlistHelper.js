import axios from "axios";



export const requestBusinessWaitlist = (link, time) => {
    return new Promise((resolve, reject) => {
        axios.get(`/api/external/getExternalList`, {params: {link, time}})
        .then(response => {
            resolve(response.data);
        }) 
        .catch(error => {
            reject(error);
        })
    })
}

