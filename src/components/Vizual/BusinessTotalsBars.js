import React, {useEffect, useState} from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import {
    blueberryTwilightPalette,
    mangoFusionPalette,
    cheerfulFiestaPalette,
  } from '@mui/x-charts/colorPalettes';

export default function BusinessTotalsBars({data}) {
    const [dataSet, setDataSet] = useState([]);

    useEffect(() => {
        console.log(data)
        loadData()
    }, [data]);

    const loadData = () => {
        let dataSet = []
        if (data) {
            for (var day of data.appointments) {
                let object = { 
                    day: day.day,
                    appointmentValue: day.value
                }
                dataSet.push(object);
            }
            let waitlist = data.waitlist;
            for (var i = 0 ; i < dataSet.length; i ++) {
                dataSet[i] = { ...dataSet[i], waitlistValue: waitlist[i].value }
            }
            setDataSet(dataSet)
        }
    }
    const valueFormatter = (value) => `${value}`;
    return (
        <BarChart
                yAxis={[{label: 'Totals (clients)'}]}
                borderRadius={7}
                dataset={dataSet}
                xAxis={[{ scaleType: 'band', dataKey: 'day' }]}
                series={[
                    {dataKey : 'appointmentValue', label: 'Appointment clients', valueFormatter},
                    {dataKey : 'waitlistValue', label: 'Waitlist clients', valueFormatter}
                ]}
            height={400}
            width={1000}
            colors={cheerfulFiestaPalette}
        />
    );
}