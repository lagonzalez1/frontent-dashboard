
import axios from 'axios';
import { DateTime } from 'luxon';
import { getHeaders, getStateData } from '../../auth/Auth';


/**
 * 
 * @param {Object} employeeSchedule 
 * @param {Object} schedule 
 * @returns If false that means the break time is not within the start and end time.
 */
export const validateBreak = (employeeSchedule, schedule) => {
    console.log(employeeSchedule);
    console.log(schedule);
    for (var key in employeeSchedule){
        if (employeeSchedule[key].start === '' || employeeSchedule[key].start === undefined || employeeSchedule[key].start === null){
            continue;
        }else {
            console.log(employeeSchedule[key].start);
            const employeeBreakStart = DateTime.fromFormat(employeeSchedule[key].start, 'HH:mm').toFormat('HH:mm a');
            console.log(employeeBreakStart)
            const scheduleStartTime = DateTime.fromFormat(schedule[key].start, 'HH:mm').toFormat('HH:mm a');
            const scheduleEndTime = DateTime.fromFormat(schedule[key].end, 'HH:mm').toFormat('HH:mm a');
            const isBetween = employeeBreakStart >= scheduleStartTime && employeeBreakStart <= scheduleEndTime;
            if (!isBetween) {
                return false;
            }
            continue;
        }
    }
    return true;
}


export const requestScheduleChange = (payload) => {
    return new Promise((resolve, reject) => {
        const headers = getHeaders();
        axios.post('/api/internal/update_employee_breaks', payload, headers)
        .then(resonse => {
            resolve(resonse.data.msg);
        })
        .catch(error => {
            reject(error);
        })
    })
}