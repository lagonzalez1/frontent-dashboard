import axios from "axios";
import { getAccessToken, getHeaders, getStateData } from "../../auth/Auth";

let GET_BUSINESS_ANALYTICS = '/api/internal/business_analytics/'
let GET_EMPLOYEE_ANALYTICS = `/api/internal/employee_analytics`;

let POST_EMPLOYEE_ANALYTICS_RANGE = '/api/internal/employee_analytics_range';


// Get Totals
export function getEmployeeAnalytics (id, accessToken) {
    return new Promise((resolve, reject) => {
       const { user, business} = getStateData();
       const params = { bid: business._id, eid: id, email: user.email}
       axios.get(GET_EMPLOYEE_ANALYTICS, {headers: {'x-access-token': accessToken}, params, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
       .then(response => {
            resolve(response.data.data);
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


// Get range
export function getEmployeeAnalyticsRange (payload) {
     return new Promise((resolve, reject) => {
        const { user, business} = getStateData();
        const headers = getHeaders();
        const params = { bid: business._id, ...payload, email: user.email}
        axios.get(POST_EMPLOYEE_ANALYTICS_RANGE, {headers, params, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
             resolve(response.data.data);
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


 export function getBusinessAnalytics (accessToken) {
     return new Promise((resolve, reject) => {
        const { user, business} = getStateData();
        const headers = getHeaders();
        axios.get(GET_BUSINESS_ANALYTICS,{headers, params: {bid: business._id, email: user.email}, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
             resolve(response.data.data);
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