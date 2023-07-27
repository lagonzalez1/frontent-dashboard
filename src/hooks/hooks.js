
import axios from "axios";
import { DateTime } from "luxon";
import { getStateData, getAccessToken } from "../auth/Auth";
import { setBusiness } from "../reducers/business";
let GET_BUSINESS = '/api/internal/reload_business/'


export const reloadBusinessData = (dispatch) => {
    const { user, _ } = getStateData();
    if (!user ) { return new Error('Data not found.')}
    const accessToken = getAccessToken();
    const headers = { headers: {'x-access-token': accessToken} }
    const id = user.id;
    const ENDPOINT = GET_BUSINESS + id;
    axios.get(ENDPOINT, headers)
    .then(response => {
        console.log(response.data);
        dispatch(setBusiness(response.data.business));
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
    return new Error('Employee no longer exist.');
}





export const getClientsByResource = (id, resourceTag) => {
    const { _ , business} = getStateData();
    if (!business) { return new Error('business data is empty.'); }
    const timezone = business.timezone;
    if (!timezone) { return new Error('No timezone available.')}
    const timestampNow = DateTime.now().setZone(timezone);
    const clientList = business.currentClients;
    const list = [];
    console.log(id)
    console.log(resourceTag)
    for(var client of clientList){
        const timestamp = DateTime.fromISO(client.timestamp, { zone: 'utc' });
        const timestampInTimezone = timestamp.setZone(timezone);
        const sameDay = timestampNow.hasSame(timestampInTimezone, 'day');
        if ( client._id === id && client.resourceTag === resourceTag && sameDay === true){
            list.push(client);
        }
    }
    console.log(list)
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
const MINUTES_IN_HOUR = 60;
export const getUserTable = () => {
    const { user, business } = getStateData();
      try {
            const clients = business.currentClients;
            const type = business.tables.dashboard;
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
            const luxonDateTime = DateTime.fromJSDate(new Date(client.timestampOrigin));
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
      console.log(timestampA.toString());
      return -1;
    }
    if (timestampA > timestampB) {
      console.log(timestampB.toString());
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
    return { error: 'No resource found.'}
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
    return { error: 'No service found.'}
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