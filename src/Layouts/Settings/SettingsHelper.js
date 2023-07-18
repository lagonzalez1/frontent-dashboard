import { UseSelector, useDispatch } from "react-redux/es/hooks/useSelector";
import { getStateData } from "../../auth/Auth";

export const getResourceList = () => {
    const { user, business } = getStateData()
    const resources = business.resources;
    return resources;
}

export const getServiceList = () => {
    const { user, business } = getStateData()
    const services = business.services;
    return services;
}
