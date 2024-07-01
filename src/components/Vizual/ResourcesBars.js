import React, {useEffect, useState} from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { findResource } from '../../hooks/hooks';

import {
    blueberryTwilightPalette,
    mangoFusionPalette,
    cheerfulFiestaPalette,
  } from '@mui/x-charts/colorPalettes';

export default function ResourcesBars({resourceData}) {
    const [dataSet, setDataSet] = useState([]);

    useEffect(() => {
        loadData();
    }, [resourceData]);

    const loadData = () => {
        let set = []
        if (resourceData) {
            for (var i = 0; i < resourceData.length; i ++){
                let resourceTitle = findResource(resourceData[i].id);
                if (resourceTitle.title === "NA"){ continue; } // Skip deleted services
                let object = {
                    title: resourceTitle.title,
                    avg: Math.floor(resourceData[i].avg * 100),
                    total: resourceData[i].count
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
                    {dataKey : 'avg', label: 'Average %', valueFormatter},
                    {dataKey : 'total', label: 'Totals #', valueFormatter}
                ]}
                colors={mangoFusionPalette}
            height={400}
        />
    );
}