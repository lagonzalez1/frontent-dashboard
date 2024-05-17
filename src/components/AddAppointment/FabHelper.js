import React from "react";
import { Slide } from "@mui/material";
import { getHeaders, getStateData } from "../../auth/Auth";
import axios from "axios";

let POST_CREATEAPPOINTMENT = '/api/internal/create_appointment';
let POST_VALIDATE = '/api/internal/validate_appointment';





// * Middleware OK
function createAppointmentRequest(payload) {
    const { user, business } = getStateData();
    const header = getHeaders();
    const data = { payload: {...payload}, b_id: business._id, email: user.email };
    return axios.post(POST_CREATEAPPOINTMENT, data, header);
}

/**
 *  
 * @param {*} payload 
 * @returns Resolve: Appointment succesfull
 *          Reject: Appointment failed
 * Middleware OK
 */
export const createAppointmentPretense = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const header = getHeaders();
        const data = { payload: {...payload}, b_id: business._id, email: user.email };

        axios
        .post(POST_VALIDATE, data, {...header, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
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


export const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});