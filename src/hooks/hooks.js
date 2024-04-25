
import axios from "axios";
import { DateTime } from "luxon";
import { getStateData, getAccessToken, getHeaders } from "../auth/Auth";
import { setBusiness } from "../reducers/business";
let GET_BUSINESS = '/api/internal/reload_business/'


export const reloadBusinessData = (dispatch) => {
    const { _, business } = getStateData();
    const accessToken = getAccessToken();
    const headers = { headers: {'x-access-token': accessToken} }
    const id = business._id;
    const ENDPOINT = GET_BUSINESS + id;
    axios.get(ENDPOINT, headers)
    .then(response => {
        dispatch(setBusiness(response.data.result));
    })
    .catch(error => {
        console.log(error);
        return new Error(error);
    })

}

export const getEmployeeList = () => {
    const { _ , business} = getStateData();
    if (!business) { return new Error('business data is empty.'); }
    const employees = business.employees;
    if (!employees){ return new Error('No employees found.'); }
    return employees;
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
      const payload = { bId: business._id, clientId, type}
      axios.post('/api/internal/noShow', payload, headers)
      .then(response => {
        if(response.status === 200){
          resolve(response.data.client)
        }else {
            reject(response.data.msg)
        }
      })
      .catch(error => {
        reject(error);
      })
  
    })
  }

  // Allow employees that sign in to change their availability.
  // Also allow managment and root edit.
  export function allowEmployeeEdit(permissionLevel, signOnEmail, employeeFromList) {

    let allow = false;
    if (signOnEmail === employeeFromList.employeeUsername) {
        allow = false;
    }
    else {
        if (permissionLevel === 0 || permissionLevel === 1 || permissionLevel === 2){
            allow = false
        }
        else {
            allow = true;
        }
    }
    return allow;
    
  }


    // No longer do i need to create a new Analytic, we can assume it exist since regisstration handles that.
    // Analytics has changed so now this need to reflect the new strcuture.
    // Mongodb Service doc: {businessId, name, email, ...waitlist[], ...appointments[]}
    // Nov 12 2023

  export const getAnalyticsClients = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const header = getHeaders();
        const data = { ...payload, bid: business._id}
        axios.post('/api/internal/analytics_data', data, header)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            console.log(error);
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

  export const getAppointmentClients = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const header = getHeaders();
        const data = { ...payload, bid: business._id}
        axios.get('/api/internal/appointment_data', data, header)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            console.log(error);
            reject("Error cannot hit analytics.");
        })
        
    })
  } 

  export const cleanTable = () => {
    return new Promise((resolve, reject) => {
      const headers = getHeaders();
      const { user, business} = getStateData();
      const currentDate = DateTime.local().setZone(business.timezone).toISO();
      axios.post(`/api/internal/clean_tables/${currentDate}/${business._id}`, headers)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error);
      })

    })
  }

  export const getWaitlistWaittime = () => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const headers = getHeaders();
        const date = DateTime.local().setZone(business.timezone).toISO();
        axios.get(`/api/internal/waittime/${date}/${business._id}`, headers)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
            console.log(error);
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


  export const undoClientServing = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const headers = getHeaders();
        const data = { ...payload, b_id: business._id}
        axios.post('/api/internal/undo_serving', data, headers)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
            console.log(error);
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


  // Type: Appointment type can be either appointment, waitlist
  export const moveClientServing = (clientId, type, employeeId) => {
    return new Promise((resolve, reject) => {
      const { user, business } = getStateData();
      const headers = getHeaders();
      const currentTime = new DateTime.local().setZone(business.timezone).toISO();
      const payload = { clientId, currentTime, b_id: business._id, isServing: true, type: type, employeeId }
      axios.post('/api/internal/client_to_serving', payload, headers)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.log(error);
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
        }      }) 
      
    })
  }

  export const completeClientAppointment = (client) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const header = getHeaders();
        const currentTime = DateTime.local().setZone(business.timezone).toISO();
        const payload = {client: {...client}, b_id: business._id, currentTime, saveClient: true, clientNotes: ''}
        axios.post('/api/internal/complete_appointment', payload, header)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            reject(error.response.data);
        })
        
    })
}


export const getAvailableAppointments = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const header = getHeaders();
        const data = { ...payload, bid: business._id}
        axios.post('/api/internal/available_appointments',data,header)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            reject(error);

        })
    })
}



/*
    Handle all error codes and route to correct destination.
                            REJECTS:    
 *                              400 -> Bad Request, missing tokens.
 *                              401 -> Unauthenticated try again.
 *                              403 -> Reject sign out.
*/
export const handleErrorCodes = (error) => {  
    //
}



// This can be made into a backend request.
const MINUTES_IN_HOUR = 60;
export const getServingTable = () => {
    const { user, business } = getStateData();
    try {
            let currentClients = business.currentClients;
            let clients = [];
            for (var client of currentClients){
                if (client.status.serving === true) {
                    clients.push(client);
                }
            }
            console.log(clients);
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
            
            // Add wait time in {hour, minute}
            const wait = sorted.map((client) => {
            const luxonDateTime = DateTime.fromJSDate(new Date(client.status.serve_time));
            const diffMinutes = currentTime.diff(luxonDateTime, 'minutes').minutes;
            const diffHours = currentTime.diff(luxonDateTime, 'hours').hours;
            const hours = Math.floor(diffHours);
            const minutes = Math.floor(diffMinutes % MINUTES_IN_HOUR);
            return {
                ...client,
                waittime: { hours, minutes },
            };
            });
            return wait;
      } catch (error) {
            // Handle the error here
            console.error(error);
            return new Error(error); // Return an empty array or any other appropriate value
      }
};

export const getWaitlistServingTable = () => {
    const { user, business } = getStateData();
    const currentTime = DateTime.local();
    try {
        let currentWaitlist = business.currentClients;
        let sameDayWaitlist = business.system.equalDate;
    
        let waitlist = [];
        let sorted = null;

        // Same day waitlist active
        if (sameDayWaitlist) {
            for (var client of currentWaitlist){
                if (client.status.serving === true && currentTime.hasSame(client.timestampOrigin, 'day') ) {
                    waitlist.push(client);
                }
            }
        }else {
            for (var client of currentWaitlist){
                if (client.status.serving === true) {
                    waitlist.push(client);
                }
            }
        }

        sorted = waitlist.sort(sortAppointmentTime);
        
        // Add wait time in {hour, minute}
        const wait = sorted.map((client) => {
        const luxonDateTime = DateTime.fromISO(client.status.serve_time);
        const diffMinutes = currentTime.diff(luxonDateTime, 'minutes').minutes;
        const diffHours = currentTime.diff(luxonDateTime, 'hours').hours;
        const hours = Math.floor(diffHours);
        const minutes = Math.floor(diffMinutes % MINUTES_IN_HOUR);
            return {
                ...client,
                waittime: { hours, minutes },
            };
        });
        return wait;
  } catch (error) {
        // Handle the error here
        console.error(error);
        return new Error(error); // Return an empty array or any other appropriate value
  }
}


export const getServingClients = () => {
    const { user, business } = getStateData();
    const bid = business._id;
    const headers = getHeaders();
    return new Promise((resolve, reject) => {
        axios.get(`/api/internal/serving_table/${bid}`, headers)
        .then(response => {
            resolve(response.data.result);
        })
        .catch(error => {
            console.log(error);
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

export const getAppointmentServingTable = () => {
    const { user, business } = getStateData();
    const currentTime = DateTime.local();
    try {
            let currentAppointments = business.appointments;
            let currentWaitlist = business.currentClients;
            let sameDayWaitlist = business.system.equalDate;
        
            let waitlist = [];
            let appointments = [];
            let sorted = null;

            console.log("Current", currentAppointments);

            for (var client of currentAppointments) {
                console.log(client);
                if (client.status.serving === true){
                    appointments.push(client);
                }
            }
            console.log(appointments);

            sorted = appointments.sort(sortAppointmentTime);
            
            // Add wait time in {hour, minute}
            const wait = sorted.map((client) => {
            const luxonDateTime = DateTime.fromISO(client.status.serve_time);
            const diffMinutes = currentTime.diff(luxonDateTime, 'minutes').minutes;
            const diffHours = currentTime.diff(luxonDateTime, 'hours').hours;
            const hours = Math.floor(diffHours);
            const minutes = Math.floor(diffMinutes % MINUTES_IN_HOUR);
                return {
                    ...client,
                    waittime: { hours, minutes },
                };
            });
            return wait;
      } catch (error) {
            // Handle the error here
            console.error(error);
            return new Error(error); // Return an empty array or any other appropriate value
      }
};


export const sendNotification = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const header = getHeaders();
        const data = { ...payload, bid: business._id}
        axios.post('/api/internal/notify_client', data, header)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            console.log(error);
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
                if (client.status.serving === true) {
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
export const getAppointmentTable = (date) => {
    return new Promise((resolve, reject) => {
        const { user,  business} = getStateData();
        const bid = business._id;
        const headers = getHeaders();
        axios.get(`/api/internal/appointment_data/${bid}/${date}`, headers)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            console.log(error);
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


export const getNoShowClients = () => {
    const { user, business } = getStateData();
    const headers = getHeaders();
    return new Promise((resolve, reject) => {
        axios.get(`/api/internal/no_show/${business._id}`, headers)
        .then(response => {
            resolve(response);
        })
        .catch(error => {
            console.log(error);
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
export function getWaitlistTable () {
    const { _ , business } = getStateData();
    const headers = getHeaders();
    const bid = business._id;
    return new Promise((resolve, reject) => {   
        axios.get(`/api/internal/get_waitlist/${bid}`, headers)
        .then(response => {
            resolve(response.data.result);
        })
        .catch(error => {
            console.log(error);
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
export const getUserTable = () => {
    const { user, business } = getStateData();
    try {
            let currentClients = business.currentClients;
            let clients = [];
            for (var client of currentClients){
                if (client.status.serving === false) {
                    clients.push(client);
                }
            }
            const type = business.system.equalDate;

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
                    const clientDate = DateTime.fromISO(client.timestamp);
                    if ( currentTime.hasSame(clientDate, 'day')){
                        currentDates.push(client);
                    }
                }
                sorted = currentDates.sort(sortBaseTime);
            }else {
                sorted = clients.sort(sortBaseTime);
            }
            // Add wait time in {hour, minute}
            const wait = sorted.map((client) => {
            const luxonDateTime = DateTime.fromISO(client.timestampOrigin);

            const diffMinutes = currentTime.diff(luxonDateTime, 'minutes').minutes;
            const diffHours = currentTime.diff(luxonDateTime, 'hours').hours;
            const hours = Math.floor(diffHours);
            const minutes = Math.floor(diffMinutes % MINUTES_IN_HOUR);
            return {
                ...client,
                waittime: { hours, minutes },
            };
            });
            return wait;
      } catch (error) {
            // Handle the error here
            console.error(error);
            return new Error(error); // Return an empty array or any other appropriate value
      }
};

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

  function sortAppointmentTime (a,b) {
    const timestampA = DateTime.fromISO(a.appointmentDate);
    const timestampB = DateTime.fromISO(b.appointmentDate);
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