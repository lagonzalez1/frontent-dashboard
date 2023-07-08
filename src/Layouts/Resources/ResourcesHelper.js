import axios from 'axios';
import { styled } from '@mui/system';
import { Card } from '@mui/material';
import { getStateData } from '../../auth/Auth';


export const getServicesAvailable = () => {
  const { _, buisness} = getStateData();
  if ( !buisness ) { return new Error('No buisness data found.');}
  const services = buisness.services;
  if ( !services ) { return []; }
  return services;
}

export const getResourcesAvailable = () => {
  const { _, buisness} = getStateData();
  if ( !buisness ) { return new Error('No buisness data found.');}
  const resources = buisness.resources;
  if ( !resources ) { return []; }
  return resources;
}



export const findServingSize = (id) => {
  const { _, buisness} = getStateData();
  if ( !buisness ) { return new Error('No buisness data found.');}
  const clients = buisness.currentClients;
  for (var client of clients){
    if (client.resourceTag === id) {
      return client.partySize;
    }
  }
  return 0;
}

export const findResourceTag = (id) => {
  const { _, buisness} = getStateData();
  if ( !buisness ) { return new Error('No buisness data found.');}
  const employees = buisness.employees;
  if ( !employees) { return new Error('No employees');}
  for (var employee of employees) {
    if (employee.resourceTag === id){
      return employee;
    }
  }
  return new Error('Employee no longer exist.');
}

export const update = async (form) => {
  const { user, buisness} = getStateData();
  const id = user.id;
  const bId = buisness._id;
  const data = { ...form, id, bId};
  console.log(data);
  // Create request here to update resource. 
  
}

export const StyledCardService = styled(Card)(({ theme }) => ({
    // Default styles for the card
    transition: '0.2s',
    boxShadow: theme.shadows[1],
    '&:hover': {
      // Styles to apply when the card is hovered over
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[2],
      backgroundColor: theme.palette.lightprop.main,
      color: theme.palette.dark.main,
      
    },
  }));

  export const getResourcesTotal = () => {
      const { _, buisness} = getStateData();
      const services = buisness.services;
      const active = 0;
      const unactive = 0;
      for (var service in services) {
        switch (service.active){
          case true:
            active += 1;
            continue;
          case false:
            unactive += 1;
            continue;  
        }
      
      }
      return {active, unactive}
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
  
  export function stringAvatar(name) {
    let initials = '';
  
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