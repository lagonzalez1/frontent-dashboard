import { styled } from '@mui/system';
import { Card } from '@mui/material';



/**
 * Card style for Register page.
 * Allows hover and change color.
 */
export const StyledCard = styled(Card)(({ theme }) => ({
    // Default styles for the card
    transition: '0.3s',
    boxShadow: theme.shadows[1],
    '&:hover': {
      // Styles to apply when the card is hovered over
      transform: 'translateY(-6px)',
      boxShadow: theme.shadows[5],
      backgroundColor: theme.palette.opposite.main,
      color: theme.palette.dark.main,
      
    },
  }));
  
/**
 * Card style for Register page.
 * Allows hover and change color.
 */
export const StyledCardService = styled(Card)(({ theme }) => ({
    // Default styles for the card
    transition: '0.2s',
    boxShadow: theme.shadows[1],
    '&:hover': {
      // Styles to apply when the card is hovered over
      transform: 'translateY(-3px)',
      boxShadow: theme.shadows[5],
      backgroundColor: theme.palette.lightprop.main,
      color: theme.palette.dark.main,
      
    },
  }));