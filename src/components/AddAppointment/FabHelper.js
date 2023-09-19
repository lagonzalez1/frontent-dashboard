import React from "react";
import { Slide } from "@mui/material";
import { getHeaders, getStateData } from "../../auth/Auth";
import axios from "axios";



export const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function createAppointmentRequest(payload) {
    const { user, business } = getStateData();
    const header = getHeaders();
    const data = { ...payload, b_id: business._id };
  
    return axios.post('/api/internal/create_appointment', data, header);
  }

export const createAppointmentPretense = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const header = getHeaders();
        const data = { ...payload, b_id: business._id };

        axios
        .post('/api/internal/validate_appointment', data, header)
        .then((response) => {
            if (response.data.isValid) {
            // If validation is successful, proceed to create the appointment
            return createAppointmentRequest(payload);
            } else {
                // If validation fails, reject the promise with an error message
                reject('Appointment validation failed');
            }
        })
        .then((createResponse) => {
            // Handle the response from creating the appointment here
            resolve(createResponse.data.msg);
        })
        .catch((error) => {
            // Handle any errors that occurred during validation or appointment creation
            reject(error);
        });
    });
};