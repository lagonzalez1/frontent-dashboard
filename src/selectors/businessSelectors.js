import { createSelector } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';


const override = (state) => state.business.accepting_override;
const currentDate = (state) => DateTime.local().setZone(state.business.timezone);
const currentSchedule = (state) => state.business.schedule;
const appointments = (state) => state.business.appointments;
const appointmentDate = (state) => state.business.appointmentDate;
const timezone = (state) => state.business.timezone;


export const isAcceptingOrReject = createSelector(
    [currentDate, currentSchedule, override],
    (date, schedule, over) => {
        if (over) {
            const overrideDate = DateTime.fromJSDate(new Date(over.lastDate));
            if (overrideDate.hasSame(date, 'day')) {
                return over.accepting;
            }
        }
        if (schedule[date.weekdayLong].start === '' || schedule[date.weekdayLong].end === ''){ return false}
        const startTime = DateTime.fromFormat(schedule[date.weekdayLong].start, "HH:mm")
        const endTime = DateTime.fromFormat(schedule[date.weekdayLong].end, "HH:mm")
        if (date >= startTime && date <= endTime) { return true}
        return false;
    }
)

function sortBasedStartTime(a, b) {
    const timestampA = DateTime.fromFormat(a.start, "HH:mm");
    const timestampB = DateTime.fromFormat(a.start, "HH:mm")

    if (timestampA < timestampB) {
      return -1;
    }
    if (timestampA > timestampB) {
      return 1;
    }
    return 0;
  }


export const sortAppointmentListByEmployees = createSelector(
    [appointments, appointmentDate, timezone],
    (appointments, appointmentDate, timezone) => {
        if (!appointments || !timezone) { return; }
        let mapEmployees = {}
        for (let i = 0, n = appointments.length; i < n; ++i) {
            const appointment = appointments[i];
            let eid = appointment.employeeTag;
            let appointmentDateClient = DateTime.fromJSDate(new Date(appointment.appointmentDate)).setZone(timezone)
            let selectedDate = DateTime.fromISO(appointmentDate, {zone: 'utc'})
            if (appointment.status.noShow === true || appointment.status.cancelled === true || 
                appointment.status.serving === true || appointmentDateClient.hasSame(selectedDate, 'day') === false) { continue; }
            if (eid in mapEmployees) {
                let prev_values = mapEmployees[eid];
                mapEmployees[eid] = [...prev_values, appointment]
            }
            else{ 
                mapEmployees[eid] = [appointment]
            }
        }
        for (let eid of Object.keys(mapEmployees)) {
            let arrayRef = mapEmployees[eid];
            if (arrayRef.length !== 0) {
                let sorted = arrayRef.sort(sortBasedStartTime);
                mapEmployees[eid] = sorted;
            } 
        }
        let completed = []
        for (let eid of Object.keys(mapEmployees)) {
            let arrayRef = mapEmployees[eid];
            for (let i = 0 , n = arrayRef.length; i < n ; ++i){
                completed.push(arrayRef[i]);
            }
        }
        return completed
    }
)