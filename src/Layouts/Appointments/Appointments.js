import React, { useState, useEffect} from "react";
import { Stack, Typography, Button, Grid, TableHead,TableRow, TableCell, Paper, Table, Checkbox,
    TableContainer, TableBody, Tooltip, Skeleton, CircularProgress, Box, IconButton, Badge, Collapse, 
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    ListItemIcon,
    Chip,
    TextField,
    Alert,
    AlertTitle} from "@mui/material";

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';

import { findEmployee, moveClientServing, findService, getAppointmentTable, sendNotification } from "../../hooks/hooks";
import { APPOINTMENT, APPOINTMENT_DATE_SELECT } from "../../static/static";
import { useSelector, useDispatch } from "react-redux";
import { setReload, setSnackbar } from "../../reducers/user";
import { columns, createAppointmentPretense, getAllSlotsAppointments, getHighlightedDays } from "./AppointmentsHelper";
import { DatePicker, PickersDay } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import FabAppointment from "../../components/AddAppointment/FabAppointment";
import { usePermission } from "../../auth/Permissions";
import AlertMessageGeneral from "../../components/AlertMessage/AlertMessageGeneral";
import SortRoundedIcon from '@mui/icons-material/SortRounded';

import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Add, ArrowRightAltOutlined, Bolt, CloseRounded, CloudDone, EventAvailableOutlined, FmdGoodRounded, KeyboardArrowDown, KeyboardArrowDownOutlined, KeyboardArrowLeft, KeyboardArrowLeftRounded, KeyboardArrowRightRounded, Remove } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import LoadingButton from "@mui/lab/LoadingButton";
import { ButtonGroup } from "react-bootstrap";

const Appointments = ({setClient, setEditClient}) => {
    const dispatch = useDispatch();
    const { checkPermission } = usePermission();

    const accessToken = useSelector((state) => state.tokens.access_token);
    const business = useSelector((state) => state.business);
    const employeeList = useSelector((state) => state.business.employees);
    const serviceList = useSelector((state) => state.business.services);


    const [loading, setLoading] = useState(false);
    const [reloadPage, setReloadPage] = useState(false);
    const [error, setError] = useState(false);
    const [alert, setAlert] = useState({title: null, body: null});
    const [quickView, setQuickView] = useState(false);
    const [slots, setSlots] = useState([]);
    const [slotMessage, setSlotMessage] = useState({title: null, body: null });
    const [quickViewLoader, setQuickViewLoader] = useState(false);


    const [highlightedDays, setHighlightedDays] = useState([]);
    const [data, setData] = useState([]);

    const baseLineDate = DateTime.local().setZone(business.timezone);

    const currentDate = DateTime.local().setZone(business.timezone);
    const [selectedDate, setSelectedDate] = useState();
    const [phoneNumber, setPhoneNumber] = useState(null);

    const [selectedAppointment, setSelectedAppointment] = useState({index: null, slot: null});
    const [quickViewDate, setQuickViewDate] = useState(currentDate);
    const [serviceTags, setServiceTags] = useState({});
    const [checked, setChecked] = useState([]);

    const handleToggle = (value, service) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        if (newChecked.length === 0) { setSlots([]); setSlotMessage({title: null, body: null}); }
        formik.setFieldValue('service_id', service._id)
        formik.setFieldValue('size', newChecked.length)
        setServiceTags((prev) => ({...prev, [value]: service._id}));
        setChecked(newChecked);
    };

    const handleAppointmentClick = (index, slot) => {
        setSelectedAppointment(() => ({index: index, slot: slot }))
    }

    useEffect(() => {
        getLastSearchedDate();
        return () => {
            setReloadPage(false);
        }
    }, [reloadPage]);

    function getLastSearchedDate () {
        const date = sessionStorage.getItem(APPOINTMENT_DATE_SELECT);
        if (date) {
            if (accessToken === undefined) { return; }
            setLoading(true);
            let lastDate = DateTime.fromISO(date, {zone: 'utc'});
            setSelectedDate(lastDate)
            getAppointmentTable(lastDate, accessToken)
            .then(response => {
                setHighlightedDays(response.highlightDays)
                setData(response.data);
            })
            .catch(error => {
                setError(true);
                setAlert({title: 'Error', body: error.msg});
            })
            .finally(() => {
                setLoading(false);
            })
        }
        else {
            if (accessToken === undefined) { return;}
            setLoading(true);
            setSelectedDate(currentDate)
            getAppointmentTable(currentDate, accessToken)
            .then(response => {
                setHighlightedDays(response.highlightDays)
                setData(response.data);
                console.log(response)

            })
            .catch(error => {
                setError(true);
                setAlert({title: 'Error', body: error.msg});
            })
            .finally(() => {
                setLoading(false);
            })
        }
    }

    const sendClientServing = (clientId) => {
        moveClientServing(clientId, APPOINTMENT)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            setLoading(false);
            setReloadPage(true);
        })
    }

    function handleDateChange(date) {
        const dateObj = date.toISO();
        sessionStorage.setItem(APPOINTMENT_DATE_SELECT, dateObj); 
        setReloadPage(true);
    };

    function openClientDrawer(item) {
        setClient({payload: item, open: true, fromComponent: APPOINTMENT});
    }
    const editClientInfo = (item) => {
        setEditClient({payload: item, open: true, fromComponent: APPOINTMENT})
    }
    const sendClientNotification = (clientId) => {
        const payload = {clientId: clientId, type: APPOINTMENT}
        sendNotification(payload)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
    }

    const sortByEmployees = () => {
        if (data.length === 0) { return ; }

    }

    const handelMonthChage = (date) => {
        setHighlightedDays([]);
        const dates = getHighlightedDays(date)
        setHighlightedDays(dates);    
    }

    //**
     /* 
     /* @param {Array} props array of dates that will be highlighted.
     /* @param {Array} 
     /* @returns 
     */
    function ServerDay(props) {
        
        const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
        const isSelected =
          !props.outsideCurrentMonth && highlightedDays.indexOf(day.day) >= 0;
          
        return (
          <Badge
            key={props.day.toString()}
            overlap="circular"
            color="success" variant="dot" invisible={!isSelected}
            >
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
          </Badge>
        );
    }

    const handleSubmit = (values) => {
        setQuickViewLoader(true);
        const serviceUsed = isServiceTagsUsed();
        if (!serviceUsed || !values || selectedAppointment.index === null || selectedAppointment.slot === null || !selectedDate) {
            setAlert({title: 'Warning', body: 'Please fill out all fields.'});
            setQuickViewLoader(false);
            setSlotMessage({title: null, body: null});
            return;
        }
        const date = DateTime.fromISO(quickViewDate).toISO();
        const appointment = { start: selectedAppointment.slot.start, end: selectedAppointment.slot.end}
        const timestamp = DateTime.local().setZone(business.timezone).toISO();
        const data = { ...values, appointmentDate: date, appointment: appointment, serviceTags, timestamp};
        createAppointmentPretense(data)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}));
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}));
        })
        .finally(() => {
            setQuickViewLoader(false);
            setQuickView(false);
            
        })


    }

    const formatPhoneNumber = (input) => {
        const digits = input.replace(/\D/g, '');
        if (digits.length <= 3) {
            return digits;
            } else if (digits.length <= 6) {
            return `${digits.slice(0, 3)}-${digits.slice(3)}`;
            } else {
            return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        }
    }
    const phoneNumberChange = (event) => {
        const input = event.target.value;
        // Apply formatting to the input and update the state
        const phoneNumber = formatPhoneNumber(input);
        if (phoneNumber.length === 12) {
            console.log("Completed", phoneNumber);
            formik.setFieldValue('phone', phoneNumber);
        }
        setPhoneNumber(phoneNumber);
    }

    const initialValues = {
        fullname: '',
        email: '',
        phone: '',
        size: checked.length,
        service_id: '',
        resource_id: '',
        employee_id: '',
        notes: '',
      };
      
      const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;    
      const validationSchema = Yup.object({
        fullname: Yup.string().required('Full name is required'),
        phone: Yup.string().required('Phone').matches(phoneRegex, 'Phone number must be in the format XXX-XXX-XXXX')
        .required('Phone number is required'),
        email: Yup.string().required(),
        size: Yup.number().default(1),
        service_id: Yup.string(),
        employee_id: Yup.string(),
        resource_id: Yup.string(),
        notes: Yup.string(),
      });

      const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit
      })

    const closeAlert = () => {
        setError(false);
        setAlert({title: null, body: null});
    }

    const openQuickView = () => {
        let prev = quickView;
        if (!prev) {
            setSlotMessage({title: null, body: null});
            setSlots([]);
        }
        setQuickView(!prev);
        
    }

    const handleEmployeeClick = (e) => {
        formik.setFieldValue('employee_id', e)
    }


    const addDate = () => {
        setSlots([]);
        const nextDate = quickViewDate.plus({days: 1}).startOf('day');
        setQuickViewDate(nextDate);
    }

    const subtractDate = () => {
        setSlots([]);
        const nextDate = quickViewDate.minus({days: 1}).startOf('day');
        setQuickViewDate(nextDate);
    }

    const handleQuickViewDateChange = (date) => {
        setSlots([]);
        let dateChange = date.startOf('day');
        setQuickViewDate(dateChange);
    }

    const isServiceTagsUsed = () => {
        let object = {}
        for (let i = 0, n = checked.length; i < n; ++i) {
            let indexOfService = checked[i];
            object[i] = serviceTags[indexOfService];
        }
        return object
    }

    useEffect(() => {
        loadAllAvailableSlots()
        // IF  employee_id, service_id are ok reload the available slots
        // AXIOS
    } ,[serviceTags, quickViewDate])

    const loadAllAvailableSlots = () => {
        let tags = isServiceTagsUsed();
        if (formik.values.employee_id && formik.values.service_id && Object.keys(tags).length > 0) {
            getAllSlotsAppointments(formik.values.employee_id, quickViewDate.toISO(), formik.values.service_id, tags)
            .then(response => {
                if (response.status === 201) {
                    console.log(response.data.msg)
                    setSlotMessage({title: 'Alert', body: response.data.msg})
                    return;
                }
                setSlots(response.data.data);
            })
            .catch(error => {
                console.log(error);
                dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
            })
            .finally(() => {
                // Loaders
            })
        }
        console.log("idle");
        
    }
    

    

    return (
        <>
        <div className="appointments">
        <Collapse in={error}>
            <Box sx={{pt:1}}>
                <AlertMessageGeneral open={error} onClose={closeAlert} title={alert.title} body={alert.body} />
            </Box>
        </Collapse>
            <Grid container>
                <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                        <Stack>
                            <Typography variant="body2">{business ? business.businessName: <Skeleton/> }</Typography>
                            <Typography variant="h5"><strong>Appointments</strong></Typography>
                        </Stack>
                        
                </Grid>
                <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                    <Box>

                    </Box>
                </Grid>

                <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left', pt: 2}}>
                    <Grid 
                        container
                        direction="row"
                        spacing={1}
                        justifyContent="flex-start"
                        alignItems="flex-start">
                        <Grid item>
                        <Tooltip title="Your current location." placement="bottom">
                            <Chip color="warning" icon={<SouthAmericaIcon />} label={business ? (business.timezone): null } />
                        </Tooltip>
                        </Grid>
                        <Grid item>
                        <Tooltip title="Sort your appointment list by employee" placement="bottom">
                            <Chip onClick={() => sortByEmployees()} color="warning" icon={<SortRoundedIcon />} label={'Group by employee'} />
                        </Tooltip>
                        </Grid>

                        <Grid item>
                        <Tooltip title="Check availability" placement="bottom">
                            <Chip onClick={() => openQuickView()} color="warning" icon={<Bolt />} label={'Availability'} />
                        </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                {/** Is this where the error is?, once a new component  */}
                <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'right ', pt: 1}}>
                    <Grid 
                        container
                        direction="row"
                        spacing={1}
                        justifyContent="flex-start"
                        alignItems="flex-start">
                    {quickView ? (
                        <Grid item xs={12}>
                            <Box sx={{display: 'flex', justifyContent: 'right'}}>
                                <Stack direction={'row'} spacing={1}>
                                    <IconButton color="primary" onClick={() => subtractDate()}>
                                        <KeyboardArrowLeftRounded />
                                    </IconButton>
                                    <DatePicker
                                        label="Date"
                                        value={quickViewDate}
                                        minDate={baseLineDate}
                                        onChange={handleQuickViewDateChange}
                                    />
                                    <IconButton color="primary" onClick={() => addDate()}>
                                        <KeyboardArrowRightRounded />
                                    </IconButton>
                                </Stack>
                            </Box>
                        </Grid>
                    ):
                    <Grid item xs={12}>
                    <Box sx={{display: 'flex', justifyContent: 'right'}}>
                        <DatePicker
                            label={"Date"}    
                            fontSize="sm"
                            value={selectedDate}
                            onMonthChange={handelMonthChage}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} />}
                            minDate={currentDate}
                            
                            slots={{
                                day: ServerDay,
                              }}
                              slotProps={{
                                day: {
                                  highlightedDays,
                                },
                            }}
                        />
                    </Box>
                    </Grid>
                    }
                    </Grid>
                </Grid>
            </Grid>
                            
                {
                    quickView ? (
                        <form onSubmit={formik.handleSubmit}>
                        <Grid container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="baseline" 
                            spacing={1} sx={{pt: 2}} columnSpacing={2}>
                            <Grid item xl={3} lg={3} md={6} sm={12} xs={12}>
                            <Box>
                                <Chip color={'success'} size="small" label={'Employees'} icon={<ArrowRightAltOutlined />}/>
                            
                                { 
                                    <List dense>
                                        {
                                            employeeList && employeeList.map((employee, index) => {
                                                return (
                                                    <ListItem key={index}>
                                                        <ListItemButton
                                                            id="employeeList"
                                                            name="employee_id"
                                                            selected={formik.values.employee_id === employee._id}
                                                            value={employee._id}
                                                            onClick={() => handleEmployeeClick(employee._id)}
                                                        >
                                                            <ListItemText>
                                                                {employee.fullname}
                                                            </ListItemText>
                                                        </ListItemButton>
                                                    </ListItem>
                                                )
                                            })
                                        }
                                    </List>
                                }
                            </Box>
                            </Grid>
                            <Grid item xl={3} lg={3} md={6} sm={12} xs={12}>
                                <Box>
                                    <Chip color={formik.values.employee_id ? 'success': 'default'} size="small" label={'Service + Date'} icon={<ArrowRightAltOutlined />}/>
                                
                                {
                                    // Services available List
                                    <List dense>
                                        { Array.isArray(serviceList) ?
                                            serviceList
                                            .filter((service) => service.employeeTags.includes(formik.values.employee_id))
                                            .map((service, index) => (
                                                <ListItem key={service._id}
                                                secondaryAction={
                                                    <Checkbox
                                                        edge="end"
                                                        onChange={handleToggle(index, service)}
                                                        checked={checked.indexOf(index) !== -1}
                                                />
                                                }
                                                >   
                                                    
                                                    <ListItemText 
                                                        primary={<Typography variant="body2" fontWeight={'bold'}>{service.title}</Typography>}
                                                        secondary={<Typography variant="caption">{'Duration: ' + service.duration + ", Cost: " + service.cost }</Typography>}
                                                    />
                                                    
                                                </ListItem>
                                            )):null }
                                    </List>
                                }  
                                </Box>
                            </Grid>
                            <Grid item xl={3} lg={3} md={6} sm={12} xs={12}>
                                <Box>
                                    <Chip size="small" label={'Appointments available'} icon={<KeyboardArrowDownOutlined />} color={Object.entries(slots).length > 0 ? "success": 'default'}/>
                                {
                                    <List dense>
                                        {slots ? Object.keys(slots).map((key, index) => {
                                            const item = slots[key];
                                            const start = DateTime.fromFormat(item.start, "HH:mm").toFormat("h:mm a")
                                            const end = DateTime.fromFormat(item.end, "HH:mm").toFormat("h:mm a")
                                            if (Object.hasOwn(item, 'id')){
                                                return (
                                                    <ListItem key={index}>
                                                        <ListItemButton
                                                         disabled={true}
                                                         value={index}
                                                         >
                                                            <ListItemText 
                                                                primary={<Typography fontWeight={'bold'} variant="subtitle1">{`Taken: ${item.fullname}`}</Typography>}
                                                                secondary={<Typography variant="body2">{`Start ${start} - End ${end}`}</Typography>}
                                                            />
                                                                
                                                        </ListItemButton>       
                                                        <ListItemIcon>
                                                            <CloseRounded color="error" />
                                                        </ListItemIcon> 
                                                    </ListItem>
                                                )
                                            }
                                            return (
                                                <ListItem key={index}>
                                                    
                                                    <ListItemButton 
                                                    onClick={() => handleAppointmentClick(index, item)}
                                                    selected={index === selectedAppointment.index}
                                                    value={index}
                                                    >
                                                        <ListItemText 
                                                                primary={<Typography fontWeight={'bold'} variant="subtitle1">{`Open`}</Typography>}
                                                                secondary={<Typography variant="body2">{`Start ${start} - End ${end}`}</Typography>}
                                                            />    
                                                    </ListItemButton>    
                                                    <ListItemIcon>
                                                        <EventAvailableOutlined color="success" />
                                                    </ListItemIcon>    
                                                </ListItem>
                                            )
                                        }): null}

                                    {
                                        slotMessage.title && 
                                        <ListItem key={'empty'}>
                                            <ListItemButton
                                                disabled={true}
                                                >
                                                <ListItemText 
                                                    primary={<Typography fontWeight={'bold'} variant="subtitle1">{slotMessage.title}</Typography>}
                                                    secondary={<Typography variant="body2">{slotMessage.body}</Typography>}
                                                />
                                                    
                                            </ListItemButton>       
                                            <ListItemIcon>
                                                <CloseRounded color="error" />
                                            </ListItemIcon> 
                                        </ListItem>
                                    }

                                    </List>
                                }
                                </Box>

                            </Grid>
                            <Grid item xl={3} lg={3} md={6} sm={12} xs={12}>
                                <Box>
                                    <Chip size="small" label={'Quick add'} icon={<KeyboardArrowDownOutlined />} color={selectedAppointment.slot ? "success": 'default'}/>
                                    {
                                        selectedAppointment.slot ? 
                                        <Stack spacing={2} sx={{pt: 1}}>
                                        <TextField
                                            id="fullname"
                                            name="fullname"
                                            label="Customer name"
                                            placeholder="Customer name"
                                            error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                                            onChange={formik.handleChange}
                                            value={formik.values.fullname}
                                        />
                                        <TextField
                                            id="email"
                                            name="email"
                                            label="Customer email"
                                            placeholder="Email"
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            onChange={formik.handleChange}
                                            value={formik.values.email}
                                            />
                                        <TextField
                                            id="phone"
                                            name="phone"
                                            label="Phone"
                                            placeholder="xxx-xxx-xxxx"
                                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                                            onChange={(event) => phoneNumberChange(event)}
                                            value={phoneNumber}
                                            />
                                        <TextField
                                            id="size"
                                            name="size"
                                            label="Party size"
                                            placeholder="1"
                                            type="number"
                                            disabled={true}
                                            error={formik.touched.party && Boolean(formik.errors.size)}
                                            onChange={formik.handleChange}
                                            value={formik.values.size}
                                            />
                                        <TextField
                                            id="notes"
                                            name="notes"
                                            label="Notes"
                                            placeholder="Additional notes"
                                            onChange={formik.handleChange}
                                            value={formik.values.notes}
                                        />
                                            <LoadingButton sx={{borderRadius: 5}} variant="contained" color="primary" type="submit" loading={quickViewLoader}>Submit</LoadingButton>
                                        </Stack>


                                    : null
                                    }
                                </Box>
                            </Grid>
                        </Grid>
                        </form>
                    ):
                    <div className="servingTable">
                    <Paper sx={{ width: '100%', overflow: 'hidden'}}>
                        <TableContainer>
                            <Table stickyHeader aria-label='main_table'>
                                <TableHead>
                                    <TableRow>
                                        {
                                           columns.map((col) => (
                                            <TableCell key={col.id} align='left'>
                                                <Typography variant="subtitle2">{ col.label }</Typography>
                                            </TableCell>
                                           )) 
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <CircularProgress size={15} />
                                        </TableCell>
                                    </TableRow>
                                ) : data && data.length > 0 ? (
                                    data.map((client, index) => {
                                        const edit = checkPermission('CLIENT_EDIT');
                                        return (
                                            <TableRow key={client._id}>
                                                <TableCell>
                                                    <Typography fontWeight={'bold'} variant="body2">
                                                        <IconButton onClick={() => openClientDrawer(client)}>
                                                            <InfoOutlinedIcon />
                                                        </IconButton>
                                                        {++index}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction={'row'}>
                                                    {client.status.cancelled ? <IconButton disabled> <WarningRoundedIcon color="error" /> </IconButton> : 
                                                    <IconButton disabled><FmdGoodRounded color="success" /></IconButton> }
                                                    
                                                    <Stack>
                                                    <Typography fontWeight={'bold'} variant="body2">
                                                        {client.fullname}
                                                    </Typography>
                                                    <Typography fontWeight="normal" variant="caption">
                                                        {client.serviceTag ? findService(client.serviceTag).title : null}
                                                    </Typography>
                                                    </Stack>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography fontWeight={'bold'} variant="body2">
                                                        {DateTime.fromJSDate( new Date(client.appointmentDate)).setZone(business.timezone).toFormat('LLL dd yyyy')}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography fontWeight={'bold'} variant="body2">
                                                        {DateTime.fromFormat(client.start, "HH:mm").toFormat('hh:mm a') + " - " + DateTime.fromFormat(client.end, "HH:mm").toFormat('hh:mm a')}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography fontWeight={'bold'} variant="body2">
                                                        {findEmployee(client.employeeTag).fullname}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction={'row'} spacing={1}>
                                                        <Tooltip title={'Serve client'} placement="left">
                                                        <IconButton onClick={() => sendClientServing(client._id)}>
                                                            <CheckCircleIcon color={'success'}/>
                                                        </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={'Send notification'} placement="top">
                                                        <IconButton onClick={() => sendClientNotification(client._id)}>
                                                            <NotificationsIcon color={'error'}/>                                           
                                                        </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={'Edit client'} placement="right">
                                                        <IconButton disabled={!edit} onClick={() => editClientInfo(client)}>
                                                            <EditIcon  />
                                                        </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No data available
                                        </TableCell>
                                    </TableRow>
)}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    </div>
                        
                
                }
                

                {
                    /**
                     * Handle Appointment request 
                     * 
                     * 
                     */
                }
                <FabAppointment />
                
        </div>
        
        </>
    )
};

export default Appointments

