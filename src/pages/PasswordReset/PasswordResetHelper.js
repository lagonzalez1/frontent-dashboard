import axios from "axios";


export const isStrongPassword = (password) => {
    // Minimum length of 8 characters
    if (password.length < 8) {
      return false;
    }
  
    // Must contain at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return false;
    }
  
    // Must contain at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return false;
    }
  
    // Must contain at least one digit
    if (!/\d/.test(password)) {
      return false;
    }
  
    // Must contain at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return false;
    }
  
    // Passed all checks
    return true;
  };

export const requestPasswordUpdate = (email, token, password) => {
    return new Promise((resolve, reject) => {
        axios.post('/api/external/update_password', {email: email, token: token, newPassword: password})
        .then(response => {
            resolve(response);
        })
        .catch(error => {
            reject(error.data)
        })
    })
}