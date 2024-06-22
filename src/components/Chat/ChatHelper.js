import axios from "axios";


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