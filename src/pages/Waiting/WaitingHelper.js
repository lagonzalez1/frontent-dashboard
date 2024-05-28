import axios from "axios";
export const PHONE_REGEX = /^\d{3}-\d{3}-\d{4}$/;    
import { NumberOne, NumberTwo, NumberThree, NumberFour, NumberFive, NumberSix, NumberSeven, NumberEight, NumberNine } from "phosphor-react";
let GET_IDENTIFIER = '/api/external/identifierRequest';
let GET_EMPLOYEELIST = '/api/external/employeeList';
let GET_BUSINES_ARGS = `/api/external/businessArgs`;
let GET_TIMEZONE = `/api/external/businessTimezone`;

let POST_AVAILABLE_APPOINTMENTS = '/api/external/available_appointments';
let POST_EDITAPPOINTMENT = '/api/external/editAppointment';
let POST_CLIENTREIVEW = `/api/external/create_review`;
let POST_UPDATESTATUS = '/api/external/updateClientStatus';
let POST_REMOVE_REQUEST = '/api/external/removeRequest';
let POST_ACK_CHAT = '/api/external/ack_chat'



export const iconsList = (position) => {
    let iconLi = [i1, i2, i3, i4, i5, i6, i7, i8, i9, i10]
    return iconLi[position - 1];
}


export const acknowledgeChat = (clientId, link, type) => {
    return new Promise((resolve, reject) => {
        const data = { clientId, link , type}
        axios.post(POST_ACK_CHAT, data)
        .then(response => {
            resolve(response.data.msg)
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

export const getIdentifierData = (link, unid, timestamp) => {
    return new Promise((resolve, reject) => {
        axios.get(GET_IDENTIFIER,{ params: {link, unid, timestamp} } )
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
        .get(GET_EMPLOYEELIST, { params: { link, date } })
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


  export const getBusinessTimezone = (link) => {
    return new Promise((resolve, reject) => {
      axios.get(GET_TIMEZONE, { params: {link}, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
      .then((res) => {
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

export const requestClientEditApp = (payload) => {
    return new Promise((resolve, reject) => {
        axios.post(POST_EDITAPPOINTMENT, payload)
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
        axios.post(POST_CLIENTREIVEW, payload)
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
        axios.post(POST_AVAILABLE_APPOINTMENTS,data)
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
        axios.post(POST_UPDATESTATUS, payload)
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
        axios.post(POST_REMOVE_REQUEST, { link, unid, type})
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
        axios.get(GET_BUSINES_ARGS, {params: {link}})
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