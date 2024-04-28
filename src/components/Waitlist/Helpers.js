
import axios from "axios";
import { DateTime } from "luxon";
import DeleteIcon from '@mui/icons-material/Delete';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import NorthRoundedIcon from '@mui/icons-material/NorthRounded';
import SouthRoundedIcon from '@mui/icons-material/SouthRounded';
import { getStateData, getAccessToken, getHeaders } from "../../auth/Auth";
import { setSnackbar } from "../../reducers/user";
import { findClient } from "../../hooks/hooks";

// Current data

const ENDPOINT_ACCEPTING = '/api/internal/update_accepting' 


export const handleOpenNewTab = (endpoint) => {
    const url = 'https://waitonline.us/welcome/'+endpoint;
    window.open(url, '_blank');
    return;
};


export const requestBusinessState = () => {
  return new Promise((resolve, reject) => {
    const { user, business } = getStateData();
    const time = new DateTime.local().setZone(business.timezone).toISO();
    const headers = getHeaders();
    axios.get(`/api/internal/businessState/${business._id}/${time}`, headers)
    .then(response => {
      resolve(response.data.isAccepting);
    })
    .catch(error => {
      reject(error.response.msg);
    })
  })
}



export const requestNoShow = (clientId, type) => {
  return new Promise((resolve, reject) => {
    const { user, business } = getStateData();
    const accessToken = getAccessToken();
    const headers = { headers: { 'x-access-token': accessToken } };
    const payload = { bId: business._id, clientId, type}
    axios.post('/api/internal/noShow', payload, headers)
    .then(response => {
      resolve(response.data)

    })
    .catch(error => {
      console.log(error);
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
        console.log(error);
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
  });
};


/**
 * 
 * @param {String} clientId  
 * @param {Array} list 
 * @returns           Promise:
 *                    Logic: Get current client and manipulate timestamp to reflect 1-5ms below client.
 *                    Grab ref to client timestamp below.
 */
export const moveClientUp = (clientId, currentClients) => {
  return new Promise((resolve, reject) => {
    const { user, business } = getStateData();
    const list = currentClients;
    // No change to be made since list to small.
    if (list.length < 2) { return list; }
    const timezone = business.timezone;
    let clientAbove = null;
    let clientTimestamp = null;
    // Find client below.
    for (let index = 0; index < list.length; index++) {
        const client = list[index];
        if (client._id === clientId) {
            const next = index - 1;
            clientTimestamp = DateTime.fromISO(client.timestamp).setZone(timezone);
            // Ensure there is a client below
            if (list[next] !== undefined || list[next] !== null) {
                clientAbove = list[next];
                console.log("SELECTED: " + list[index].fullname +  " -  SELECTED: " +  list[next].fullname)
            }
          break; // Exit the loop when the desired client is found
        }
    }
    console.log("Client Selected: ", clientAbove)
    if(clientAbove === null || clientAbove === undefined){
      return resolve('No changes made');
    }
    if (clientAbove !== null && clientTimestamp !== null) {
      const clientAboveTimestamp = DateTime.fromISO(clientAbove.timestamp).setZone(timezone);
      const accessToken = getAccessToken();
      const headers = { headers: { 'x-access-token': accessToken } };

      const payload = { clientId, clientTimestamp, clientSwapId: clientAbove._id ,bId: business._id, clientSwapTimestamp :clientAboveTimestamp}
      axios.put('/api/internal/update_timestamp', payload, headers)
      .then(response => {
        if(response.status === 200){
          resolve(response.data.msg);
        }
        else{
          resolve(response.data.msg);
        }
        
      })
      .catch(error => {
        console.log(error);
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
      
    }
  });
}

/**
 * @param {String} clientId  
 * @param {Array} list 
 * @returns           Promise:
 *                    Logic: Get current client and manipulate timestamp to reflect 1-5ms below client.
 *                    Grab ref to client timestamp below.
 */
export const moveClientDown = (clientId, currentClients) => {
  return new Promise((resolve, reject) => {
    const { user, business } = getStateData();
    const list = currentClients
    // No change to be made since list to small.
    if (list.length < 2) { return list; }
    const timezone = business.timezone;
    let clientBelow = null;
    let clientTimestamp = null;
    console.log("LIST: ", list)
    // Find client below.
    for (let index = 0; index < list.length; index++) {
        const client = list[index];
        if (client._id === clientId) {
            const next = index + 1;
            clientTimestamp = DateTime.fromISO(client.timestamp).setZone(timezone);
            // Ensure there is a client below
            if (list[next] !== undefined || list[next] !== null) {
                clientBelow = list[next];
                console.log("SELECTED: " + list[index].fullname +  " -  SELECTED: " +  list[next].fullname)
            }
          break; // Exit the loop when the desired client is found
        }
    }
    console.log("Client Selected: ", clientBelow)
    if(clientBelow === null || clientBelow === undefined){
      return resolve('No changes made');
    }
    if (clientBelow !== null && clientTimestamp !== null) {
      const clientSwapTimestamp = DateTime.fromISO(clientBelow.timestamp).setZone(timezone);

      const accessToken = getAccessToken();
      const headers = { headers: { 'x-access-token': accessToken } };
      const payload = { clientId, clientTimestamp, bId: business._id, clientSwapTimestamp, clientSwapId: clientBelow._id}
      axios.put('/api/internal/update_timestamp',payload, headers)
      .then(response => {
        if(response.status === 200){
          resolve(response.data.msg);
        }else{
          resolve(response.data.msg);
        }
      })
      .catch(error => {
        console.log(error);
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
    }

  })
}



export const removeClient = (id, type) => {
  const { user, business } = getStateData();
  const accessToken = getAccessToken();
  const payload = { clientId: id, bId: business._id, type };
  const headers = { headers: { 'x-access-token': accessToken } };
  return new Promise((resolve, reject) => {
    axios.put('/api/internal/remove_client', payload, headers)
      .then((response) => {
        // If the request is successful, resolve the promise with the response data
        if ( response.status === 200) {
          resolve(response.data.msg);
        }
      })
      .catch(error => {
        console.log(error);
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
    }else {
      return false;
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
    { id: 'position', label: '#', minWidth: 5 },
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'size', label: 'Party size', minWidth: 50 },
    { id: 'resource', label: 'Resource', minWidth: 50 },
    { id: 'wait', label: 'Time waited', minWidth: 40 },
    { id: 'actions', label: '', minWidth: 160 },
];

export const noShowColumns = [
  { id: 'position', label: '#', minWidth: 5 },
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'size', label: 'Party size', minWidth: 50 },
  { id: 'resource', label: 'Resource', minWidth: 50 },
  { id: 'created', label: 'Created on', minWidth: 40 },
  { id: 'actions', label: '', minWidth: 160 },
];

export const clientOptions = [
    {id: 'move-up', label: 'Move up', icon: <NorthRoundedIcon/>},
    {id: 'move-down', label: 'Move down', icon: <SouthRoundedIcon/>},
    {id: 'no-show', label: 'No show', icon: <CancelIcon/>},
    {id: 'remove', label: 'Remove', icon: <DeleteIcon/>},
]

export const OPTIONS_SELECT = {
    NO_SHOW: 'no-show',
    MOVE_UP: 'move-up',
    MOVE_DOWN: 'move-down',
    EDIT: 'edit',
    REMOVE: 'remove'
}





