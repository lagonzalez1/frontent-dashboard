
import axios from "axios";
import { getHeaders, getStateData } from "../../auth/Auth";


export const requestClientEdit = (payload) => {
    console.log(payload);
    return new Promise((resolve, reject) => {
        const {user, business} = getStateData();
        const headers = getHeaders();
        const data = {payload: {...payload}, b_id: business._id, client_id: payload._id}
        axios.post(`/api/internal/update_client`, data, headers)
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            reject(error)
        })       
    })
}