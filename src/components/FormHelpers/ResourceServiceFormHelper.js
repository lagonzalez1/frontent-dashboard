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


export const requestRemoveResource = (payload, bid, email) => {
  return new Promise((resolve, reject) => {
    const data = { ...payload, b_id: bid, email }
    axios.post('/api/internal/remove_resource', data, { timeout: 90000, timeoutErrorMessage: 'Timeout error'})
    .then(response => {
      reject(response.data.msg)
    })
    .catch(error => {
      if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
        reject('Request timed out. Please try again later.'); // Handle timeout error
    }
      reject(error)
    })
  })
}

export const requestRemoveService = (payload, bid, email) => {
  return new Promise((resolve, reject) => {
    const data = { ...payload, b_id: bid, email }
    axios.post('/api/internal/remove_service', data, { timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
    .then(response => {
      reject(response.data.msg)
    })
    .catch(error => {
      if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
        reject('Request timed out. Please try again later.'); // Handle timeout error
      }
      reject(error)
    })
  })
}




export const updateService = (data, bid, email) => {
    const payload = { ...data, bid: bid, email}
    return new Promise((resolve, reject) => {
        axios.put('/api/internal/service_text', payload, {timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
          if(response.status === 200) {
            resolve(response.data);
          }
          reject(response.data.status)

        })
        .catch(error => {
          if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
            reject('Request timed out. Please try again later.'); // Handle timeout error
        }
          reject(error)
        })
    })
  }


  
export const updateResource = (data) => {
    const { user, business} = getStateData();
    const accessToken = getAccessToken();
    const payload = { ...data, bid: business._id, email: user.email }
    const headers = { headers: { 'x-access-token': accessToken } };
    return new Promise((resolve, reject) => {
        axios.put('/api/internal/resource_text', payload, {...headers, timeout: 90000, timeoutErrorMessage: 'Timeout, error'})
        .then(response => {
          if(response.status === 200) {
            resolve(response.data);
          }
          reject(response.data.status)

        })
        .catch(error => {
          if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
            reject('Request timed out. Please try again later.'); // Handle timeout error
        }
          reject(error)
        })
    })
  }