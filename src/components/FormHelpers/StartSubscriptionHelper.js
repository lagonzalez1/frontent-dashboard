import axios from "axios";
import { getHeaders, getStateData } from "../../auth/Auth"



// Will need to send bid and uid to confirm subscription on MONGO ?
export const startSubscriptionTest = (priceId, bid) => {
    const header = getHeaders();
    const { _, business} = getStateData();
    return new Promise((resolve, reject) => {
        axios.post('/api/internal/create-checkout-session', {priceId, bid: business._id}, header)
        .then(response => {
            resolve(response)
        })
        .catch(error=> {
            reject(error)
        })
    })
}