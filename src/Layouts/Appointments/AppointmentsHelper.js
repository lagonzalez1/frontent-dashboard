import { DateTime } from "luxon";
import { getHeaders, getStateData } from "../../auth/Auth";
import axios from "axios";

const POST_SLOTS_QUICK_VIEW = "/api/internal/quick_view_available_appointments";

export const columns = [
    { id: 'position', label: '#', minWidth: 10 },
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'date', label: 'Date', minWidth: 50 },
    { id: 'time', label: 'Time-Range', minWidth: 50 },
    { id: 'employee', label: 'Employee', minWidth: 40 },
    { id: 'actions', label: 'Actions', minWidth: 160 },
];


export function getAllSlotsAppointments (eid, date, serviceId) { 
    const { user, business } = getStateData();
    const payload = { bid: business._id, email: user.email, appointmentDate: date, employeeId: eid, serviceId}
    const header = getHeaders();
    return new Promise((resolve, reject) => {
        axios.post(POST_SLOTS_QUICK_VIEW, payload,{...header, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            resolve(response.data);
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