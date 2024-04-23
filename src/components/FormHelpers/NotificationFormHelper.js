import { getHeaders, getStateData } from "../../auth/Auth"
import axios from "axios";

export const requestNotificationChange = (data) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const headers = getHeaders();
        const payload = { ...data, b_id: business._id}
        axios.post('/api/internal/update_notifications', payload, headers)
        .then(response => {
            resolve(response);
        })
        .catch(error => {
            console.log(error);
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