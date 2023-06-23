import { styled } from "@mui/material"
import axios from "axios";
import { getAccessToken } from "../../auth/Auth";


export const DashboardHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));


  export const getBuisnessData = (id) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/internal/buisness', { id })
        .then(response => {
          resolve(response.data.id);
        })
        .catch(error => {
          reject(new Error('Failed to check access token'));
        });
    });
  }