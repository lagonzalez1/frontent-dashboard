import axios from "axios";
import { getHeaders, getStateData } from "../../auth/Auth";





export function getEmployeeAnalytics (id) {
    console.log("Called")
    return new Promise((resolve, reject) => {
       const { user, business} = getStateData();
       const headers = getHeaders();
       const params = { bid: business._id, eid: id}
       axios.get(`/api/internal/employee_analytics/${business._id}/${id}`, headers)
       .then(response => {
            resolve(response.data);
       }) 
       .catch(error => {
            reject(error);
       })
    })
}