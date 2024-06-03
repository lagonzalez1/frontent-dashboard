import * as React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const settings = {
  width: 110,
  height: 110,
};

export default function GuagePercentages({value}) {



  return (
    <Gauge
      {...settings}
      value={value}
      cornerRadius="50%"
      sx={(theme) => ({
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: 20,
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill: theme.palette.primary,
        },
        [`& .${gaugeClasses.referenceArc}`]: {
          fill: theme.palette.text.disabled,
        },
      })}
        innerRadius="65%"
        outerRadius="100%"
        text={
            ({ value }) => `${value}%`
        }
    />
  );
}
