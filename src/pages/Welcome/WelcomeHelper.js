import axios from "axios"
import { styled } from '@mui/system';
import { Card } from '@mui/material';

export const allowClientJoin = (time,link) => {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/external/businessState', { params: { link, time } })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  export const getExtras = (link) => {
    return new Promise((resolve, reject) => {
      axios
      .get('/api/external/buisnessExtras', { params: {link} })
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        }
        resolve(response.data.msg);
      })
      .catch((error) => {
        reject(error);
      })
    })
  }

  export const requestBusinessArguments = (link) => {
    return new Promise((resolve, reject) => {
        axios.get(`/api/external/businessArgs`, {params: {link}})
        .then(response => {
            resolve(response.data.payload);
        }) 
        .catch(error => {
            reject(error);
        })
    })
  }

  export const requestBusinessSchedule = (link) => {
    return new Promise((resolve, reject) => {
        axios.get(`/api/external/businessSchedule`, {params: {link}})
        .then(response => {
            resolve(response.data);
        }) 
        .catch(error => {
            reject(error);
        })
    })
  }


  export const getMax = (link) => {
    return new Promise((resolve, reject) => {
      axios
      .get('/api/external/serveMax', { params: {link} })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      })
    })
  }

  export const getBuisnessForm = (link) => {
    return new Promise((resolve, reject) => {
      axios
      .get('/api/external/businessForm', { params: {link} })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      })
    })
  }

  export const waitlistRequest = (payload) => {
    return new Promise((resolve, reject) => {
      axios.post('/api/external/waitlistRequest', payload)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      })
    })
  }

  export const checkDuplicatesRequest = (email, link) => {
    return new Promise((resolve, reject) => {
      axios
      .post('/api/external/checkDuplicates', {link, email} )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      })
    })
  }
  


  

