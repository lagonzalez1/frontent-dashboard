import axios from "axios";
import { getHeaders, getStateData } from "../../auth/Auth";




// Get Totals
export function getEmployeeAnalytics (id) {
    return new Promise((resolve, reject) => {
       const { user, business} = getStateData();
       const headers = getHeaders();
       const params = { bid: business._id, eid: id}
       axios.get(`/api/internal/employee_analytics/${business._id}/${id}`, headers)
       .then(response => {
            resolve(response.data.data);
       }) 
       .catch(error => {
            reject(error);
       })
    })
}


// Get range
export function getEmployeeAnalyticsRange (payload) {
     return new Promise((resolve, reject) => {
        const { user, business} = getStateData();
        const headers = getHeaders();
        const data = { bid: business._id, ...payload}
        axios.post('/api/internal/employee_analytics_range', data,headers)
        .then(response => {
             resolve(response.data.data);
        }) 
        .catch(error => {
             reject(error);
        })
     })
 }


 export function getBusinessAnalytics () {
     return new Promise((resolve, reject) => {
        const { user, business} = getStateData();
        const headers = getHeaders();
        axios.get(`/api/internal/business_analytics/${business._id}`,headers)
        .then(response => {
             resolve(response.data.data);
        }) 
        .catch(error => {
             reject(error);
        })
     })
 }