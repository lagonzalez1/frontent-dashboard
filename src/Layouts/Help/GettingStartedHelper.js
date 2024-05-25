import axios from "axios"
import { getHeaders, getStateData } from "../../auth/Auth";
import { DateTime } from "luxon";

const POST_QUICKSTART = '/api/internal/completeQuickstart';


export const completeQuickStart = () => {
    const header = getHeaders();
    const { user, business } = getStateData();
    const currentDate = DateTime.local().setZone(business.timezone).toISO();
    const data = { timestamp: currentDate, bid: business._id, email: user.email}
    return new Promise((resolve, reject) => {
        axios.post(POST_QUICKSTART, data, {...header, timeout: 90000, timeoutErrorMessage: 'Timeout error'} )
        .then(res => {
            resolve(res.data);
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