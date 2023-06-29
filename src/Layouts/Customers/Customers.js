import React from 'react';
import '../../css/Customers.css';
import { Stack, Grid, Menu, MenuItem, IconButton, TextField, Typography,
   Skeleton, Table, TableCell, TableBody, TableHead, TableContainer, TableRow,Paper } from '@mui/material';
import DateSelect from '../../components/Select/DateSelect';
import StateSelect from '../../components/Select/StateSelect';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from 'react-redux';
import { columns } from './CustomerHelper';



const Customers = () => {

  const buisness = useSelector((state) => state.buisness);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = () => {
    console.log(searchTerm);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePrint = () => {
    console.log('Print action');
    handleClose();
  };

  const handleDeleteAll = () => {
    console.log('Delete All action');
    handleClose();
  };

  

  return (
    <div className='customerContainer'>
      <Grid container>

        <Grid item xs={12} md={6} sm={12} lg={6}>
        <Stack>
            <Typography variant="body2">{buisness ? buisness.buisnessName: <Skeleton/> }</Typography>
            <Typography variant="h5"><strong>Customers</strong></Typography>
        </Stack>
        </Grid>
        <Grid item xs={12} md={6} sm={12} lg={6}>
          
        </Grid>
      </Grid>
      <Grid sx={{pt: 1}} container>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Stack direction="row" spacing={1}>
            <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onKeyPress={handleKeyPress}
          />
          <IconButton onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </Stack>
        </Grid>

        <Grid sx={{ display: 'flex', justifyContent: 'right'}} item xs={12} sm={12} md={6} lg={6}>
          <Stack direction="row" spacing={1}>
              <DateSelect />
              <StateSelect />

              <IconButton
                aria-controls="dropdown-menu"
                aria-haspopup="true"
                onClick={handleClick}
                color="inherit"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handlePrint}>Print</MenuItem>
                <MenuItem onClick={handleDeleteAll}>Delete All</MenuItem>
              </Menu>

          </Stack>
        </Grid>
      </Grid>

      <div className="customersTable">
          <Paper sx={{ width: '100%', overflow: 'hidden'}}>
              <TableContainer>
                  <Table stickyHeader aria-label='main_table'>
                      <TableHead>
                          <TableRow>
                              {
                                  columns.map((col) => (
                                  <TableCell key={col.id} align='left'>
                                      <Typography variant="subtitle2" fontWeight="bold">{ col.title }</Typography>
                                  </TableCell>
                                  )) 
                              }
                          </TableRow>
                      </TableHead>
                      <TableBody>

      
                          
                      </TableBody>
                  </Table>
              </TableContainer>
          </Paper>
      </div>


    </div>
  );
};

export default Customers;
