import { DateTime } from "luxon";
import { getHeaders, getStateData } from "../../auth/Auth";
import { Slide } from "@mui/material";
import React from "react";
import axios from "axios";

export const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export const sortClientData = (data, sort, stateSort) => {
    const { user, business} = getStateData();
    const currentTime = DateTime.local().setZone(business.timezone);

    if (!data) { return []}
    console.log(sort);
    const dateSort = data.map((summary) => {
        switch(sort){
            case 'Today':
                const clientTime = DateTime.fromISO(summary.timestamp);
                if (clientTime.hasSame(currentTime, 'day')){
                    return summary;
                }
            break;
        }
    })
    console.log(dateSort);
    return dateSort;
}


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
        reject(error);
       })
    })
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
        reject(error);
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