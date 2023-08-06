import React, { useEffect, useState } from 'react';
import '../../css/Customers.css';
import { Stack, Grid, Menu, MenuItem, IconButton, TextField, Typography,
   Skeleton, Table, TableCell, TableBody, TableHead, TableContainer, TableRow,Paper } from '@mui/material';
import DateSelect from '../../components/Select/DateSelect';
import StateSelect from '../../components/Select/StateSelect';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from 'react-redux';
import { columns, sortClientData } from './CustomerHelper';
import { getAnalyticsClients } from '../../hooks/hooks';
import { setSnackbar } from '../../reducers/user';
import { DateTime } from 'luxon';



const Customers = () => {

  const business = useSelector((state) => state.business);
  const refresh = useSelector((state) => state.refresh);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [data, setData] = useState(null);
  const [sort, setSort] = useState();
  const [stateSort, setStateSort] = useState();

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


  const loadCustomers = (sort, stateSort) => {
    if ( !sort || !stateSort) { return; }
    const currentTime = DateTime.local().setZone(business.timezone).toISO();
    const payload = {bid: business._id, sort, stateSort, currentTime}
    getAnalyticsClients(payload)
    .then(response => {
      setData(response);
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: "Error", requestStatus: true}))
    })
    
  }

  console.log(sort);
  console.log(stateSort);



  useEffect(() => {
    loadCustomers(sort, stateSort);
  }, [refresh, sort, stateSort])

  

  return (
    <div className='customerContainer'>
      <Grid container>

        <Grid item xs={12} md={6} sm={12} lg={6}>
        <Stack>
            <Typography variant="body2">{business ? business.businessName: <Skeleton/> }</Typography>
            <Typography variant="h5"><strong>Customers</strong></Typography>
        </Stack>
        </Grid>
        <Grid item xs={12} md={6} sm={12} lg={6}>
          
        </Grid>
      </Grid>
      <Grid sx={{pt: 1}} container  spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
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
              <DateSelect set={setSort} />
              <StateSelect set={setStateSort} />

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
                          { 
                            data ? data.map((client) => {
                              return(
                                <>
                                  <TableRow>
                                    <TableCell>
                                      <Typography>
                                        {client.fullname}
                                      </Typography>
                                  
                                    </TableCell>
                                    <TableCell>
                                      <Typography>
                                        {client.phone}
                                      </Typography>
                                  
                                    </TableCell>
                                    <TableCell>
                                      <Typography>
                                        {client.summary.length}
                                      </Typography>
                                  
                                    </TableCell>

                                    <TableCell>
                                      <Typography>
                                        {client.lastUpdate}
                                      </Typography>
                                  
                                    </TableCell>
                                  </TableRow>
                                </>
                              )
                            }): 
                            null
                          }
                      </TableBody>
                  </Table>
              </TableContainer>
          </Paper>
      </div>


    </div>
  );
};

export default Customers;
