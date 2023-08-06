import * as Yup from "yup";
import { getAccessToken } from "../../auth/Auth";
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


export const requestInputFieldChange = (payload) => {
    return new Promise((resolve, reject) => {
        const accessToken = getAccessToken();
        const headers = { headers: {'x-access-token': accessToken}}
        axios.put('/api/internal/update_input_fields', payload, headers)
        .then(response => {
            if(response.status === 200){
                resolve(response.data);
            }
            reject(response.data)
        })
        .catch(error => {
            reject(error.response.data.msg)

        })
    })
}