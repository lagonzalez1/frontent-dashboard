
import axios from "axios";
import { DateTime } from "luxon";
import { getStateData, getAccessToken } from "../auth/Auth";
import { setBuisness } from "../reducers/buisness";
let GET_BUISNESS = '/api/internal/reload_buisness/'


export const reloadBuisnessData = (dispatch) => {
    const { user, buisness } = getStateData();
    if (!user  || !buisness ) { return new Error('Data not found.')}
    const accessToken = getAccessToken();
    const headers = { headers: {'x-access-token': accessToken} }
    const id = user.id;
    const bid = buisness._id;
    const ENDPOINT = GET_BUISNESS + id + '/' + bid;
    axios.get(ENDPOINT, headers)
    .then(response => {
        dispatch(setBuisness(response.data.buisness));
        return;
    })
    .catch(error => {
        console.log(error);
        return new Error(error);
    })

}

export const getEmployeeList = () => {
    const { _ , buisness} = getStateData();
    if (!buisness) { return new Error('Buisness data is empty.'); }
    const employees = buisness.employees;
    if (!employees){ return new Error('No employees found.'); }
    return employees;
}

export const findEmployee = (id) => {
    const { _ , buisness} = getStateData();
    if (!buisness) { return new Error('Buisness data is empty.'); }
    const employees = buisness.employees;
    if (!employees) { return new Error('No employees.')}
    for (var employee of employees){
        if ( employee._id === id){
            return employee;
        }
    }
    return new Error('Employee no longer exist.');
}



export const getClientsByResource = (id, resourceTag) => {
    const { _ , buisness} = getStateData();
    if (!buisness) { return new Error('Buisness data is empty.'); }
    const timezone = buisness.timezone;
    if (!timezone) { return new Error('No timezone available.')}
    const timestampNow = DateTime.now().setZone(timezone);
    const clientList = buisness.currentClients;
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
    const { _ , buisness} = getStateData();
    if (!buisness) { return []}
    const timezone = buisness.timezone;
    if (!timezone) { return []}

    const timestampNow = DateTime.now().setZone(timezone);
    const clientList = buisness.currentClients;
    let resources = buisness.resources;
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



/**
 * 
 * @param {String} id 
 * @returns Object      Object pertaining to a client in currentClients.
 *  
 */
export const findClient = (id) => {
    const { _ , buisness} = getStateData();
    if (!buisness) { return [] }
    const clients = buisness.currentClients;
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
    const { _ , buisness} = getStateData();
    if (!buisness) { return new Error('Buisness data is empty.'); }
    const resources = buisness.resources;
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
    const { _ , buisness} = getStateData();
    if (!buisness) { return new Error('Buisness data is empty.'); }
    const services = buisness.services;
    for (var service of services){
        if ( service._id === id){
            return service;
        }
    }
    return { error: 'No service found.'}
}   


export const getServicesAvailable = () => {
    const { _, buisness} = getStateData();
    if (!buisness) { return new Error('Buisness data ais empty.'); }
    const services = buisness.services;
    if ( !services ) { return []; }
    return services;
  }


export const getResourcesAvailable = () => {
    const { _, buisness} = getStateData();
    if (!buisness) { return new Error('Buisness data is empty.');}
    const resources = buisness.resources;
    if ( !resources ) { return []; }
    return resources;
}