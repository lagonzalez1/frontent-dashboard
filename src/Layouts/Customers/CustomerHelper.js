import { DateTime } from "luxon";
import { getStateData } from "../../auth/Auth";


export const sortClientData = (data, sort, stateSort) => {
    const { user, business} = getStateData();
    const currentTime = DateTime.local().setZone(business.timezone);

    if (!data) { return []}
    console.log(sort);
    const dateSort = data.map((summary) => {
        switch(sort){
            case 'Today':
                const clientTime = DateTime.fromISO(summary.timestamp);
                if (clientTime.hasSame(currentTime, 'day')){
                    return summary;
                }
            break;
        }
    })
    console.log(dateSort);
    return dateSort;
}

export const columns = [
    {id: 'name', title: 'Name'},
    {id: 'phone', title: 'Phone'},
    {id: 'visit', title: 'Visit'},
    {id: 'update', title: 'Last Updated'},
    {id: 'actions', title: ''},
]