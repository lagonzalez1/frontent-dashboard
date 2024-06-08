import React from 'react';
import { Typography, TextField, Container, Box } from '@mui/material';
import ServerError from "../../assets/errors/error-500.png";
import LostError from "../../assets/errors/error-404.png";
import AuthError from "../../assets/images/email-confirm.jpg";



const ErrorPage = ({ title, errorMessage, type }) => {
    const parseErrorType = () => {
        switch(type) {
            case 404:
                return <img src={LostError} id="default_error" height={170} width={170}></img>
            case 403:
                return <img src={AuthError} id="auth_error" height={170} width={170}></img>
            case 500:
                return <img src={ServerError} id="server_error" height={170} width={170}></img>
            default:
                return <img src={LostError} id="default_error" height={170} width={170}></img>
        }
    }

  return (
    <Container>
      <Box textAlign="center" mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        
        { parseErrorType() }
      </Box>
      <Box mt={4}>
        <Typography fontWeight={'bold'} textAlign={'center'} variant='h6'>
            {errorMessage}
        </Typography>
      </Box>
    </Container>
  );
};

export default ErrorPage;