
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
            reject("Error cannot hit analytics.");
        })
        
    })
  } 

  export const getAppointmentClients = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business } = getStateData();
        const header = getHeaders();
        const data = { ...payload, bid: business._id}
        axios.post('/api/internal/appointment_data', data, header)
        .then(response => {
            resolve(response.data.data);
        })
        .catch(error => {
            console.log(error);
            reject("Error cannot hit analytics.");
        })
        
    })
  } 

  export const cleanTable = () => {
    return new Promise((resolve, reject) => {
      const token = getAccessToken();
      const { user, business} = getStateData();
      const currentDate = DateTime.local().setZone(business.timezone).toISO();
      axios.put(`/api/internal/clean_tables/${currentDate}/${business._id}`, { headers: {'x-access-token': token} })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error);
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
          reject(error.response.data);
        }) 
        
      })
  }


  // Type: Appointment type can be either appointment, waitlist
  export const moveClientServing = (clientId, type) => {
    return new Promise((resolve, reject) => {
      const { user, business } = getStateData();
      const headers = getHeaders();
      const currentTime = new DateTime.local().setZone(business.timezone).toISO();
      const payload = { clientId, currentTime, b_id: business._id, isServing: true, type: type }
      axios.post('/api/internal/client_to_serving', payload, headers)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error.response.data);
      }) 
      
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



export const getClientsByResource = (id, resourceTag) => {
    const { _ , business} = getStateData();
    if (!business) { return new Error('business data is empty.'); }
    const timezone = business.timezone;
    if (!timezone) { return new Error('No timezone available.')}
    const timestampNow = DateTime.now().setZone(timezone);
    const clientList = business.currentClients;
    const list = [];

    for(var client of clientList){
        const timestamp = DateTime.fromISO(client.timestamp, { zone: 'utc' });
        const timestampInTimezone = timestamp.setZone(timezone);
        const sameDay = timestampNow.hasSame(timestampInTimezone, 'day');
        if ( client._id === id && client.resourceTag === resourceTag && sameDay === true){
            list.push(client);
        }
    }
    return list;
}


export const getResourceData = () => {
    const { _ , business} = getStateData();
    if (!business) { return []}
    const timezone = business.timezone;
    if (!timezone) { return []}

    const timestampNow = DateTime.now().setZone(timezone);
    const clientList = business.currentClients;
    let resources = business.resources;
    for (var client of clientList) {
        const timestamp = DateTime.fromISO(client.timestamp, { zone: 'utc' });
        const timestampInTimezone = timestamp.setZone(timezone);
        const sameDay = timestampNow.hasSame(timestampInTimezone, 'day');
        const hasTag = client.resourceTag ? true : false;
        if ( sameDay && hasTag ) {
            for (var resource of resources){
                if ( resource._id === client.resourceTag) {
                    if (!resource.attached) {
                        resource.attached = [client._id];
                      } else {
                        resource.attached.push(client._id);
                      }
                    break;        
                }
            }
        }
    }

    return resources
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
            // Waitlist end.

            for (var client of currentAppointments) {
                if (client.status.serving === true && client){
                    appointments.push(client);
                }
            }

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
            reject(error);

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


export const getAppointmentTable = (date) => {
    const { user,  business} = getStateData();
    try {
        
        let appointments = business.appointments;
        let filtered = []
        for (var client of appointments){
            const appDate = DateTime.fromISO(client.appointmentDate);
            
            if (appDate.hasSame(date, 'day') && client.status.serving !== true){
                filtered.push(client);
            }
        }
        return filtered;

    }
    catch (error) {
        // Handle the error here
        console.error(error);
        return new Error(error); // Return an empty array or any other appropriate value
    }
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