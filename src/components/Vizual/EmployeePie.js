import React, {useEffect, useState} from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import {
    blueberryTwilightPalette,
    mangoFusionPalette,
    cheerfulFiestaPalette,
  } from '@mui/x-charts/colorPalettes';

import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
export default function EmployeePie({data, type, centerLabel}) {

    const [dataSet, setDataSet] = useState([]);

    useEffect(() => {
        loadData()
    }, [])

    const StyledText = styled('text')(({ theme }) => ({
        fill: theme.palette.text.primary,
        textAnchor: 'middle',
        dominantBaseline: 'central',
        fontSize: 20,
      }));
      
      function PieCenterLabel({ children }) {
        const { width, height, left, top } = useDrawingArea();
        return (
          <StyledText x={left + width / 2} y={top + height / 2}>
            {children}
          </StyledText>
        );
      }


    const loadData = () => {
        let set = [];
        if (data) {
            for (var i = 0; i < data.length; i ++) {
                set.push({id: i, value: data[i].value, label: `${data[i].day}`})
            }
            setDataSet(set);
        }
    }

    return (
        <PieChart
            series={[
                {
                innerRadius: 80,
                data: dataSet,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                },
            ]}
            height={270}
            width={1000}
            colors={mangoFusionPalette}
            >
            <PieCenterLabel>{centerLabel}</PieCenterLabel>
            </PieChart>
    );
}