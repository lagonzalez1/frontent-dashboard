import axios from "axios";

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


export const requestBusinessWaitlist = (link) => {
    return new Promise((resolve, reject) => {
        axios.get(`/api/external/businessWaitlist`, {params: {link}})
        .then(response => {
            resolve(response.data);
        }) 
        .catch(error => {
            reject(error);
        })
    })
}

