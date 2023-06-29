import { styled } from '@mui/system';
import { Card } from '@mui/material';
import { getStateData } from '../../auth/Auth';


export const getServicesAvailable = () => {
  const { _, buisness} = getStateData();
  const services = buisness.services;
  if ( !services ) { return []; }
  return services;
}

export const getResourcesAvailable = () => {
  const { _, buisness} = getStateData();
  const resources = buisness.resources;
  if ( !resources ) { return []; }
  return resources;
}

export const StyledCardService = styled(Card)(({ theme }) => ({
    // Default styles for the card
    transition: '0.2s',
    boxShadow: theme.shadows[1],
    '&:hover': {
      // Styles to apply when the card is hovered over
      transform: 'translateY(-3px)',
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
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

export const resources = [
    { id: '1', title: 'Resource 1', waitlist: '5', serving: '3', active: true },
    { id: '2', title: 'Resource 2', waitlist: '10', serving: '7', active: false },
    { id: '3', title: 'Resource 3', waitlist: '2', serving: '0', active: true },
];