
import axios from "axios";
import { DateTime } from "luxon";
import { getStateData, getAccessToken, getHeaders } from "../auth/Auth";
import { setBusiness } from "../reducers/business";


let POST_NOSHOW = '/api/internal/noShow';
let POST_ANALYTICS_DATA = '/api/internal/analytics_data';
let POST_UNDOSERVING = '/api/internal/undo_serving';
let POST_CLIENTTOSERVING = '/api/internal/client_to_serving';
let POST_APPOINTMENTCOMPLETE = '/api/internal/complete_appointment';
let POST_AVAILABLEAPPOINTMENTS = '/api/internal/available_appointments';
let POST_NOTIFYCLIENT = '/api/internal/notify_client';
let POST_SEND_CHAT = '/api/internal/send_chat'

let GET_WAITTIME = '/api/internal/waittime';
let GET_BUSINESS = '/api/internal/reload_business/';
let GET_SERVINGTABLE = '/api/internal/serving_table';
let GET_APPOINTMENTDATA = '/api/internal/appointment_data';
let GET_NOSHOW = '/api/internal/no_show';
let GET_WAITLIST = '/api/internal/get_waitlist';
let GET_EMPLOYEES = '/api/internal/get_employees'

export const reloadBusinessData = (dispatch) => {
    const { _, business } = getStateData();
    const accessToken = getAccessToken();
    const headers = { headers: {'x-access-token': accessToken} }
    const id = business._id;
    const ENDPOINT = GET_BUSINESS + id;
    axios.get(ENDPOINT, headers)
    .then(response => {
        dispatch(setBusiness(response.data.result));
        // Maybe get headers here again ?
    })
    .catch(error => {
        console.log(error);
        return new Error(error);
    })

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


export const sendChatToClient = (chat, id, type) => {
    const { user, business } = getStateData();
    const headers = getHeaders();
    const timestamp = DateTime.local().setZone(business.timezone).toISO();
    const data = {b_id: business._id, email: user.email, payload: {chat, clientId: id, type, timestamp}}
    return new Promise((resolve, reject) => {
        axios.post(POST_SEND_CHAT, data, {...headers, timeout: 900000, timeoutErrorMessage: 'Timeout error'})
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


export const getEmployees = () => {
    const { user, business} = getStateData();
    const headers = getHeaders();
    return new Promise((resolve, reject) => {
    axios.get(GET_EMPLOYEES, {...headers, params: { b_id: business._id, email: user.email}, timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
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

export const requestNoShow = (clientId, type) => {
    return new Promise((resolve, reject) => {
      const { user, business } = getStateData();
      const accessToken = getAccessToken();
      const headers = { headers: { 'x-access-token': accessToken } };
      const payload = { bId: business._id, clientId, type, email: user.email}
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

export const getAnalyticsClients = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const header = getHeaders();
        const data = { ...payload, bid: business._id, email: user.email}
        axios.post(POST_ANALYTICS_DATA, data, {...header, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
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
export const getWaitlistWaittime = (accessToken) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const date = DateTime.local().setZone(business.timezone).toISO();
        axios.get(GET_WAITTIME, {headers: {'x-access-token': accessToken}, params: {date, bid: business._id, email: user.email}, timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
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
export const undoClientServing = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const headers = getHeaders();
        const data = { ...payload, b_id: business._id, email: user.email}
        axios.post(POST_UNDOSERVING, data, {...headers, timeout: 90000, timeoutErrorMessage: 'Timeout errors'})
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

export const moveClientServing = (clientId, type, employeeId) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const headers = getHeaders();
        const currentTime = DateTime.local().setZone(business.timezone).toISO();
        const payload = { clientId, currentTime, b_id: business._id, isServing: true, type: type, employeeId, email: user.email }
        console.log(payload);
        console.log(POST_CLIENTTOSERVING)
        axios.post(POST_CLIENTTOSERVING, payload, {...headers, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
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
export const completeClientAppointment = (client) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const header = getHeaders();
        const currentTime = DateTime.local().setZone(business.timezone).toISO();
        const payload = {client: {...client}, b_id: business._id, currentTime, saveClient: true, clientNotes: '', email: user.email}
        axios.post(POST_APPOINTMENTCOMPLETE, payload, {...header, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
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

export const getAvailableAppointments = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const header = getHeaders();
        const data = { ...payload, bid: business._id, email: user.email}
        axios.post(POST_AVAILABLEAPPOINTMENTS,data,{...header, timeout: 90000, timeoutErrorMessage: 'Timeout Error'})
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

export const getServingClients = (accessToken) => {
    const { user, business } = getStateData();
    const bid = business._id;
    return new Promise((resolve, reject) => {
        axios.get(GET_SERVINGTABLE,{headers: {'x-access-token': accessToken}, params: {bid, email: user.email}, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
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
export const sendNotification = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const header = getHeaders();
        const data = { ...payload, bid: business._id, email: user.email}
        axios.post(POST_NOTIFYCLIENT, data, {...header, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
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

export const getServingCount = () => {
    const { user, business } = getStateData();
    try {
            let currentClients = business.currentClients;
            let clients = [];
            for (var client of currentClients){
                if (client.status.serving === true && client.status.cancelled === false && client.status.noShow === false) {
                    clients.push(client);
                }
            }
            const type = business.system.equalDate;
            if (!clients) {
                return [];
            }
            const timezone = business.timezone;
            if (!timezone) {
                return new Error('No timezone to validate.');
            }
            // Compare the current date to each client.
            let currentDates = [];
            let sorted = null;
            const currentTime = DateTime.local().setZone(timezone);

            if(type) {
                for (var client of clients) {
                    const clientDate = new DateTime.fromJSDate(new Date(client.timestamp));
                    if ( currentTime.hasSame(clientDate, 'day')){
                        currentDates.push(client);
                    }
                }
                sorted = currentDates.sort(sortBaseTime);
            }else {
                sorted = clients.sort(sortBaseTime);
            }
            let count = 0;
            for (var object of sorted) {
                count += object.partySize;
            }
            return {groupCount : sorted.length, groupTotalCount: count};
      } catch (error) {
            // Handle the error here
            console.error(error);
            return new Error(error); // Return an empty array or any other appropriate value
      }
};


// This might not be in use.
export const getAppointmentTable = (date, accessToken) => {
    return new Promise((resolve, reject) => {
        const { user,  business} = getStateData();
        const bid = business._id;
        axios.get(GET_APPOINTMENTDATA, { headers: {'x-access-token': accessToken} , params: {bid, appointmentDate: date, email: user.email}, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
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

export const getNoShowClients = (accessToken) => {
    const { user, business } = getStateData();
    return new Promise((resolve, reject) => {
        axios.get(GET_NOSHOW, {headers: {'x-access-token' : accessToken}, params: {bid: business._id, user: user.email}, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            resolve(response);
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



// Need to complete, this is the waitlist on Dashboard
export function getWaitlistTable (accessToken) {
    const { user , business } = getStateData();
    const headers = getHeaders();
    const email = user.email;
    const bid = business._id;
    const time = DateTime.local().setZone(business.timezone).toISO()
    console.log(time)
    
    return new Promise((resolve, reject) => {   
        axios.get(GET_WAITLIST,{headers: {'x-access-token': accessToken}, params: {time, bid, email}, timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
        .then(response => {
            resolve(response.data.result);
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