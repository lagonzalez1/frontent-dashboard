import axios from "axios";
import { getHeaders, getStateData } from "../../auth/Auth";
import { DateTime } from "luxon";
const MINUTES_IN_HOUR = 60;



export const currentTimePosition = () => {
    const { _ , business} = getStateData();
    const timezone = business.timezone;
    if (!timezone) { return 'No timezone present.';}

}

export const completeClientAppointment = (client, clientNotes, saveClient) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const header = getHeaders();
        const currentTime = DateTime.local().setZone(business.timezone).toISO();
        const payload = {client: {...client}, b_id: business._id, currentTime, clientNotes, saveClient, email: user.email}
        axios.post('/api/internal/complete_appointment', payload, header)
        .then(response => {
            resolve(response.data);
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

export const columns = [
    { id: 'position', label: '#', minWidth: 10 },
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'size', label: 'Party size', minWidth: 50 },
    { id: 'employee', label: 'Served by', minWidth: 50 },
    { id: 'resource', label: 'Using', minWidth: 50 },
    { id: 'time', label: '(current) Duration', minWidth: 40 },
    { id: 'actions', label: 'Actions', minWidth: 160 },
];

