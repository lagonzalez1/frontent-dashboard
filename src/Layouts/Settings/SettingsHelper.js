import { UseSelector, useDispatch } from "react-redux/es/hooks/useSelector";
import { getStateData } from "../../auth/Auth";

export const getResourceList = () => {
    const { user, buisness } = getStateData()
    const resources = buisness.resources;
    return resources;
}

export const getServiceList = () => {
    const { user, buisness } = getStateData()
    const services = buisness.services;
    return services;
}
