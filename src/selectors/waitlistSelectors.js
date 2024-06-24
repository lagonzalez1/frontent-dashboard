import { createSelector } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';


const override = (state) => state.business.accepting_override;
const currentDate = (state) => DateTime.local().setZone(state.business.timezone);
const currentSchedule = (state) => state.business.schedule;

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