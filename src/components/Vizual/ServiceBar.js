import React, {useEffect, useState} from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { searchServices } from '../../hooks/hooks';
import {
    blueberryTwilightPalette,
    mangoFusionPalette,
    cheerfulFiestaPalette,
  } from '@mui/x-charts/colorPalettes';
import { useSelector } from 'react-redux';

export default function ServiceBar({serviceData, loading}) {
    const [dataSet, setDataSet] = useState([]);
    const services = useSelector(state => state.business.services);

    useEffect(() => {
        loadData();
    }, [serviceData]);

    const loadData = () => {
        let set = []
        if (serviceData) {
            for (var i = 0; i < serviceData.length; i ++){
                let serviceTitle = searchServices(serviceData[i].id, services);
                if (serviceTitle.title === "NA"){ continue; } // Skip deleted services
                let object = {
                    title: serviceTitle.title,
                    avg: serviceData[i].avg,
                    total: serviceData[i].count
                }
                set.push(object);
            }
            setDataSet(set);
        }
    }
    const valueFormatter = (value) => `${value}`;
    return (
        <BarChart
                
                yAxis={[{label: 'Clients'}]}
                borderRadius={7}
                dataset={dataSet}
                xAxis={[{ scaleType: 'band', dataKey: 'title' }]}
                series={[
                    {dataKey : 'avg', label: 'Average', valueFormatter},
                    {dataKey : 'total', label: 'Totals', valueFormatter}
                ]}
                colors={blueberryTwilightPalette}

            height={400}
        />
    );
}