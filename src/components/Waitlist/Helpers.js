
import React from "react";
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
let GET_NOSHOW = '/api/internal/no_show';
let GET_WAITLIST = '/api/internal/get_waitlist';

export const handleOpenNewTab = (endpoint) => {
    const url = 'https://waitonline.us/welcome/'+endpoint;
    window.open(url, '_blank');
    return;
};


// Middleware not OK
export const requestBusinessState = () => {
  return new Promise((resolve, reject) => {
    const { user, business } = getStateData();
    const time = new DateTime.local().setZone(business.timezone).toISO();
    const headers = getHeaders();
    axios.get(`/api/internal/businessState/${business._id}/${time}`, {...headers, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
    .then(response => {
      resolve(response.data.isAccepting);
    })
    .catch(error => {
      if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
        reject('Request timed out. Please try again later.'); // Handle timeout error
      }
      reject(error.response.msg);
    })
  })
}


//* Middleware OK
export const requestNoShow = (clientId, type, bid, email) => {
  return new Promise((resolve, reject) => {
    
    const payload = { bId: bid, clientId, type, email}
    axios.post('/api/internal/noShow', payload, { timeout: 90000, timeoutErrorMessage: 'Timeout error'})
    .then(response => {
      resolve(response.data)

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

/**
 * 
 * @param {Number} accepting    0: open client store 
 *                              1: close client store 
 * @param {*} dispatch          useSDispatch hook from redux
 *                              Get current time and update the override, at the start of a new day
 *                              the client will be abel to override to go back to schedule by checking the current date. 
 *  * Middleware OK

 */
export const requestChangeAccept = (accepting, bid, email, currentDate) => {
  return new Promise((resolve, reject) => {
    const requestBody = {
      currentDate,
      email: email,
      b_id: bid,
      accepting
    };

    axios.put(ENDPOINT_ACCEPTING, requestBody, { timeout: 90000, timeoutErrorMessage: 'Timeout error'})
      .then(response => {
        resolve(response.data); // Resolve the promise with the response data
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
  });
};


/**
 * 
 * @param {String} clientId  
 * @param {Array} list 
 * @returns           Promise:
 *                    Logic: Get current client and manipulate timestamp to reflect 1-5ms below client.
 *                    Grab ref to client timestamp below.
 * Middleware OK
 */
export const moveClientUp = (clientId, currentClients, bid, email, timezone) => {
  return new Promise((resolve, reject) => {
    const list = currentClients;
    // No change to be made since list to small.
    if (list.length < 2) { return resolve('No changes made.'); }
    let clientAbove = null;
    let clientTimestamp = null;
    // Find client below.
    for (let index = 0; index < list.length; index++) {
        const client = list[index];
        if (client._id === clientId) {
            const next = index - 1;
            clientTimestamp = DateTime.fromISO(client.timestamp).setZone(timezone).toISO()
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
      const clientAboveTimestamp = DateTime.fromISO(clientAbove.timestamp).setZone(timezone).toISO()

      const payload = { clientId, clientTimestamp, clientSwapId: clientAbove._id ,bId: bid, clientSwapTimestamp :clientAboveTimestamp, email}
      axios.put('/api/internal/update_timestamp', payload, { timeout: 90000, timeoutErrorMessage: 'Timeout error'})
      .then(response => {
        if(response.status === 200){
          resolve(response.data.msg);
        }
        else{
          reject('Request timed out. Please try again later.'); // Handle timeout error

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
 *  * Middleware OK

 */
export const moveClientDown = (clientId, currentClients, bid, email, timezone) => {
  return new Promise((resolve, reject) => {
    const list = currentClients
    // No change to be made since list to small.
    if (list.length < 2) { return resolve('No changes made'); }
    let clientBelow = null;
    let clientTimestamp = null;
    console.log("LIST: ", list)
    // Find client below.
    for (let index = 0; index < list.length; index++) {
        const client = list[index];
        if (client._id === clientId) {
            const next = index + 1;
            clientTimestamp = DateTime.fromISO(client.timestamp).setZone(timezone).toISO();
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
      const clientSwapTimestamp = DateTime.fromISO(clientBelow.timestamp).setZone(timezone).toISO();
      const payload = { clientId, clientTimestamp, bId: bid, clientSwapTimestamp, clientSwapId: clientBelow._id, email}
      axios.put('/api/internal/update_timestamp',payload, { timeout: 90000, timeoutErrorMessage: 'Timeout error'})
      .then(response => {
        if(response.status === 200){
          resolve(response.data.msg);
        }else{
          resolve(response.data.msg);
        }
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
    }

  })
}


export const getNoShowClients = (bid, email) => {
  return new Promise((resolve, reject) => {
      axios.get(GET_NOSHOW, { params: {bid, email}, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
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

// Need to complete, this is the waitlist on Dashboard
export function getWaitlistTable (bid, email, time) {
    
  return new Promise((resolve, reject) => {   
      axios.get(GET_WAITLIST,{ params: {time, bid, email}, timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
      .then(response => {
          resolve(response.data.result);
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



// Middleware OK
export const removeClient = (id, type, bid, email) => {
 
  const payload = { clientId: id, bId: bid, type, email };
  return new Promise((resolve, reject) => {
    axios.post('/api/internal/remove_client', payload, {timeout: 90000, timeoutErrorMessage: 'Timeout error'})
      .then((response) => {
        resolve(response.data.msg);
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
  });
};


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
    { id: 'actions', label: 'Actions', minWidth: 100 },

  ];

export const noShowColumns = [
  { id: 'position', label: '#', minWidth: 5 },
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'size', label: 'Party size', minWidth: 50 },
  { id: 'resource', label: 'Resource', minWidth: 50 },
  { id: 'created', label: 'Created on', minWidth: 40 },
  { id: 'actions', label: '', minWidth: 140 },
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





