

import axios from "axios";

export const PHONE_REGEX = /^\d{3}-\d{3}-\d{4}$/;    


export const getIdentifierData = (link, unid) => {
    return new Promise((resolve, reject) => {
        axios.get('/api/external/identifierRequest',{ params: {link, unid} } )
        .then(response => {
            resolve(response);
        })
        .catch(error => {
            reject(error);
        })
    });
}

export const getEmployeeList = (date,link) => {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/external/employeeList', { params: { link, date } })
        .then((response) => {
          if (response.status === 200){
            resolve(response.data.employees);
          }
          resolve(response.data.msg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

export const requestClientEditApp = (payload, link, unid) => {
    return new Promise((resolve, reject) => {
        const data = {...payload} 
        axios.post(`/api/external/editAppointment`, data)
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            reject(error)
        })       
    })
}

export const getAvailableAppointments = (payload) => {
    return new Promise((resolve, reject) => {
        const data = { ...payload}
        axios.post('/api/external/available_appointments',data)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            reject(error);

        })
    })
}


export const requestClientStatus = (payload) => {
    return new Promise ((resolve, reject) => {
        axios.post('/api/external/updateClientStatus', payload)
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            reject(error);
        })
    })
}

export const leaveWaitlistRequest = (link, unid, type) => {
    return new Promise((resolve, reject) => {
        axios.F('/api/external/removeRequest', { link, unid, type})
        .then(response => {
            resolve(response);
        }) 
        .catch(error => {
            reject(error);
        })
    })
}

export const requestBusinessArguments = (link) => {
    return new Promise((resolve, reject) => {
        axios.get(`/api/external/businessArgs`, {params: {link}})
        .then(response => {
            resolve(response.data.payload);
        }) 
        .catch(error => {
            reject(error);
        })
    })
}