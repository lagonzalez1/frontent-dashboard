
import axios from 'axios';
import { DateTime } from 'luxon';
import { getHeaders, getStateData } from '../../auth/Auth';


/**
 * 
 * @param {Object} employeeSchedule 
 * @param {Object} schedule 
 * @returns If false that means the break time is not within the start and end time.
 */
export const validateBreak = (incomingSchedule, schedule) => {

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
            const employeeBreakStart = DateTime.fromFormat(employeeSchedule[key].start, 'HH:mm').toFormat('HH:mm a');
            const scheduleStartTime = DateTime.fromFormat(schedule[key].start, 'HH:mm').toFormat('HH:mm a');
            const scheduleEndTime = DateTime.fromFormat(schedule[key].end, 'HH:mm').toFormat('HH:mm a');
            const isBetween = employeeBreakStart >= scheduleStartTime && employeeBreakStart <= scheduleEndTime;
            if (!isBetween) {
                return {validated: false, employeeSchedule};
            }
            continue;
        }
    }
    return {validated: true, employeeSchedule};
}


function formatEmployeeSchedule (ins){
    let schedule = {...ins};
    for(var key in schedule){
        console.log(DateTime.isDateTime(schedule[key].start))
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