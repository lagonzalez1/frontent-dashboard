import React from 'react';
import { CircularProgress, Grid } from "@mui/material";


export default function FullScreenLoader() {

  return (
    <Grid container sx={{ width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center' }}>

      <CircularProgress />
    </Grid>
  );
};

