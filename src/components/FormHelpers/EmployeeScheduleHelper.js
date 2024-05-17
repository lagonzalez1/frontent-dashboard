
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
    console.log("ENTER")
    let employeeSchedule = formatEmployeeSchedule(incomingSchedule);
    console.log("Formated", employeeSchedule);
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
    console.log("enter function formatEmployeeSchedule(d)")
    for(var key in schedule){
        if (DateTime.isDateTime(schedule[key].start)) {
            const convert = schedule[key].start.toFormat('HH:mm');
            schedule[key] = {
                ...schedule[key],
                start: convert,
            };
        }else{
            schedule[key] = {
                ...schedule[key],
                start: '',
            };
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