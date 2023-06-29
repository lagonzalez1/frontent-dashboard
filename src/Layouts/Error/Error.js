import React from 'react';
import { Typography, TextField, Container, Box } from '@mui/material';
import ServerError from "../../assets/errors/error-500.png";
import LostError from "../../assets/errors/error-404.png";
import AuthError from "../../assets/errors/error-401.png";

const ErrorPage = ({ title, errorMessage, type }) => {
    const parseErrorType = () => {
        switch(type) {
            case 404:
                return <img src={LostError} id="default_error" height={200} width={200}></img>
            case 403:
                return <img src={AuthError} id="auth_error" height={200} width={200}></img>
            case 500:
                return <img src={ServerError} id="server_error" height={200} width={200}></img>
            default:
                return <img src={LostError} id="default_error" height={200} width={200}></img>
        }
    }

  return (
    <Container>
      <Box textAlign="center" mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        
        {parseErrorType()}
      </Box>
      <Box mt={4}>
        <TextField
          label="Error Message"
          variant="outlined"
          disabled={true}
          multiline
          rows={4}
          fullWidth
          value={errorMessage}
        />
      </Box>
    </Container>
  );
};

export default ErrorPage;