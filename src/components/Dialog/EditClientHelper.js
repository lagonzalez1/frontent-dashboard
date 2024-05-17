import React from "react";
import axios from "axios";
import { Slide } from "@mui/material";
import { getHeaders, getStateData } from "../../auth/Auth";

export const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const PHONE_REGEX = /^\d{3}-\d{3}-\d{4}$/;    


// Middleware OK
export const rerquestClientContactEdit = (payload) => {
    return new Promise((resolve, reject) => {
        const { user , business} = getStateData();
        const headers = getHeaders();
        const data = {payload: {...payload}, b_id: business._id, email: user.email}
        axios.post(`/api/internal/update_client_contact`, data, headers)
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
export const requestClientEditApp = (payload) => {
    return new Promise((resolve, reject) => {
        const {user, business} = getStateData();
        const headers = getHeaders();
        const data = {payload: {...payload}, b_id: business._id, client_id: payload._id, email: user.email}
        axios.post(`/api/internal/update_client_appointment`, data, headers)
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
export const requestClientEditWait = (payload) => {
    return new Promise((resolve, reject) => {
        const {user, business} = getStateData();
        const headers = getHeaders();
        const data = {payload: {...payload}, b_id: business._id, client_id: payload._id, email: user.email}
        axios.post(`/api/internal/update_client_waitlist`, data, headers)
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