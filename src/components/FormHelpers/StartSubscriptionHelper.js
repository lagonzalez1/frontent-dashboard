import axios from "axios";
import { getHeaders, getStateData } from "../../auth/Auth"



// Will need to send bid and uid to confirm subscription on MONGO ?
export const startSubscriptionTest = (priceId) => {
    const header = getHeaders();
    const { _, business} = getStateData();
    return new Promise((resolve, reject) => {
        axios.post('/api/internal/create-checkout-session', {priceId, bid: business._id}, {...headers, timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
        .then(response => {
            resolve(response)
        })
        .catch(error=> {
            if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
                reject('Request timed out. Please try again later.'); // Handle timeout error
            }
            reject(error)
        })
    })
}