
import axios from "axios";
import { getStateData, getAccessToken } from "../auth/Auth";
import { setBuisness } from "../reducers/buisness";
let GET_BUISNESS = '/api/internal/reload_buisness/'


export const reloadBuisnessData = (dispatch) => {
    const { user, buisness } = getStateData();
    if (!user  || !buisness ) { return new Error('Data not found.')}
    const accessToken = getAccessToken();
    const headers = { headers: {'x-access-token': accessToken} }
    const id = user.id;
    const bid = buisness._id;
    const ENDPOINT = GET_BUISNESS + id + '/' + bid;
    axios.get(ENDPOINT, headers)
    .then(response => {
        dispatch(setBuisness(response.data.buisness));
        return;
    })
    .catch(error => {
        console.log(error);
        return new Error(error);
    })

}


export const getServicesAvailable = () => {
    const { _, buisness} = getStateData();
    if (!buisness) { return new Error('Buisness data ais empty.'); }
    const services = buisness.services;
    if ( !services ) { return []; }
    return services;
  }


export const getResourcesAvailable = () => {
    const { _, buisness} = getStateData();
    if (!buisness) { return new Error('Buisness data is empty.');}
    const resources = buisness.resources;
    if ( !resources ) { return []; }
    return resources;
}