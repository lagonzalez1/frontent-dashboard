import React from "react";



export const DURATION_DEMO = () => { 
    const DURATION = [{service_name: 'service', duration: 40} ]
    return DURATION;
}

export const HOURS_LIST = () => {
    const SIZE = 24
    let result = [];
    for (let i = 1; i <= SIZE; i++) {
        if(i < 10){
            result.push(`0${i}` + ":00");
        }else {
            result.push(`${i}` + ":00");
        }
    }
    return result;
}

export const WEEK_LIST = () => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
}

export function WEEK_OBJ() {
    const week_list = WEEK_LIST();
    let check_state = {}
    for (let i = 0; i < week_list.length; i ++){
        check_state[week_list[i]] = {
            start: '',
            end: '',
            status: false
        };
    }
    return check_state;
}