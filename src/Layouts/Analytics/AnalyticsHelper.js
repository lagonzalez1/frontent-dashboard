import axios from "axios";
import { getAccessToken, getHeaders, getStateData } from "../../auth/Auth";

let GET_BUSINESS_ANALYTICS = '/api/internal/business_analytics/'
let GET_EMPLOYEE_ANALYTICS = `/api/internal/employee_analytics`;

let POST_EMPLOYEE_ANALYTICS_RANGE = '/api/internal/employee_analytics_range';


// Get Totals
export function getEmployeeAnalytics (id, bid, email) {
    return new Promise((resolve, reject) => {
       const params = { bid: bid, eid: id, email}
       axios.get(GET_EMPLOYEE_ANALYTICS, {params, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
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
export function getEmployeeAnalyticsRange (payload, bid, email) {
     return new Promise((resolve, reject) => {
        const params = { ...payload, email, bid}
        axios.get(POST_EMPLOYEE_ANALYTICS_RANGE, { params, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
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


 export function getBusinessAnalytics (bid, email) {
     return new Promise((resolve, reject) => {

        axios.get(GET_BUSINESS_ANALYTICS,{params: {bid: bid, email}, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
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