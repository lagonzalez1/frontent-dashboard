import React from "react";
import axios from "axios";
import { Slide } from "@mui/material";
import { getAccessToken, getStateData } from "../../auth/Auth";
import { DateTime } from "luxon";

export const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


/**
 * 
 * @param {Object} payload
 * @returns Promise         Returns business with the newly created data.
 * 
 * Middleware OK
 *                  
 */
export const addCustomerWaitlist = (payload, bid, email, timezone, timestamp) => {
    return new Promise((resolve, reject) => {
      
      const data = { id, b_id: bid, timezone, payload: {...payload, timestamp}, email };
      axios.post('/api/internal/create_client', data, {...headers, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
          resolve(response.data);
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
    });
  };