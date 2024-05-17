import * as Yup from "yup";
import { getAccessToken, getStateData } from "../../auth/Auth";
import axios from "axios";


export const validationSchema = Yup.object().shape({
    email: Yup.boolean(),
    notes: Yup.boolean(),
    service: Yup.boolean(),
});

export const LABELS = {
    email: 'Ask client for email',
    notes: 'Ask client for notes ',
    service: 'Ask client for option to select a service',
}
export const TITLE = {
    email: 'Email',
    notes: 'Notes',
    service: 'Service',
}


// Middleware OK
export const requestInputFieldChange = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const accessToken = getAccessToken();
        const headers = { headers: {'x-access-token': accessToken}}
        const data = { ...payload, email: user.email}
        axios.put('/api/internal/update_input_fields', payload, {...headers, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            if(response.status === 200){
                resolve(response.data);
            }
            reject(response.data)
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