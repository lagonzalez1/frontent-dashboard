import * as React from 'react';
import Stack from '@mui/material/Stack';
import { Gauge } from '@mui/x-charts/Gauge';

export default function GuageService({value, text}) {
  return (
    <Gauge innerRadius="65%" cornerRadius={50} height={90} width={100} value={value} startAngle={-90} endAngle={90}
    />
  );
}