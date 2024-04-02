
import * as Yup from 'yup';
import { getAccessToken } from '../../auth/Auth';
import axios from 'axios';



  
export const validationSchema = Yup.object().shape({
    position: Yup.boolean(),
    waitlist: Yup.boolean(),
    servicePrice: Yup.boolean(),
    employees: Yup.boolean(),
    resources: Yup.boolean(),
    services: Yup.boolean(),
    waittime: Yup.boolean(),
  });

export const LABELS = {
    position: 'Let clients know what place they are in line.',
    waitlist: 'Let clients see the current waitlist.',
    servicePrice: 'Let clients see the cost of a services.',
    employees: 'Let clients choose their preferred an employee.',
    resources: 'Let clients choose thier preferred resource.',
    services: 'Let clients choose their preferred service.',
    waittime: 'Based on your serving list, employee count and service duration calculate an estimated wait time.',
}

export const TITLE = {
    position: 'Show position',
    waitlist: 'Show waitlist',
    servicePrice: 'Show service price',
    employees: 'Show employees',
    resources: 'Show resources',
    services: 'Show services',
    waittime: 'Show est wait time',
}


export const requestExtraChanges = (payload) => {
    return new Promise((resolve, reject) => {
        const accessToken = getAccessToken();  
        const headers = { headers: { 'x-access-token': accessToken}} 
        axios.put('/api/internal/update_extras', payload, headers)
        .then(response => {
            if(response.status === 200){
                resolve(response.data);
            }
            reject(response.data.msg);
        })
        .catch(error => {
            reject(error);
        })
    })
}