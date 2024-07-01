import { DateTime } from "luxon";
import { getHeaders, getStateData } from "../../auth/Auth";
import axios from "axios";

const POST_SLOTS_QUICK_VIEW = "/api/internal/quick_view_available_appointments";
let POST_CREATEAPPOINTMENT = '/api/internal/create_appointment';
let POST_VALIDATE = '/api/internal/validate_appointment';


export const columns = [
    { id: 'position', label: '#', minWidth: 10 },
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'date', label: 'Date', minWidth: 50 },
    { id: 'time', label: 'Time-Range', minWidth: 50 },
    { id: 'employee', label: 'Employee', minWidth: 40 },
    { id: 'actions', label: 'Actions', minWidth: 160 },
];


function createAppointmentRequest(payload, bid, email) {
    const data = { payload: {...payload}, b_id: bid, email };
    return axios.post(POST_CREATEAPPOINTMENT, data);
}

/**
 *  
 * @param {*} payload 
 * @returns Resolve: Appointment succesfull
 *          Reject: Appointment failed
 * Middleware OK
 */
export const createAppointmentPretense = (payload, bid, email) => {
    return new Promise((resolve, reject) => {
        
        const data = { payload: {...payload}, b_id: bid, email };

        axios
        .post(POST_VALIDATE, data, { timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then((response) => {
            if (response.data.isValid) {
            // If validation is successful, proceed to create the appointment
            return createAppointmentRequest(payload, bid, email);
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


export function getAllSlotsAppointments (eid, date, serviceId, serviceTags, bid, email) { 
    const payload = {  bid, email, appointmentDate: date, employeeId: eid, serviceId, serviceTags}
    return new Promise((resolve, reject) => {
        axios.post(POST_SLOTS_QUICK_VIEW, payload,{ timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            resolve(response);
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

export function getHighlightedDays (date) {
    const { user, business } = getStateData();
    try {
        if (business) {
            const appointments = business.appointments;
            if ( appointments.length === 0 ) {
                return [];
            }
            let highlightDays = [];
            const incomingDate = DateTime.fromISO(date); // Check the incoming date appointments slots for the month.
            for (let appointment of appointments){
                // Check if 
                const appointmentSlot = DateTime.fromISO(appointment.appointmentDate);
                if (incomingDate.hasSame(appointmentSlot, "month") === true) {
                    highlightDays.push(appointmentSlot.day);
                }
            }
            return highlightDays;
        }
        return [];
    }
    catch(error) {
        console.log(error)
        return []
    }
}