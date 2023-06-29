
import axios from "axios";
import { DateTime } from "luxon";
import DeleteIcon from '@mui/icons-material/Delete';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { getStateData, getAccessToken } from "../../auth/Auth";

const ENDPOINT_ACCEPTING = '/api/internal/update_accepting' 
const MINUTES_IN_HOUR = 60;

export const handleOpenNewTab = (endpoint) => {
    const url = 'http://localhost:3000/'+endpoint;
    window.open(url, '_blank');
};


/**
 * 
 * @param {Number} accepting    0: open client store 
 *                              1: close client store 
 * @param {*} dispatch          useSDispatch hook from redux
 */
export const requestChangeAccept = (accepting, dispatch) => {
    const { user , buisness} = getStateData();
    const accessToken = getAccessToken();
    const id = user.id;
    const email = user.email;
    const b_id = buisness._id;
    const headers = { headers: {'x-access-token': accessToken} }
    
    const requestBody = {
        id: id,
        accessToken,
        email: email,
        b_id,
        accepting
    };
    axios.put(ENDPOINT_ACCEPTING, requestBody, headers)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
}

/**
 * NEDS ATTENTION: sort function not being utilized.
 *                 Sort based on columns buttons ?
 * @returns Sorted buisness table, decending order based on timestamp.
 * 
 */
export const getUserTable = () => {
    const { user, buisness } = getStateData();
    const appointments = buisness.currentClients;
    if (!appointments){ return [] }
    const timezone = buisness.timezone;
    if (!timezone) { return new Error('No timezone to validate.');}
    const currentTime = DateTime.local().setZone(timezone);
    const sorted = appointments.sort(sortBaseTime);

    const wait = appointments.map((client) => {
        const luxonDateTime = DateTime.fromJSDate(new Date(client.timestamp));
        const diffMinutes = currentTime.diff(luxonDateTime, 'minutes').minutes;
        const diffHours = currentTime.diff(luxonDateTime, 'hours').hours;
        const hours = Math.floor(diffHours);
        const minutes = Math.floor(diffMinutes % MINUTES_IN_HOUR);
        return {
            ...client,
            waittime: { hours, minutes }
        }
    })
    return wait;
}

function sortBaseTime (a,b) {
    if (a.timestamp < b.timestamp){
        return -1
    }
    if(a.timestamp > b.timestamp){
        return 1;
    }
    return 0;
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





