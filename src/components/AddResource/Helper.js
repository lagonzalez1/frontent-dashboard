import axios from "axios";
import { getAccessToken, getStateData } from "../../auth/Auth";


export const getServicesAvailable = () => {
    const { _, buisness} = getStateData();
    const services = buisness.services;
    if ( !services ) { return []; }
    return services;
}

export const getResourcesAvailable = () => {
    const { _, buisness} = getStateData();
    const resources = buisness.resources;
    if ( !resources ) { return []; }
    return resources;
}


export const addResource = (payload) => {
    return new Promise((resolve, reject) => {
      const { user, buisness } = getStateData();
      const accessToken = getAccessToken();
      const headers = { headers: { 'x-access-token': accessToken } };
      const id = user.id;
      const b_id = buisness._id;
      const data = { id, b_id, ...payload };
      axios
        .post('/api/internal/create_resource', data, headers)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    })
}