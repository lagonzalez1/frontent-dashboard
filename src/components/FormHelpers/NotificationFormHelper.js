import { getHeaders, getStateData } from "../../auth/Auth"
import axios from "axios";

export const requestNotificationChange = (data) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const headers = getHeaders();
        const payload = { ...data, b_id: business._id}
        axios.post('/api/internal/update_notifications', payload, headers)
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            reject(error.response.data.msg);
        })
    })
}