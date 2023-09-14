import React from "react";
import { Slide } from "@mui/material";



export const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export const mapAppointments = (appointments) => {
    const result = {}
    var count = 0;
    for (var app of appointments){
        result[count] = app;
        count++;
    }
    return result;
}