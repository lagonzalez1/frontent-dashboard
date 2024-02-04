import axios from "axios";
import { getHeaders } from "../../auth/Auth"



// Will need to send bid and uid to confirm subscription on MONGO ?
export const startSubscriptionTest = (priceId) => {
    const header = getHeaders();
    return new Promise((resolve, reject) => {
        axios.post('/api/internal/create-checkout-session', {priceId}, header)
        .then(response => {
            resolve(response)
        })
        .catch(error=> {
            reject(error)
        })
    })
}