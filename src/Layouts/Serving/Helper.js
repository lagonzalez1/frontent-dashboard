import { getStateData } from "../../auth/Auth";
import { DateTime } from "luxon";
const MINUTES_IN_HOUR = 60;


export const getServingCount = () => {
    const { _ , business } = getStateData();
    console.log(business);
    if (!business) { return new Error('Buisness data is empty.')}
    const currentList = business.currentClients;
    console.log(currentList);
    if (currentList.length === 0) { return { groupCount: 0 ,groupTotalCount: 0} }
    let groupCount = 0;
    let groupTotalCount = 0;
    for (var object of currentList) {
        if (object.status.serving === true){
            groupCount += 1;
        }   groupTotalCount += object.partySize;
    }
    return { groupCount, groupTotalCount };
}

export const currentTimePosition = () => {
    const { _ , business} = getStateData();
    const timezone = business.timezone;
    if (!timezone) { return 'No timezone present.';}

}


export const getUserTable = () => {
    try {
      const { user, business } = getStateData();
      if (!user || !business) {
        return [];
      }
  
      const appointments = business.currentClients;
      if (!appointments) {
        return [];
      }
  
      const timezone = business.timezone;
      if (!timezone) {
        return [];
      }
  
      const currentTime = DateTime.local().setZone(timezone);
  
        const wait = appointments.map((client) => {
        const luxonDateTime = DateTime.fromJSDate(new Date(client.status.serveTime));
        const diffMinutes = currentTime.diff(luxonDateTime, 'minutes').minutes;
        const diffHours = currentTime.diff(luxonDateTime, 'hours').hours;
        const hours = Math.floor(diffHours);
        const minutes = Math.floor(diffMinutes % MINUTES_IN_HOUR);
        return {
          ...client,
          serveTime: { hours, minutes },
        };
      });
  
      return wait;
    } catch (error) {
      // Handle the error here
      console.error(error);
      return []; // Return an empty array or any other appropriate value
    }
  };



export const columns = [
    { id: 'position', label: '#', minWidth: 10 },
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'size', label: 'Party size', minWidth: 50 },
    { id: 'resource', label: 'Using', minWidth: 50 },
    { id: 'served', label: 'Served', minWidth: 50 },
    { id: 'actions', label: '', minWidth: 170 },
];

