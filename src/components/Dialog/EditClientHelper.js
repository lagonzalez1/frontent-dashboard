import React from "react";
import axios from "axios";
import { Slide } from "@mui/material";
import { getHeaders, getStateData } from "../../auth/Auth";

export const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const PHONE_REGEX = /^\d{3}-\d{3}-\d{4}$/;    



export const requestClientEditApp = (payload) => {
    return new Promise((resolve, reject) => {
        const {user, business} = getStateData();
        const headers = getHeaders();
        const data = {payload: {...payload}, b_id: business._id, client_id: payload._id}
        axios.post(`/api/internal/update_client_appointment`, data, headers)
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            reject(error)
        })       
    })
}

export const requestClientEditWait = (payload) => {
    return new Promise((resolve, reject) => {
        const {user, business} = getStateData();
        const headers = getHeaders();
        const data = {payload: {...payload}, b_id: business._id, client_id: payload._id}
        axios.post(`/api/internal/update_client_waitlist`, data, headers)
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            reject(error)
        })       
    })
}