import * as Yup from "yup";
import { getStateData, getAccessToken, getHeaders } from "../../auth/Auth";
import axios from "axios";

export const validationSchemaService = Yup.object().shape({
    title: Yup.string(),
    size: Yup.number().max(500),

});

export const validationSchemaResource = Yup.object().shape({
    title: Yup.string(),
    duration: Yup.number().max(500),
    description: Yup.string()
});


export const requestRemoveResource = (payload) => {
  return new Promise((resolve, reject) => {
    const { user, business} = getStateData();
    const headers = getHeaders();
    const data = { ...payload, b_id: business._id }
    axios.post('/api/internal/remove_resource', data, headers)
    .then(response => {
      reject(response.data.msg)
    })
    .catch(error => {
      reject(error)
    })
  })
}

export const requestRemoveService = (payload) => {
  return new Promise((resolve, reject) => {
    const { user, business} = getStateData();
    const headers = getHeaders();
    const data = { ...payload, b_id: business._id }
    axios.post('/api/internal/remove_service', data, headers)
    .then(response => {
      reject(response.data.msg)
    })
    .catch(error => {
      reject(error)
    })
  })
}




export const updateService = (data) => {
    const { user, business} = getStateData();
    const accessToken = getAccessToken();
    const payload = { ...data, bid: business._id}
    const headers = { headers: { 'x-access-token': accessToken } };
    return new Promise((resolve, reject) => {
        axios.put('/api/internal/service_text', payload, headers)
        .then(response => {
          if(response.status === 200) {
            resolve(response.data);
          }
          reject(response.data.status)

        })
        .catch(error => {
          reject(error)
        })
    })
  }


  
export const updateResource = (data) => {
    const { user, business} = getStateData();
    const accessToken = getAccessToken();
    const payload = { ...data, bid: business._id}
    const headers = { headers: { 'x-access-token': accessToken } };
    return new Promise((resolve, reject) => {
        axios.put('/api/internal/resource_text', payload, headers)
        .then(response => {
          if(response.status === 200) {
            resolve(response.data);
          }
          reject(response.data.status)

        })
        .catch(error => {
          reject(error)
        })
    })
  }