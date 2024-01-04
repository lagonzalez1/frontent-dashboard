import { styled } from '@mui/system';
import { Card } from '@mui/material';



/**
 * Card style for Register page.
 * Allows hover and change color.
 */
export const StyledCard = styled(Card)(({ theme }) => ({
  // Default styles for the card
  transition: '0.3s',
  '&:hover': {
    // Styles to apply when the card is hovered over
    transform: 'translateY(-6px)',
    // Set the color for the text when hovering
    '& h5, & subtitle2, & body2': {
      color: 'inherit', // Use the inherit value to keep the same color as the parent
    },
  },
}));
  
/**
 * Card style for Register page.
 * Allows hover and change color.
 */
export const StyledCardService = styled(Card)(({ theme }) => ({
    // Default styles for the card
    transition: '0.2s',
    '&:hover': {
      // Styles to apply when the card is hovered over
      transform: 'translateY(-3px)',      
    },
  }));