import axios from "axios";

let GET_EXTERNAL_WAITLIST = `/api/external/getExternalList`;


export const requestBusinessWaitlist = (link, time) => {
    return new Promise((resolve, reject) => {
        axios.get(GET_EXTERNAL_WAITLIST, {params: {link, time}, timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
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

