import axios from "axios";
import { getHeaders, getStateData } from "../../auth/Auth"



// Will need to send bid and uid to confirm subscription on MONGO ?
export const startSubscriptionTest = (priceId, bid, email) => {
    const header = getHeaders();
    const { _, business} = getStateData();
    const headers = getHeaders();
    return new Promise((resolve, reject) => {
        axios.post('/api/internal/create-checkout-session', {priceId, bid, email}, {...headers, timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
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