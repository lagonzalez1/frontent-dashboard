
import axios from 'axios';
import { DateTime } from 'luxon';
import { getHeaders, getStateData } from '../../auth/Auth';


/**
 * 
 * @param {Object} employeeSchedule 
 * @param {Object} schedule 
 * @returns If false that means the break time is not within the start and end time.
 */
export const validateBreak = (incomingSchedule, businessSchedule) => {
    // Assume each day must be filled.
    // 1. Check if start time is valid with business
    // 2. Check if break is within the valid start and end of business and/or employee
    // OK.
    let employeeSchedule = formatEmployeeSchedule(incomingSchedule);
    console.log(employeeSchedule);
    // Validate here.
    for (var key in employeeSchedule){
        if (employeeSchedule[key].start === '' || employeeSchedule[key].start === undefined || employeeSchedule[key].start === null){
            continue;
        }else {
            const businessStart = DateTime.fromFormat(businessSchedule[key].start, "HH:mm");
            const businessEnd = DateTime.fromFormat(businessSchedule[key].end, "HH:mm");

            const employeeBreakStart = DateTime.fromFormat(employeeSchedule[key].break, 'HH:mm')
            const employeeStart = DateTime.fromFormat(employeeSchedule[key].start, 'HH:mm')
            const employeeEnd = DateTime.fromFormat(employeeSchedule[key].end, 'HH:mm')
            
            // Check if start and end times are within business start times
            // This should return a result even if left empty.
            const isValidForBusiness = employeeStart >= businessStart && employeeEnd <= businessEnd;
            
            if (isValidForBusiness) {
                if(employeeSchedule[key].duration === 0) { 
                    employeeSchedule[key] = {...employeeSchedule[key], break: ''};     
                    continue; 
                } // Valid start and end time, with no break specified.
                const breakEnd = DateTime.fromFormat(employeeSchedule[key].break, "HH:mm").plus({'minutes': employeeSchedule[key].duration})
                if (breakEnd === employeeBreakStart) { return {validated: false, employeeSchedule, reason: 'You have a specified a break start time with no duration.'}} // Duration is zero
                
                let validBreak = employeeBreakStart >= employeeStart && breakEnd <= employeeEnd;
                if (!validBreak) { return {validated: false, employeeSchedule, reason: 'Your break times do not align with your start time and end time.'};}
            }            
            if (!isValidForBusiness) {
                console.log("employee start", employeeStart)
            console.log("Business start", businessStart)
            console.log("employee end ", employeeEnd)
            console.log("Business end", businessEnd)
                return {validated: false, employeeSchedule, reason: 'Your start time and end time do not align with business hours.'};
            }
            continue;
        }
    }
    return {validated: true, employeeSchedule, reason: 'OK'};
}


function formatEmployeeSchedule (ins){
    let schedule = {...ins};
    for(var key in schedule){
        if(DateTime.isDateTime(schedule[key].start) && DateTime.isDateTime(schedule[key].end) ) {
            const convert_start = schedule[key].start.toFormat('HH:mm');
            const convert_end = schedule[key].end.toFormat('HH:mm');
            schedule[key] = { ...schedule[key], start: convert_start, end: convert_end }
        }else {
            schedule[key] = {
                ...schedule[key], start: '', end: ''} 
        }
        if (DateTime.isDateTime(schedule[key].break)) {
            const convert_break = schedule[key].break.toFormat('HH:mm');
            schedule[key] = { ...schedule[key], break: convert_break }
        }else {
            schedule[key] = { ...schedule[key], break: '' } 
        }
    }
    return schedule;
}



export const requestScheduleChange = (payload) => {
    return new Promise((resolve, reject) => {
        const headers = getHeaders();
        axios.post('/api/internal/update_employee_breaks', payload, {...headers, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(resonse => {
            resolve(resonse.data.msg);
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