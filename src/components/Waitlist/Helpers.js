
import axios from "axios";
import { DateTime } from "luxon";
import DeleteIcon from '@mui/icons-material/Delete';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import NorthRoundedIcon from '@mui/icons-material/NorthRounded';
import SouthRoundedIcon from '@mui/icons-material/SouthRounded';
import { getStateData, getAccessToken } from "../../auth/Auth";
import { setSnackbar } from "../../reducers/user";

// Current data

const ENDPOINT_ACCEPTING = '/api/internal/update_accepting' 


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


export const removeClient = (id) => {
  const { user, business } = getStateData();
  const accessToken = getAccessToken();
  const payload = { clientId: id, bId: business._id };
  const headers = { headers: { 'x-access-token': accessToken } };
  return new Promise((resolve, reject) => {
    axios.put('/api/internal/remove_client', payload, headers)
      .then((response) => {
        // If the request is successful, resolve the promise with the response data
        if ( response.status === 200) {
          resolve(response.data.msg);
        }
        reject(response.data.msg)
      })
      .catch((error) => {
        // If there's an error, reject the promise with the error object
        reject(error);
      });
  });
};


  





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
    {id: 'move-up', label: 'Move up', icon: <NorthRoundedIcon/>},
    {id: 'move-down', label: 'Move down', icon: <SouthRoundedIcon/>},
    {id: 'no-show', label: 'No show', icon: <CancelIcon/>},
    {id: 'edit', label: 'Edit', icon: <EditIcon/>},
    {id: 'remove', label: 'Remove', icon: <DeleteIcon/>},
]

export const OPTIONS_SELECT = {
    NO_SHOW: 'no-show',
    MOVE_UP: 'move-up',
    MOVE_DOWN: 'move-down',
    EDIT: 'edit',
    REMOVE: 'remove'
}





