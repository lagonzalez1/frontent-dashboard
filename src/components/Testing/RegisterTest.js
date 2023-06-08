import React from "react";



export const DURATION_DEMO = () => { 
    const DURATION = [{service_name: 'service', duration: 40} ]
    return DURATION;
}

export const HOURS_LIST = () => {
    const SIZE = 24
    let result = [];
    for (let i = 1; i <= SIZE; i++) {
        result.push(`${i}` + ":00");
    }
    return result;
}

export const WEEK_LIST = () => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
}

export const WEEK_OBJ = () => {
    const week_list = WEEK_LIST();
    const check_state = {}
    for (let i = 0; i < week_list.length; i ++){
        check_state[week_list[i]] = false;
    }
    return check_state;
}