import React from "react";
import axios from "axios";
import { Slide } from "@mui/material";
import { getAccessToken, getStateData } from "../../auth/Auth";

export const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



/**
 * 
 * @param {Object} payload
 * @returns Promise         Returns business with the newly created data.
 *                  
 */
export const addCustomerWaitlist = (payload) => {
    return new Promise((resolve, reject) => {
      const { user, business } = getStateData();
      const accessToken = getAccessToken();
      const headers = { headers: { 'x-access-token': accessToken } };
      const id = user.id;
      const b_id = business._id;
      const timezone = business.timezone;
      const data = { id, b_id, timezone, ...payload };
      axios
        .post('/api/internal/create_client', data, headers)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };