import React from "react";
import { Slide } from "@mui/material";
import axios from "axios";
import { getAccessToken, getStateData } from "../../auth/Auth";


export const getServicesAvailable = () => {
  const { user, business } = getStateData();

  if (!user || !business) {
    return []; // or any other appropriate value to indicate the absence of user or business
  }
  const services = business.services;
  if (!services) {
    return [];
  }

  return services;
};

export const getResourcesAvailable = () => {
  const { user, business } = getStateData();
  if (!business) {
    return []; // or any other appropriate value to indicate the absence of business
  }
  const resources = business.resources;
  if (!resources) {
    return [];
  }
  return resources;
};


// Middleware OK
export const addResource = (payload) => {
    return new Promise((resolve, reject) => {
      const { user, business } = getStateData();
      const accessToken = getAccessToken();
      const headers = { headers: { 'x-access-token': accessToken } };
      const b_id = business._id;
      console.log(payload)
      const data = { b_id, ...payload, email: user.email };
      axios
        .post('/api/internal/create_resource', data, {...headers, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
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
    })
}


export const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});