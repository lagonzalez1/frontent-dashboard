
import axios from "axios";
import { DateTime } from "luxon";
import DeleteIcon from '@mui/icons-material/Delete';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { getStateData, getAccessToken } from "../../auth/Auth";
import { setSnackbar } from "../../reducers/user";

// Current data

const ENDPOINT_ACCEPTING = '/api/internal/update_accepting' 
const MINUTES_IN_HOUR = 60;

export const handleOpenNewTab = (endpoint) => {
    const url = 'http://localhost:3000/welcome/'+endpoint;
    window.open(url, '_blank');
};

/**
 * 
 * @param {Number} accepting    0: open client store 
 *                              1: close client store 
 * @param {*} dispatch          useSDispatch hook from redux
 *                              Get current time and update the override, at the start of a new day
 *                              the client will be abel to override to go back to schedule by checking the current date. 
 */
export const requestChangeAccept = (accepting) => {
  return new Promise((resolve, reject) => {
    const { user, business } = getStateData();
    const accessToken = getAccessToken();
    const email = user.email;
    const b_id = business._id;
    const headers = { headers: { 'x-access-token': accessToken } };
    const currentDate = DateTime.local().setZone(business.timezone).toISO();
    const requestBody = {
      currentDate,
      accessToken,
      email: email,
      b_id,
      accepting
    };

    axios.put(ENDPOINT_ACCEPTING, requestBody, headers)
      .then(response => {
        resolve(response.data); // Resolve the promise with the response data
      })
      .catch(error => {
        reject(error); // Reject the promise with the error
      });
  });
};

/**
 * NEDS ATTENTION: sort function not being utilized.
 *                 Sort based on columns buttons ?
 * @returns Sorted business table, decending order based on timestamp.
 * 
 */
export const getUserTable = () => {
  const { user, business } = getStateData();
    try {  
      const appointments = business.currentClients;
      if (!appointments) {
        return [];
      }
  
      const timezone = business.timezone;
      if (!timezone) {
        return new Error('No timezone to validate.');
      }
  
        const currentTime = DateTime.local().setZone(timezone);
        const sorted = appointments.sort(sortBaseTime); //Not yet implemented
  
        const wait = appointments.map((client) => {
        const luxonDateTime = DateTime.fromJSDate(new Date(client.timestamp));
        const diffMinutes = currentTime.diff(luxonDateTime, 'minutes').minutes;
        const diffHours = currentTime.diff(luxonDateTime, 'hours').hours;
        const hours = Math.floor(diffHours);
        const minutes = Math.floor(diffMinutes % MINUTES_IN_HOUR);
        return {
          ...client,
          waittime: { hours, minutes },
        };
      });
  
      return wait;
    } catch (error) {
      // Handle the error here
      console.error(error);
      return new Error(error); // Return an empty array or any other appropriate value
    }
  };
  

function sortBaseTime (a,b) {
    if (a.timestamp < b.timestamp){
        return -1
    }
    if(a.timestamp > b.timestamp){
        return 1;
    }
    return 0;
}



// Might need a buffer to aaccept appointments a bit earlier.
export const acceptingRejecting = () => {
    const { user, business } = getStateData();
    let currentDate = DateTime.local().setZone(business.timezone);
    let weekday = currentDate.weekdayLong;
    let currentSchedule = business.schedule[weekday];
    
    const override = business.accepting_override;
    // Check if override is active for the same day.
    if(override.lastDate){
      const overrideDate = DateTime.fromJSDate(new Date(override.lastDate));
      if (overrideDate.hasSame(currentDate, 'day')){
        return override.accepting;
      }
    }
    if (currentSchedule.start === '' || currentSchedule.end === ''){
      return false;
    }
    const start = DateTime.fromFormat(currentSchedule.start, "HH:mm");
    const end = DateTime.fromFormat(currentSchedule.end,"HH:mm");
    // Check if current time is within start and end.
    if ( currentDate >= start && currentDate <= end){
      return true;
    }
} 


/*
    STATIC VARIABLES
*/

export const options = [
    'Remove open lock ',
    'Open lock ',
    'Go to check-in '
  ];
export const columns = [
    { id: 'position', label: '#', minWidth: 10 },
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'size', label: 'Party size', minWidth: 50 },
    { id: 'resource', label: 'Resource', minWidth: 50 },
    { id: 'wait', label: 'Time waited', minWidth: 50 },
    { id: 'actions', label: '', minWidth: 170 },
];

export const clientOptions = [
    {id: 'no-show', label: 'No show', icon: <CancelIcon/>},
    {id: 'move', label: 'Move', icon: <SwapVertIcon/>},
    {id: 'edit', label: 'Edit', icon: <EditIcon/>},
    {id: 'remove', label: 'Remove', icon: <DeleteIcon/>},
]

export const OPTIONS_SELECT = {
    NO_SHOW: 'no-show',
    MOVE: 'move',
    EDIT: 'edit',
    REMOVE: 'remove'
}





