import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Stack } from '@mui/material';


const Customers = () => {

  return (
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <section style={{ marginBottom: '20px' }}>
      <Stack direction="row" spacing={1}>
        <Button variant="contained">
            Today
          </Button>
          <Button variant="contained">
            Status
          </Button>
          <Button variant="contained">
            Export
          </Button>

      </Stack>
    </section>

    <section style={{ marginBottom: '20px', width: '100%' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Visit</TableCell>
            <TableCell>Last Updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Add your table rows here */}
        </TableBody>
      </Table>
    </section>
  </div>
  );
};

export default Customers;
