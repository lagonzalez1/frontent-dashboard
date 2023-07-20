import axios from "axios";
import { getAccessToken, getStateData } from "../../auth/Auth";


export const getServicesAvailable = () => {
  const { user, business } = getStateData();

  if (!user || !business) {
    return []; // or any other appropriate value to indicate the absence of user or business
  }
  const services = business.services;
  if (!services) {
    return [];
  }

  return services;
};

export const getResourcesAvailable = () => {
  const { user, business } = getStateData();
  if (!business) {
    return []; // or any other appropriate value to indicate the absence of business
  }
  const resources = business.resources;
  if (!resources) {
    return [];
  }
  return resources;
};

export const addResource = (payload) => {
    return new Promise((resolve, reject) => {
      const { user, business } = getStateData();
      const accessToken = getAccessToken();
      const headers = { headers: { 'x-access-token': accessToken } };
      const b_id = business._id;
      const data = { b_id, ...payload };
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