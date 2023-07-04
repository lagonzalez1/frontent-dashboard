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


  export const buisnessForms = (link) => {
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
  


  

