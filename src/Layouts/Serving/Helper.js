import axios from "axios";
import { getHeaders, getStateData } from "../../auth/Auth";
import { DateTime } from "luxon";
const MINUTES_IN_HOUR = 60;


export const getServingCount = () => {
    const { _ , business } = getStateData();
    if (!business) { return new Error('Buisness data is empty.')}
    const currentList = business.currentClients;
    console.log(currentList);
    if (currentList.length === 0) { return { groupCount: 0 ,groupTotalCount: 0} }
    let groupCount = 0;
    let groupTotalCount = 0;
    for (var object of currentList) {
        if (object.status.serving === true){
            groupCount += 1;
            console.log(object.partySize);
        }   groupTotalCount += object.partySize;
    }
    return { groupCount, groupTotalCount };
}

export const currentTimePosition = () => {
    const { _ , business} = getStateData();
    const timezone = business.timezone;
    if (!timezone) { return 'No timezone present.';}

}


export const completeClientAppointment = (client) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const header = getHeaders();
        const currentTime = DateTime.local().setZone(business.timezone).toISO();
        const payload = {client: {...client}, b_id: business._id, currentTime}
        axios.post('/api/internal/complete_appointment', payload, header)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            reject(error.response.data);
        })
        
    })
}





export const columns = [
    { id: 'position', label: '#', minWidth: 10 },
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'size', label: 'Party size', minWidth: 50 },
    { id: 'resource', label: 'Using', minWidth: 50 },
    { id: 'time', label: 'Duration', minWidth: 40 },
    { id: 'actions', label: 'Actions', minWidth: 160 },
];

