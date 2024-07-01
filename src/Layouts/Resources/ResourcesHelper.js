import axios from 'axios';
import { styled } from '@mui/system';
import { Card, Slide } from '@mui/material';
import { getAccessToken, getStateData } from '../../auth/Auth';
import React from 'react';


export const getServicesAvailable = () => {
  const { _, business} = getStateData();
  if ( !business ) { return new Error('No business data found.');}
  const services = business.services;
  if ( !services ) { return []; }
  return services;
}

export const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



export const getResourcesAvailable = () => {
  const { _, business} = getStateData();
  if ( !business ) { return new Error('No business data found.');}
  const resources = business.resources;
  if ( !resources ) { return []; }
  return resources;
}



// This need to be updated based on the fact that multiple people can be on a resource.
export const findResourceServing = (id) => {
  const { _, business} = getStateData();
  if ( !business ) { return new Error('No business data found.');}
  let total = []
  const appointmentClients = business.appointments;
  const clients = business.currentClients;
  for (var client of clients){
    if (client.resourceTag === id && client.status.serving === true) {
      total.push(client);
    }
  }
  for (var client of appointmentClients) {
    if (client.resourceTag === id && client.status.serving === true) {
      total.push(client);
    }
  }
  return total;
}

export const findResourceTag = (id) => {
  const { _, business} = getStateData();
  if ( !business ) { return new Error('No business data found.');}
  const employees = business.employees;
  if ( !employees) { return new Error('No employees');}
  for (var employee of employees) {
    if (employee._id === id){
      return employee.fullname;
    }
  }
  return 'None';
}



export const updateResources = async (form, bid, email) => {
  return new Promise((resolve, reject) => {
    const data = { ...form, bId:bid, email};
    axios.put('/api/internal/update_resources', data, { timeout: 90000, timeoutErrorMessage: 'Timeout error'})
    .then(response => {
      if (response.status === 200){
        resolve(response.data.msg)
      }
    })
    .catch(error => {
      console.log(error);
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

  export const getResourcesTotal = () => {
      const { _, business} = getStateData();
      const resources = business.resources;
      let active = 0;
      let inactive = 0;
      for (const resource of resources) {
        if (resource.active === true) {
          active += 1;
        } 
        if(resource.active === false) {
          inactive += 1;
        }
      }
      return {active, inactive}
  }




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

export const resources = [
    { id: '1', title: 'Resource 1', waitlist: '5', serving: '3', active: true },
    { id: '2', title: 'Resource 2', waitlist: '10', serving: '7', active: false },
    { id: '3', title: 'Resource 3', waitlist: '2', serving: '0', active: true },
];