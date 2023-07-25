import axios from 'axios';
import { styled } from '@mui/system';
import { Card } from '@mui/material';
import { getAccessToken, getStateData } from '../../auth/Auth';
import { findEmployee, getEmployeeList } from '../../hooks/hooks';




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



export const getEmployeeTags = (employeeTags) => {
    let employees = []
    if (employeeTags.length === 0) { return [];}
    for (var id of employeeTags) {
      const employee = findEmployee(id)
      employees.push(employee);
    }
    return employees
}

export const removeExistingEmployees = (employeeIds) => {
    let currentEmployees = getEmployeeList();
    if (employeeIds.length === 0) { return currentEmployees;}
    let result = []
    const filtered = currentEmployees.filter((obj) => {
      if (Object.keys(obj).includes('_id') ) {
        return !employeeIds.every((id) => obj['_id'].includes(id) );
      }
      result.push(obj);
      return true
    })
    return result;
}

export const updateService = (data) => {
  const { user, business} = getStateData();
  const accessToken = getAccessToken();
  const payload = { ...data, bid: business._id}
  const headers = { headers: { 'x-access-token': accessToken } };
  return new Promise((resolve, reject) => {
      axios.put('/api/internal/update_service', payload, headers)
      .then(response => {
        if(response.status === 200) {
          resolve(response.data.msg);
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

export const removeEmployeeTag = (data) => {
  const { user, business} = getStateData();
  const accessToken = getAccessToken();
  const payload = { ...data, bid: business._id}
  const headers = { headers: { 'x-access-token': accessToken } };
  return new Promise((resolve, reject) => {
    axios.put('/api/internal/service_remove_tag',payload, headers)
      .then(response => {
        if(response.status === 200) {
          resolve(response.data.msg);
        }
      })
      .catch(error => {
        reject(error)
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
    backgroundColor: theme.palette.lightprop.main,
    color: theme.palette.dark.main,
    
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
