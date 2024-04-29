import { DateTime } from "luxon";
import { getHeaders, getStateData } from "../../auth/Auth";
import { Slide } from "@mui/material";
import React from "react";
import axios from "axios";

export const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export function searchAnalyticsKeyword (word) {
    return new Promise((resolve, reject) => {
       const { user, business} = getStateData();
       const headers = getHeaders();
       const payload = {b_id: business._id, keyword: word}
       axios.post('/api/internal/analytics_search_keyword', payload, headers)
       .then(response => {
        resolve(response.data.payload)
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

export function convertTo_CSV (payload) {
    return new Promise((resolve, reject) => {
        const headers = getHeaders();
        const csv_data = JSON.stringify(payload)
        axios.post('/api/internal/client_csv', {payload:csv_data}, headers)
        .then(response => {
            resolve(response);
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
    });
}

export function removeFromAnalytics (id) {
    return new Promise((resolve, reject) => {
       const { user, business} = getStateData();
       const headers = getHeaders();
       const payload = {b_id: business._id, eid: id}
       axios.post('/api/internal/analytics_remove', payload, headers)
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

export function getLastVisit (waitlist, appointments) {
    if (!waitlist || !appointments) { return "NA";}
    let lastVisit = waitlist.length > 0 ? waitlist[0].timestamp : appointments[0].appointmentDate;
    let lastVisitDate = DateTime.fromISO(lastVisit).toFormat('LLL dd yyyy');
    return lastVisitDate
}

export const columns = [
    {id: 'name', title: 'Name'},
    {id: 'email', title: 'Email'},
    {id: 'visit', title: 'Last visit'},
    {id: 'status', title: 'Status'},
    {id: 'delete', title: 'Remove'}
]