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
    const payload = {
        b_id: business._id,
        service: {...data}
    }
    axios.post('/api/internal/create_service', payload, headers)
    .then(response => {
      if(response.status === 200){
        resolve(response.data);
      }
    })
    .catch(errors => {
      reject(errors.response.data);
    })
})
}


export const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});