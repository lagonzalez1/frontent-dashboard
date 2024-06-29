import { styled } from "@mui/material"
import axios from "axios";
import Cookies from "js-cookie";


export const DashboardHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));


export const authenticateUser = async (id, email) => { 
    return new Promise ((resolve, reject) => {
        axios.post('/api/internal/auth_user', {id, email} , {timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
        .then(response => {
            resolve(response);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
                reject('Request timed out. Please try again later.'); // Handle timeout error
            }
            if (error.response) {
                console.log(error.response);
                reject({msg: 'Response error', error: error.response});
            }
            else if (error.request){
                console.log(error.request);
                reject({msg: 'No response from server', error: error.request})
            }
            else {
                reject({msg: 'Request setup error', error: error.message})
            }
        })
    });
}



