import { getHeaders, getStateData } from "../../auth/Auth"
import axios from "axios";

export const requestNotificationChange = (data) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const headers = getHeaders();
        const payload = { ...data, b_id: business._id, user: user.email}
        axios.post('/api/internal/update_notifications', payload, {...headers, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
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
    })
}