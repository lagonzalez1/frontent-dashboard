import React from "react";
import axios from "axios";
import { Slide } from "@mui/material";
import { getHeaders, getStateData } from "../../auth/Auth";

export const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const PHONE_REGEX = /^\d{3}-\d{3}-\d{4}$/;    


// Middleware OK
export const rerquestClientContactEdit = (payload, bid, email) => {
    return new Promise((resolve, reject) => {
        const data = {payload: {...payload}, b_id: bid, email}
        axios.post(`/api/internal/update_client_contact`, data)
        .then(response => {
            resolve(response.data.msg);
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

// Middleware OK
export const requestClientEditApp = (payload, bid, email) => {
    return new Promise((resolve, reject) => {
        const data = {payload: {...payload}, b_id: bid, client_id: payload._id, email}
        axios.post(`/api/internal/update_client_appointment`, data)
        .then(response => {
            resolve(response.data.msg);
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
// Middleware OK
export const requestClientEditWait = (payload, bid, email) => {
    return new Promise((resolve, reject) => {
        const data = {payload: {...payload}, b_id: bid, client_id: payload._id, email}
        axios.post(`/api/internal/update_client_waitlist`, data)
        .then(response => {
            resolve(response.data.msg);
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