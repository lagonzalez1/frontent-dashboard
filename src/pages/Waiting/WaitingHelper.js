import axios from "axios";
export const PHONE_REGEX = /^\d{3}-\d{3}-\d{4}$/;    

import { NumberOne, NumberTwo, NumberThree, NumberFour, NumberFive, NumberSix, NumberSeven, NumberEight, NumberNine } from "phosphor-react";

export const iconsList = (position) => {
    let iconLi = [i1, i2, i3, i4, i5, i6, i7, i8, i9, i10]
    return iconLi[position - 1];
}

export const getIdentifierData = (link, unid, timestamp) => {
    return new Promise((resolve, reject) => {
        axios.get('/api/external/identifierRequest',{ params: {link, unid, timestamp} } )
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

export const requestClientEditApp = (payload) => {
    return new Promise((resolve, reject) => {
        axios.post(`/api/external/editAppointment`, payload)
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            reject(error)
        })       
    })
}

export const requestClientReview = (payload) => {
    return new Promise((resolve, reject) => {
        axios.post(`/api/external/create_review`, payload)
        .then(response => {
            resolve(response.data);
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
        axios.post('/api/external/removeRequest', { link, unid, type})
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

export const placementTitle = {
    1: {abrv: 'st', message: 'You are up next!', icon: <NumberOne size={88} color="#40932a" weight="bold"/>, message2: 'Please check in at the front desk.'},
    2: {abrv: 'nd', message: 'Almost there!',  icon: <NumberTwo size={88} color="#40932a" weight="bold"/>, message2: 'Please check in at the front desk.'},
    3: {abrv: 'rd', message: 'You are almost there!',  icon: <NumberThree size={88} color="#40932a" weight="bold" />, message2: 'Please be ready to check in at thefront desk.'},
    4: {abrv: 'th', message: 'You are almost there!',  icon: <NumberFour size={88} color="#40932a" weight="bold"/>, message2: 'Please be ready to check in at thefront desk.'},
    5: {abrv: 'th', message: 'Thanks for staying patient',  icon: <NumberFive size={88} color="#40932a" weight="bold"/>, message2: 'Please keep us updated via the alert button!'},
    6: {abrv: 'th', message: 'Thanks for staying patient',  icon: <NumberSix size={88} color="#40932a" weight="bold"/>, message2: 'Please keep us updated via the alert button!'},
    7: {abrv: 'th', message: 'Thanks for staying patient',  icon: <NumberSeven size={88} color="#40932a" weight="bold"/>, message2: 'Please keep us updated via the alert button!'},
    8: {abrv: 'th', message: 'Thanks for staying patient',  icon: <NumberEight size={88} color="#40932a" weight="bold"/>, message2: 'Please keep us updated via the alert button!'},
    9: {abrv: 'th', message: 'Thanks for staying patient',  icon: <NumberNine size={88} color="#40932a" weight="bold"/>, message2: 'Please keep us updated via the alert button!'},
}