import axios from "axios"
import { styled } from '@mui/system';
import { Card } from '@mui/material';

export const allowClientJoin = (time,link) => {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/external/buisnessState', { params: { link, time } })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };


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
      .get('/api/external/buisnessForm', { params: {link} })
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
      .get('/api/external/checkDuplicates', { params: {link, email} })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      })
    })
  }
  


  

