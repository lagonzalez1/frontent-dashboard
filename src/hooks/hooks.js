
import axios from "axios";
import { getStateData, getAccessToken } from "../auth/Auth";
import { setBuisness } from "../reducers/buisness";
let GET_BUISNESS = '/api/internal/reload_buisness/'


export const reloadBuisnessData = (dispatch) => {
    const { user, buisness } = getStateData();
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