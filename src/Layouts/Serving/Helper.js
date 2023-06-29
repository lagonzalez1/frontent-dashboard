import { getStateData } from "../../auth/Auth";


export const getServingCount = () => {
    const { _ , buisness } = getStateData();
    const currentList = buisness.currentClients;
    if (!currentList) { return 0;}
    let groupCount = 0;
    let groupTotalCount = 0;
    for (var object of currentList) {
        if (object.status.serving === true){
            groupCount += 1;
        }   groupTotalCount += object.partySize;
    }
    return { groupCount, groupTotalCount };
}

export const currentTimePosition = () => {
    const { _ , buisness} = getStateData();
    const timezone = buisness.timezone;
    if (!timezone) { return 'No timezone present.';}

}



export const getUserTable = () => {
    const { _ , buisness } = getStateData();
    const currentList = buisness.currentClients;
    if (!currentList) { return [];}
    let table = [];
    for (var object of currentList) {
        if (object.status.serving === true){
            table.push(object);
        }
    }
    return table;
}

export const columns = [
    { id: 'position', label: '#', minWidth: 10 },
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'size', label: 'Party size', minWidth: 50 },
    { id: 'resource', label: 'Resource', minWidth: 50 },
    { id: 'wait', label: 'Time waited', minWidth: 50 },
    { id: 'actions', label: '', minWidth: 170 },
];

