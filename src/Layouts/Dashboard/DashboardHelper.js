import { styled } from "@mui/material"
import axios from "axios";
import { getStateData } from "../../auth/Auth";


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



  const BUISNESS_INDEX = 'user';
  
  export const setBuisnessIndex = (index) => {
    const { user, _} = getStateData();
    user.defaultIndex = index;
    localStorage.setItem(BUISNESS_INDEX, index)
  }

  export const getBuisnessIndex = () => {
    return localStorage.getItem(BUISNESS_INDEX);
  } 