import { DateTime } from "luxon";
import { getStateData } from "../../auth/Auth";




export const columns = [
    { id: 'position', label: '#', minWidth: 10 },
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'date', label: 'Date', minWidth: 50 },
    { id: 'time', label: 'time', minWidth: 50 },
    { id: 'employee', label: 'Employee', minWidth: 40 },
    { id: 'actions', label: 'Actions', minWidth: 160 },
];

export function getHighlightedDays (date) {
    const { user, business } = getStateData();
    try {
        if (business) {
            const appointments = business.appointments;
            if ( appointments.length === 0 ) {
                return [];
            }
            let highlightDays = [];
            const daysInMonth = DateTime.fromISO(appointments[0].appointmentDate).daysInMonth;
            const currentDayInMonth = DateTime.fromISO(appointments[0].appointmentDate).day;

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