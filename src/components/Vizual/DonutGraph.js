import React, { useEffect } from "react";
import * as d3 from "d3";



export default function DonutGraph({employeeData}) {

    useEffect(() => {
        console.log(employeeData);
    }, [employeeData])

    return (
        <svg height={400} width={400}>
            
        </svg>
    )
}