import React, { useCallback, useEffect, useState } from 'react';
import '../../css/Customers.css';
import { Stack, Grid, Menu, MenuItem, IconButton, TextField, Typography,
   Skeleton, Table, TableCell, TableBody, TableHead, TableContainer, TableRow,Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip,
   Box, Collapse, Tooltip, CircularProgress } from '@mui/material';
import DateSelect from '../../components/Select/DateSelect';
import StateSelect from '../../components/Select/StateSelect';
import EmployeeSelect from '../../components/Select/EmployeeSelect';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from 'react-redux';
import { columns, convertTo_CSV, getLastVisit, removeFromAnalytics, searchAnalyticsKeyword} from './CustomerHelper';
import { findEmployee, findService, getAnalyticsClients } from '../../hooks/hooks';
import { setSnackbar } from '../../reducers/user';
import { DateTime } from 'luxon';
import AlertMessageGeneral from '../../components/AlertMessage/AlertMessageGeneral';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BackspaceRoundedIcon from '@mui/icons-material/BackspaceRounded';
import NotesIcon from '@mui/icons-material/Notes';
import CloseIcon from "@mui/icons-material/Close"
import NotesDialog from '../../components/Dialog/NotesDialog';
import { usePermission } from '../../auth/Permissions';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { FileCsv } from "phosphor-react"

const Customers = () => {


  const { checkPermission } = usePermission();
  const business = useSelector((state) => state.business);
  const permissionLevel = useSelector((state) => state.user.permissions);
  const dispatch = useDispatch();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [sort, setSort] = useState();
  const [stateSort, setStateSort] = useState();
  const [employeeSort, setEmployeeSort] = useState();
  const [client, setClient] = useState(null);
  const [clientNotes, setClientNotes] = useState(false);
  const [notes, setNotes] = useState({timestamp: null, notes: null});

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({title: null, body: null});



  const closeClientNotes = useCallback(() => {
    setClientNotes(false);
    setNotes({timestamp: null, notes: null});
  }, [])

  const handleSearch = () => {
    if (searchTerm.length === 0){
      return;
    }
    setLoading(true)
    searchAnalyticsKeyword(searchTerm)
    .then(response => {
      setData(response);
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
    })
    .finally(() => {
      setLoading(false);
    })

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
    const printThis = convertToCSV(data);
    console.log(printThis)
    handleClose();
  };

  const convertDataToCsv = () => {
    if (!data) {
      setAlert(true);
      setAlertMessage({title: 'Error', body: 'There is no data on your table.'}) 
      return;
    }
    convertTo_CSV(data)
    .then(response => {
      const timestamp = DateTime.local().toUTC();
      const csvData = response.data;
      // Create a Blob object from the CSV data
      const blob = new Blob([csvData], { type: 'text/csv' });
      
      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${timestamp}.csv`;
      a.click();
    
    // Revoke the URL to free up memory
    window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
    })
  }

  const handleDeleteAll = () => {
    handleClose();
  };


  const loadCustomers = (sort, stateSort) => {
    if ( !sort || !stateSort) { return; }
    const currentTime = DateTime.local().setZone(business.timezone).toISO();
    const payload = {bid: business._id, sort, stateSort, currentTime}
    setLoading(true)
    getAnalyticsClients(payload)
    .then(response => {
      setData(response.payload);
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
    })
    .finally(() => {
      setLoading(false)
    })
  }

  const showNotes = (payload) => {
    setNotes({timestamp: payload.timestamp, notes: payload.notes});
    setClientNotes(true);
  }

  const confirmDeleteClient = (client) => {
    setClient(client);
    setConfirmDelete(true);
  }

  const cancelDeleteClient = () => {
    setClient(null);
    setConfirmDelete(false);
  }


  const deleteClientAnalytics = () => {
    if (!client) {
      setAlert(true);
      setAlertMessage({title: 'Error', body: 'Unable to find client to view.'})
      return;
    }
    setLoading(true);
    removeFromAnalytics(client._id)
    .then((response) => {
      dispatch(setSnackbar({requestMessage: response, requestStatus: true}));
    })
    .catch(error => {
      dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}));
    })
    .finally(() => {
      setLoading(false);
      cancelDeleteClient();
    })
  }

  useEffect(() => {
    loadCustomers(sort, stateSort);
  }, [ sort, stateSort])



  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          
          <TableCell align="left">
          <Typography variant='subtitle1' fontWeight={'bold'}>
              {row.fullname}
            </Typography>
            <Typography variant='caption'>
              {row.phone}
            </Typography>
          </TableCell>

          <TableCell align="left">{row.email}</TableCell>
          <TableCell align="left">{getLastVisit(row.waitlist_summary, row.appointment_summary)}</TableCell>
          <TableCell align="left">{row.status.flag ? "True": "False"}</TableCell>
          <TableCell align="left">
            <IconButton disabled={(permissionLevel === 2|| permissionLevel === 3) ? true: false} aria-label="delete row" onClick={() => confirmDeleteClient(row)}>
              <BackspaceRoundedIcon fontSize='small' />
            </IconButton>
          </TableCell>


        </TableRow>

        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" fontWeight={'bold'} gutterBottom component="div">
                  History
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs>
                  <Typography variant="subtitle1" fontWeight={'bold'} gutterBottom component="div">
                    Waitlist
                  </Typography>
                  <Table size="small" aria-label="purchases">
                  
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Notes</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell align="left">Employee</TableCell>
                      <TableCell align="left">Wait time</TableCell>
                      <TableCell align="left">Serve time</TableCell>
                      <TableCell align="left">No show</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      row && row.waitlist_summary.map((summary, index) => {
                        const wait_hours = Math.floor(summary.wait_time / 60);
                        const wait_minutes = Math.round(summary.wait_time % 60);

                        const serve_hours = Math.floor(summary.serve_time / 60);
                        const serve_minutes = Math.round(summary.serve_time % 60);

                        // Construct the result string
                        let serve_result = '';
                        if (serve_hours > 0) {
                          serve_result += `${serve_hours} ${serve_hours === 1 ? 'hr' : 'hours'}`;
                        }

                        if (serve_minutes > 0) {
                          serve_result += ` ${serve_minutes} ${serve_minutes === 1 ? 'min' : 'minutes'}`;
                        }

                        // Construct the result string
                        let result = '';
                        if (wait_hours > 0) {
                          result += `${wait_hours} ${wait_hours === 1 ? 'hr' : 'hours'}`;
                        }

                        if (wait_minutes > 0) {
                          result += ` ${wait_minutes} ${wait_minutes === 1 ? 'min' : 'minutes'}`;
                        }
                        return (
                          <TableRow>
                              <TableCell>
                                <Tooltip followCursor title={summary.notes}>
                                  <IconButton onClick={() => showNotes({timestamp: summary.timestamp, notes: summary.notes}) }>
                                    <NotesIcon fontSize="small"/>
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Typography variant='body2'>{DateTime.fromISO(summary.timestamp).toFormat('LLL dd yy')}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant='body2'>{findService(summary.service).title}</Typography>
                                
                              </TableCell>
                        
                              <TableCell>
                                <Typography variant='body2'>{findEmployee(summary.employee).fullname}</Typography>

                              </TableCell>
                              <TableCell>
                                <Typography variant='body2'>{result.trim()}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant='body2'>{serve_result.trim()}</Typography>

                              </TableCell>
                              <TableCell>
                              <Typography variant='body2'>{ summary.no_show ? "True": "False"}</Typography>

                              </TableCell>
                          </TableRow>
                        )
                      })
                    }
                  </TableBody>
                </Table>
                  </Grid>

                  <Grid item xs>
                  <Typography variant="subtitle1" fontWeight={'bold'} gutterBottom component="div">
                    Appointments
                  </Typography>
                  <Table size="small" aria-label="purchases">
                  
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Notes</TableCell>

                      <TableCell>Date</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell align="left">Employee</TableCell>
                      <TableCell align="left">Wait time</TableCell>
                      <TableCell align="left">Serve time</TableCell>
                      <TableCell align="left">No show</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {
                      row && row.appointment_summary.map((summary, index) => {
                        const wait_hours = Math.floor(summary.wait_time / 60);
                        const wait_minutes = Math.round(summary.wait_time % 60);

                        const serve_hours = Math.floor(summary.serve_time / 60);
                        const serve_minutes = Math.round(summary.serve_time % 60);

                        // Construct the result string
                        let serve_result = '';
                        if (serve_hours > 0) {
                          serve_result += `${serve_hours} ${serve_hours === 1 ? 'hr' : 'hours'}`;
                        }

                        if (serve_minutes > 0) {
                          serve_result += ` ${serve_minutes} ${serve_minutes === 1 ? 'min' : 'minutes'}`;
                        }

                        // Construct the result string
                        let result = '';
                        if (wait_hours > 0) {
                          result += `${wait_hours} ${wait_hours === 1 ? 'hr' : 'hours'}`;
                        }

                        if (wait_minutes > 0) {
                          result += ` ${wait_minutes} ${wait_minutes === 1 ? 'min' : 'minutes'}`;
                        }

                        return (
                          <TableRow>
                              <TableCell>
                                <Tooltip title={summary.notes}>
                                <IconButton onClick={() => showNotes({timestamp: summary.timestamp, notes: summary.notes}) }>
                                    <NotesIcon fontSize="small"/>
                                  </IconButton>
                                </Tooltip>
                              </TableCell>

                              <TableCell>
                                <Typography variant='body2'>{DateTime.fromISO(summary.appointmentDate).toFormat('LLL dd yy')}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant='body2'>{findService(summary.service).title}</Typography>
                                
                              </TableCell>
                              
                              <TableCell>
                                <Typography variant='body2'>{findEmployee(summary.employee).fullname}</Typography>

                              </TableCell>
                              <TableCell>
                                <Typography variant='body2'>{result.trim()}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant='body2'>{serve_result.trim()}</Typography>

                              </TableCell>
                              <TableCell>
                                <Typography variant='body2'>{ summary.no_show ? "True": "False"}</Typography>

                              </TableCell>
                          </TableRow>
                        )
                      })
                    }
                  </TableBody>
                </Table>
                  </Grid>
                </Grid>
                
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>

      </React.Fragment>
    );
  }

  return (
    <>
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
                  { // Not yet ready to implement. <EmployeeSelect set={setEmployeeSort} /> 
                  }
                <StateSelect set={setStateSort} />
                <Tooltip title={'Convert your current data to csv file'} placement='top'>
                <IconButton onClick={() => convertDataToCsv()}>
                    <FileCsv size={25}/>
                </IconButton>
                </Tooltip>
            </Stack>
          </Grid>
        </Grid>

        <div className="customersTable">
            <Paper sx={{ width: '100%', overflow: 'hidden'}}>
                <TableContainer>
                    <Table stickyHeader aria-label='main_table'>
                        <TableHead>
                            <TableRow>
                                <TableCell/>
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
                            { (loading === true && data === null) ? 
                            (
                              <TableRow>
                                  <TableCell colSpan={3}/>
                                  
                                  <TableCell>
                                  <CircularProgress size={15} />
                                  </TableCell>
                                  <TableCell colSpan={1}/>
                              </TableRow>
                            ):
                            data && data.map((client, index) => (
                              <Row key={index} row={client} />
                            ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>

      </div>

      <Dialog
        id="confirmDelete"
        open={confirmDelete}
        onClose={cancelDeleteClient}
      >
        <DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={cancelDeleteClient}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton> 
                <Typography variant="h5" fontWeight={'bold'}>Confirm </Typography>
            </DialogTitle>

            <DialogContent>
              <Typography variant='body2'>Please confirm if you wish to remove client.</Typography>
            </DialogContent>
            <DialogActions>
              <Button sx={{borderRadius: 10}} disabled={!checkPermission('CUST_REMOVAL')} variant='contained' color='warning' onClick={() => deleteClientAnalytics()}>Delete</Button>
              <Button sx={{borderRadius: 10}} onClick={cancelDeleteClient} variant='contained' color='primary'>Cancel</Button>
            </DialogActions>

      </Dialog>


      <NotesDialog payload={notes} onClose={closeClientNotes} open={clientNotes} />

      
    </>
  );
};

export default Customers;
