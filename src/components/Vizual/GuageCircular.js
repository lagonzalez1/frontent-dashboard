import * as React from 'react';
import Stack from '@mui/material/Stack';
import { Gauge } from '@mui/x-charts/Gauge';

export default function GuageCircular({value, type}) {
  return (
    <Gauge cornerRadius={50} height={80} value={value}
    />
  );
}