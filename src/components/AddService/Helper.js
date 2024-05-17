import React from "react";
import { Slide } from "@mui/material";
import axios from "axios";
import { getStateData, getAccessToken } from "../../auth/Auth";

/**
 *  
 * @param {Object} data     Payload: Title, description, employeeid, active, public.
 * @returns                 Promise containing the results of axios.
 */

export const submitService = (data) => {
  return new Promise(function(resolve, reject) {
    const { user, business } = getStateData();
    const accessToken = getAccessToken();
    const headers = { headers: { 'x-access-token': accessToken } };
    const payload = { b_id: business._id, ...data, email: user.email}
    axios.post('/api/internal/create_service', payload, {...headers, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
    .then(response => {
      if(response.status === 200){
        resolve(response.data);
      }
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


export const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});