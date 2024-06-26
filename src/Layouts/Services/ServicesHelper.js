import axios from 'axios';
import { styled } from '@mui/system';
import { Card, Slide } from '@mui/material';
import { getAccessToken, getStateData } from '../../auth/Auth';
import { searchEmployees, getEmployeeList } from '../../hooks/hooks';
import React from 'react';


export const getServicesTotal  = () => {
    const { _, business} = getStateData();
    if ( !business ) { return new Error('No business data found.');}
    const services = business.services;
    let active = 0;
    let unactive = 0;
    for(var service of services) {
      switch(service.active){
        case true:
          active += 1;
          continue;
        case false:
          unactive += 1;
          continue
      }
    }
    return {active , unactive};
  
}



export const getEmployeeTags = (employeeTags, array) => {
    let employees = []
    if (employeeTags.length === 0) { return [];}
    for (var id of employeeTags) {
      const employee = searchEmployees(id, array);
      employees.push(employee);
    }
    return employees
}

export const removeExistingEmployees = (employeeIds) => {
    let currentEmployees = getEmployeeList();
    if (employeeIds.length === 0) { return currentEmployees;}
    return currentEmployees.filter(obj => !employeeIds.includes(obj._id));
}

export const updateService = (data, bid, email) => {
  const payload = { ...data, bid, email}
  return new Promise((resolve, reject) => {
      axios.put('/api/internal/update_service', payload, {timeout: 90000, timeoutErrorMessage: 'Timeout error'})
      .then(response => {
        if(response.status === 200) {
          resolve(response.data.msg);
        }
      })
      .catch(error => {
        console.log(error);
        if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
          reject('Request timed out. Please try again later.'); // Handle timeout error
      }
        if (error.response) {
            console.log(error.response);
            reject({msg: 'Response error', error: error.response});
        }
        else if (error.request){
            console.log(error.request);
            reject({msg: 'No response from server', error: error.request})
        }
        else {
            reject({msg: 'Request setup error', error: error.message})
        }
        
    })
  })
}



export const removeEmployeeTag = (data, bid, email) => {
  const payload = { ...data, bid, email}
  return new Promise((resolve, reject) => {
    axios.post('/api/internal/service_remove_tag',payload, { timeout: 90000, timeoutErrorMessage: 'Timeout error'})
      .then(response => {
        if(response.status === 200) {
          resolve(response.data.msg);
        }
      })
      .catch(error => {
        console.log(error);
        if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
          reject('Request timed out. Please try again later.'); // Handle timeout error
      }
        if (error.response) {
            console.log(error.response);
            reject({msg: 'Response error', error: error.response});
        }
        else if (error.request){
            console.log(error.request);
            reject({msg: 'No response from server', error: error.request})
        }
        else {
            reject({msg: 'Request setup error', error: error.message})
        }
        
    })
  })
}

export const getServicesAvailable = () => {
  const { _, business} = getStateData();
  if ( !business ) { return new Error('No business data found.');}
  const services = business.services;
  if ( !services ) { return []; }
  return services;
}

export const StyledCardService = styled(Card)(({ theme }) => ({
  // Default styles for the card
  transition: '0.2s',
  boxShadow: theme.shadows[1],
  '&:hover': {
    // Styles to apply when the card is hovered over
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
    
  },
}));

  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  export const stringAvatar = (name) => {
    let initials = '';
    if (!name) {return; }
  
    if (name.includes(' ')) {
      initials = `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`;
    } else {
      initials = name[0];
    }
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: initials,
    };
  }


  export const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});