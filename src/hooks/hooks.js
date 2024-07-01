
import axios from "axios";
import { DateTime } from "luxon";
import { getStateData, getAccessToken, getHeaders } from "../auth/Auth";
import { setBusiness } from "../reducers/business";
import Cookies from 'js-cookie'


let POST_NOSHOW = '/api/internal/noShow';
let POST_ANALYTICS_DATA = '/api/internal/analytics_data';
let POST_UNDOSERVING = '/api/internal/undo_serving';
let POST_CLIENTTOSERVING = '/api/internal/client_to_serving';
let POST_APPOINTMENTCOMPLETE = '/api/internal/complete_appointment';
let POST_AVAILABLEAPPOINTMENTS = '/api/internal/available_appointments';
let POST_NOTIFYCLIENT = '/api/internal/notify_client';
let POST_SEND_CHAT = '/api/internal/send_chat'

let GET_WAITTIME = '/api/internal/waittime';
let GET_BUSINESS = '/api/internal/reload_business';
let GET_SERVINGTABLE = '/api/internal/serving_table';
let GET_APPOINTMENTDATA = '/api/internal/appointment_data';

let GET_EMPLOYEES = '/api/internal/get_employees'


// authId is the businessId
export const reloadBusinessData = (email, bid) => {
    //const headers = { headers: {'x-access-token': access_token} }
    return new Promise((resolve, reject) => {
        axios.get(GET_BUSINESS, {
            params: {
                b_id: bid,
                email: email
            },
            timeout: 90000,
            timeoutErrorMessage: 'Timeout error.'
        })
        .then(response => {
            resolve(response.data.result);
        })
        .catch(error => {
            console.log(error);
            reject(new Error('Failed to fetch business data.'));
        });
    });

}

export const getTimeZone = () => {
    const { _, business} = getStateData();
    if (!business) { return null; }
    return business.timezone;
}

export const getEmployeeList = () => {
    const { _ , business} = getStateData();
    if (!business) { return new Error('business data is empty.'); }
    const employees = business.employees;
    if (!employees){ return new Error('No employees found.'); }
    return employees;
}


export const sendChatToClient = (chat, id, type, bid, email, timestamp) => {
    const data = {b_id: bid, email, payload: {chat, clientId: id, type, timestamp}}
    return new Promise((resolve, reject) => {
        axios.post(POST_SEND_CHAT, data, { timeout: 900000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            resolve(response.data.msg);
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


export const getEmployees = (bid, email) => {
    
    return new Promise((resolve, reject) => {
    axios.get(GET_EMPLOYEES, { params: { b_id: bid, email}, timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
    .then(response => {
        resolve(response.data);
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

export const findEmployee = (id) => {
    const { _ , business} = getStateData();
    if (!business) { return new Error('business data is empty.'); }
    const employees = business.employees;
    if (!employees) { return new Error('No employees.')}
    for (var employee of employees){
        if ( employee._id === id){
            return employee;
        }
    }
    return {fullname: 'NA'}
}

export const requestNoShow = (clientId, type, bid, email) => {
    return new Promise((resolve, reject) => {
      const payload = { bId: bid, clientId, type, email}
      axios.post(POST_NOSHOW, payload, {...headers, timeout: 900000, timeoutErrorMessage: 'Timeout error'})
      .then(response => {
        if(response.status === 200){
          resolve(response.data.client)
        }else {
            reject(response.data.msg)
        }
      })
      .catch(error => {
        if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
            reject('Request timed out. Please try again later.'); // Handle timeout error
        }
        reject(error);
      })
  
    })
}

export const getAnalyticsClients = (payload, bid, email) => {
    return new Promise((resolve, reject) => {

        const data = { ...payload, bid, email: email}
        axios.post(POST_ANALYTICS_DATA, data, {timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            resolve(response.data);
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


export const getWaitlistWaittime = (bid, email, date) => {
    return new Promise((resolve, reject) => {
        axios.get(GET_WAITTIME, { params: {date, bid, email}, timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
        .then(response => {
          resolve(response.data);
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

// Middleware OK
export const undoClientServing = (payload, bid, email) => {
    return new Promise((resolve, reject) => {
        const data = { ...payload, b_id:bid, email}
        axios.post(POST_UNDOSERVING, data, { timeout: 90000, timeoutErrorMessage: 'Timeout errors'})
        .then(response => {
          resolve(response.data);
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
            }        }) 
        
      })
}

export const moveClientServing = (clientId, type, employeeId, bid, email, currentTime) => {
    return new Promise((resolve, reject) => {
        const payload = { clientId, currentTime, b_id: bid, isServing: true, type: type, employeeId, email }
        axios.post(POST_CLIENTTOSERVING, payload, { timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            resolve(response.data);
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

// Middleware OK
export const completeClientAppointment = (client, currentTime ,bid, email) => {
    return new Promise((resolve, reject) => {
        const payload = {client: {...client}, b_id: bid, currentTime, saveClient: true, clientNotes: '', email}
        axios.post(POST_APPOINTMENTCOMPLETE, payload, { timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            resolve(response.data);
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

export const getAvailableAppointments = (payload, bid, email) => {
    return new Promise((resolve, reject) => {
        const data = { ...payload, bid: bid, email}
        axios.post(POST_AVAILABLEAPPOINTMENTS,data,{ timeout: 90000, timeoutErrorMessage: 'Timeout Error'})
        .then(response => {
            resolve(response.data);
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

export const getServingClients = (bid, email) => {
    return new Promise((resolve, reject) => {
        axios.get(GET_SERVINGTABLE,{ params: {bid, email}, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            resolve(response.data);
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
// Middleware OK
export const sendNotification = (payload, bid, email) => {
    return new Promise((resolve, reject) => {
        const data = { ...payload, bid: bid, email}
        axios.post(POST_NOTIFYCLIENT, data, {timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            resolve(response.data);
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



// This might not be in use.
export const getAppointmentTable = (date, bid, email) => {
    return new Promise((resolve, reject) => {
        axios.get(GET_APPOINTMENTDATA, { params: {bid, appointmentDate: date, email}, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            resolve(response.data);
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





/**
 * 
 * Dependancies: 
 * TYPE:
 * True: Find all current (date) clients. 
 * False: Return all possiblle clients in list
 * 
 * 
 *  @returns Sorted business table, decending order based on timestamp.
 */

  function sortBaseTime(a, b) {
    const timestampA = DateTime.fromISO(a.timestamp);
    const timestampB = DateTime.fromISO(b.timestamp);
  
    if (timestampA < timestampB) {
      return -1;
    }
    if (timestampA > timestampB) {
      return 1;
    }
    return 0;
  }


/**
 * 
 * @param {String} id 
 * @returns Object      Object pertaining to a client in currentClients.
 *  
 */
export const findClient = (id) => {
    const { _ , business} = getStateData();
    if (!business) { return [] }
    const clients = business.currentClients;
    if ( !clients) { return [] }
    for( var client of clients) {
        if (client._id === id) {
            return client;
        }
    }
    return [];
}


/**
 * 
 * @param {String} id 
 * @returns Object      Object pertaining to service.
 *  
 */
export const findResource = (id) => {
    const { _ , business} = getStateData();
    if (!business) { return new Error('business data is empty.'); }
    const resources = business.resources;
    for (var resource of resources){
        if ( resource._id === id){
            return resource;
        }
    }
    return { title: 'NA'}
}

export const searchResources = (id, resources) => {
    if (resources.length === 0) { return; }
    for (let i = 0, n = resources.length; i < n; ++i) {
        const resource = resources[i];
        if (resource._id === id) { return resource; }
    }
    return { title: 'Not applicable'}
}

export const searchServices = (id, services) => {
    if (services.length === 0) { return; }
    for (let i = 0, n = services.length; i < n; ++i) {
        const service = services[i];
        if (service._id === id) { return service; }
    }
    return { title: 'Not applicable'}
}



export const searchEmployees = (id, employees) => {
    if (employees.length === 0) { return; }
    for (let i = 0, n= employees.length; i < n ; ++i) {
        const employee = employees[i];
        if (employee._id === id ){ return employee; }
    }
    return { fullname: 'Na.'}
}

/**
 * 
 * @param {String} id 
 * @returns Object      Object pertaining to service.
 *  
 */
export const findService = (id) => {
    const { _ , business} = getStateData();
    if (!business) { return new Error('business data is empty.'); }
    const services = business.services;
    for (var service of services){
        if ( service._id === id){
            return service;
        }
    }
    return { title: 'NA'}
}   


export const getServicesAvailable = () => {
    const { _, business} = getStateData();
    if (!business) { return new Error('business data ais empty.'); }
    const services = business.services;
    if ( !services ) { return []; }
    return services;
  }


export const getResourcesAvailable = () => {
    const { _, business} = getStateData();
    if (!business) { return new Error('business data is empty.');}
    const resources = business.resources;
    if ( !resources ) { return []; }
    return resources;
}


export const findPossibleOverride = () => {
    const { _ , business } = getStateData();
    const closedDates = business.closedDates;
    
}