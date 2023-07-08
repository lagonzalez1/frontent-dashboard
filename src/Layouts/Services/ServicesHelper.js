import { styled } from '@mui/system';
import { Card } from '@mui/material';



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