import axios from "axios";




export const requestResetToken = (email) => {
    return new Promise((resolve, reject) => {
        axios.post('/api/external/forgot_password', {email: email})
        .then(response => {
            resolve(response);
        })
        .catch(error => {
            reject(error)
        })
    })
}