import React, {useState, useEffect } from "react";
import { Box, Swtich , Paper, Slide, Alert, Card, CardContent, Typography, Stack, Container, Button, Divider, CardActions,
    AlertTitle, Dialog, DialogContent, DialogTitle, RadioGroup, FormControlLabel, Radio, DialogActions, ButtonBase, Snackbar, CircularProgress, Link, 
Collapse, IconButton, DialogContentText} from "@mui/material";
import { getIdentifierData, leaveWaitlistRequest, requestBusinessArguments, requestClientStatus,
    getAvailableAppointments, requestClientEditApp, getEmployeeList } from "./WaitingHelper.js";
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PunchClockTwoToneIcon from "@mui/icons-material/PunchClockTwoTone"
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import CloseIcon from "@mui/icons-material/Close";
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { useNavigate, useParams } from "react-router-dom";
import { APPOINTMENT, WAITLIST } from "../../static/static.js";
import EventAvailableTwoToneIcon from '@mui/icons-material/EventAvailableTwoTone';
import "../../css/Waiting.css";
import { DateTime } from "luxon";
import { Formik } from "formik";

export default function Waiting() {

    const { link, unid } = useParams();
    const navigate = useNavigate();
    
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState(null);
    
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);
    const [titles, setTitles] = useState({});
    const [status, setStatus] = useState(false);
    const [type, setType] = useState(null);


    const [appointments, setAppointments] = useState(null);
    const [editClient, setEditClient] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [serviceList, setServiceList] = useState(null);
    const [employeeList, setEmployeeList] = useState(null);


    const [openStatus, setOpenStatus ] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [args, setArgs] = useState(null);

    const [clientStatus, setClientStatus] = useState({
        here: false,
        parking: false,
        late: false
    })


    function isOnlyOneTrue(obj) {
        const trueValues = Object.values(obj).filter(value => value === true);
        return trueValues.length === 1;
      }

    const closeSnack = () => {
        setOpenSnack(false);
    }


    const handleClose = () => {
        setOpen(false);
    }

    const handleStatusClose = () => {
        setOpenStatus(false);
        setClientStatus({here: false, parking: false, late: false});
    }

    useEffect(() => {
        loadUserAndBusinessArgs();
    }, []);
    
    const loadUserAndBusinessArgs = () => {
        setLoading(true);
        const timestamp = DateTime.local().toUTC();
        Promise.all([
            getIdentifierData(link, unid, timestamp),
            requestBusinessArguments(link)
        ])
        .then(([userResponse, argsResponse]) => {
            if (userResponse.status === 201) {
                setErrors(userResponse.data.msg);
                setUser({});
            } else if (userResponse.status === 200) {
                setTitles(userResponse.data.positionTitles);
                setUser(userResponse.data.client); 
                setStatus(userResponse.data.statusTrigger); 
                setType(userResponse.data.type);
            }
            setArgs(argsResponse);
            setServiceList(argsResponse.data.services);
        })
        .catch(error => {
            setErrors('Error: ' + error);
        })
        .finally(() => {
            setLoading(false);
        });
    };
    


    const copyToClipboardHandler = () => {
        copyToClipboard()
        .then(() => {
            setOpenSnack(true);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            setLoading(false);
        })
    }

    const navigateToWaitlist = () => {
        if (args.present.waitlist === true) {
            navigate(`/welcome/${link}/waitlist`);
        }
        else {
            setAlert(true);
            setMessage('Waitlist is currently disabled for this business.');
        }
    }

    async function copyToClipboard () {
        let currentLink = window.location.href;
        if ('clipboard' in navigator){
            return await navigator.clipboard.writeText(currentLink);
        }else {
            return document.execCommand('copy', true, currentLink)
        }        
    }

    
    const leaveWaitlist = () => {
        leaveWaitlistRequest(link, unid, type)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            handleClose();
        })
    }


    const statusRequest = () =>{
        if (!isOnlyOneTrue(clientStatus)){
            handleStatusClose();
            setAlert(true);
            setMessage('Please only select one status button.');
            return;
        }
        const payload = { unid, link, ...clientStatus}
        requestClientStatus(payload)
        .then(response => {
            setMessage(response);
        })
        .catch(error => {
            setMessage(error)
        })
        .finally(() => {
            setAlert(true);
            handleStatusClose();
        })
    }

        let initialValues = {
            _id: user ? user.payload._id : '',
            fullname: user ? user.fullname : '',
            email: user ? user.email: '',
            phone: user ? user.phone : '',
            size: user ? user.partySize: 1,
            service_id: user ? user.serviceTag : '',
            resource_id: user ? user.resourceTag: '',
            employee_id: user ? user.employeeTag: '',
            notes: user ? user.notes : '',
        };
        
        const validationSchema = Yup.object({
            fullname: Yup.string().required('Full name is required'),
            phone: Yup.string().matches(PHONE_REGEX, 'Phone number must be in the format xxx-xxx-xxxx')
            .required('Phone number is required'),
            email: Yup.string(),
            size: Yup.number(),
            service_id: Yup.string(),
            employee_id: Yup.string(),
            resource_id: Yup.string(),
            notes: Yup.string(),
        });


        const handleSubmit = (data) => {
            const payload = { ...data, appointment: selectedAppointment, appointmentDate: selectedDate}
            appointmentEdit(payload);

        }

        const appointmentEdit = (payload) => {
            requestClientEditApp(payload)
            .then(response => {
                dispatch(setSnackbar({requestMessage: response, requestStatus: true}))
            })
            .catch(error => {
                console.log(error);
                dispatch(setSnackbar({ requestMessage: error.response.msg, requestStatus: true} ))
            })
            .finally(() => {
                setLoading(false);
                dispatch(setReload(true));
                closeDialog();
            })
        }

        const FutureDatePicker = ({ label, value, onChange }) => {
        const currentDate = DateTime.local().setZone(business.timezone);
    
        return (
          <Box>
          <DatePicker
            label={label}
            sx={{
                width: '100%'
            }}
            value={value}
            onChange={onChange}
            renderInput={(params) => <TextField {...params} />}
            minDate={currentDate}
          />
          </Box>
        );
      };

      const handleDateChange = (date) => {
        // Also call to get available employees.
        getAvailableEmployees(date);
        setSelectedDate(date);
    };
    // Last left off. 
    // 9:35 pm 27th
    // Need to fix waiting, to show a similar to WelcomeSector (Cards, Appointment slots)
    // 1. SetEmployeeList now holds all current date available, Create Menu show all the employees.
    // 2. Retrive all services associated with employee, show similar to WelcomeSelector.
    // 3. Search all appointments available with {link, unid, date, ....} 

    const getAvailableEmployees = (date) => {
        const incomingDate = date.toISO();
        getEmployeeList(incomingDate,link)
        .then(response => {
            setEmployeeList(response);
        })
        .catch(error => {
            setError(error);
        })  
        .finally(() => {
            setLoading(false);
            setOpenEmployees(true);
        })
    }

    const closeDialog = () => {
        setEditClient(false);
    }


    const searchAppointments = (employeeId, serviceId) => {
        if (!selectedDate || !serviceId || !employeeId) {
            setErrors('Missing date and service.');
            return;
        }
        setErrors(null);
        const payload = { employeeId: employeeId, serviceId: serviceId, appointmentDate: selectedDate }
        getAvailableAppointments(payload)
        .then(response => {
            setAppointments(response.data)
            setSuccess(response.msg)
        })
        .catch(error => {
            setErrors(error);
        })
        .finally(() => {
            //setLoading(false);
        })
    }



    return(
        <>
            <Box className="center-box" sx={{ pt: 3 }}>
                    <Card className="custom-card" sx={{ textAlign:'center', p: 2, borderRadius: 5, boxShadow: 0 }}>
                    <Box sx={{ width: '100%' }}>
                    <Collapse in={alert}>
                        <Alert
                        action={
                            <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setAlert(false);
                                setMessage(null);
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        >
                        {message}
                        </Alert>
                    </Collapse>
                    
                    </Box>


                        <Typography variant="body2" fontWeight="bold" color="gray" gutterBottom>
                            <Link underline="hover" href={`/welcome/${link}`}>{link}</Link>
                        </Typography>
                        {loading ? <CircularProgress /> : 
                        <CardContent>
                            
                        { errors ? <Alert severity="error">
                            <AlertTitle sx={{ textAlign: 'left', fontWeight: 'bold'}}>Error</AlertTitle>
                            <Typography sx={{ textAlign: 'left'}}>{errors}</Typography>
                            </Alert>: null} 
                        
                        <Stack sx={{ pt: 2}} spacing={3}>
                            
                            <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                {errors ? 
                                (
                                
                                <div className="circle_red">
                                    <PriorityHighIcon htmlColor="#fc0303" sx={{ fontSize: 50}} />
                                </div>
                                ): 
                                (
                                    <div className="circle_yellow">
                                        {type === WAITLIST && <NotificationsRoundedIcon htmlColor="#ffbb00" sx={{ fontSize: 50 }} />}
                                        {type === APPOINTMENT && <EventAvailableTwoToneIcon htmlColor="#ffbb00" sx={{ fontSize: 50 }} /> }
                                    </div>                                
                                )
                                }
                            </Container>
                            
                            { type === APPOINTMENT && (
                                <>
                                    <Typography variant="h5" fontWeight="bold"> Appointment details </Typography>
                                </>
                            )} 

                            {type === WAITLIST && (
                                <>
                                <Typography variant="h4" fontWeight="bold" > {titles ? titles.title : ''} </Typography>
                                <Typography variant="body2"> {titles ? titles.desc : ''}</Typography>
                                </>
                            )}

                            { type === APPOINTMENT && (
                                <Button disabled={errors ? true: false} onClick={() => setOpen(true)} variant="outlined" color="error" sx={{ borderRadius: 10}}>
                                    <Typography  variant="body2" fontWeight="bold" sx={{color: 'black', margin: 1 }}>I'm not comming
                                    </Typography>
                                </Button>
                            )} 

                            { 
                                type === WAITLIST && (
                                    <>
                                        {status ? 
                                        (
                                            <>
                                            <Divider />
                                            <Button onClick={() => setOpenStatus(true)} variant="outlined" color="success" sx={{ borderRadius: 10}}>
                                                <Typography variant="body2" fontWeight="bold" sx={{color: 'black', margin: 1 }}>Status
                                                </Typography>
                                            </Button>
                                            </>
                                        )
                                        : 
                                        (
                                            <>
                                            <Button disabled={errors ? true: false} onClick={() => setOpen(true)} variant="outlined" color="error" sx={{ borderRadius: 10}}>
                                                <Typography  variant="body2" fontWeight="bold" sx={{color: 'black', margin: 1 }}>I'm not comming
                                                </Typography>
                                            </Button>
                                            </>
                                        )
                                        }
                                    </>
                                ) 
                            }
                            
                
                            <Divider />
                            { type === WAITLIST  &&  
                            <Container sx={{ textAlign: 'left'}}>
                                <Typography variant="subtitle2" sx={{ color: "gray"}}> Name </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.fullname : '' }</Typography>

                                <Typography variant="subtitle2" sx={{ color: "gray"}}> Phone </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.phone : ''}</Typography>

                                <Typography variant="subtitle2" sx={{ color: "gray"}}> Email </Typography>
                                <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{user ? user.email : ''}</Typography>
                            </Container>
                            }

                            { type === APPOINTMENT  &&  
                            <Container sx={{ textAlign: 'left'}}>
                                <Typography variant="subtitle2" sx={{ color: "gray"}}> Name </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.fullname : '' }</Typography>

                                <Typography variant="subtitle2" sx={{ color: "gray"}}> Phone </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold'}} gutterBottom> {user ? user.phone : ''}</Typography>

                                <Typography variant="subtitle2" sx={{ color: "gray"}}> Duration </Typography>
                                <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{user ? DateTime.fromFormat(user.start, 'HH:mm').toFormat('h:mm a') +  " - " + DateTime.fromFormat(user.end, 'HH:mm').toFormat('h:mm a') : ''}</Typography>

                                <Typography variant="subtitle2" sx={{ color: "gray"}}> Date </Typography>
                                <Typography variant="body1"  sx={{ fontWeight: 'bold'}} gutterBottom>{user ? DateTime.fromISO(user.appointmentDate).toFormat('LLL dd yyyy') : ''}</Typography>
                            </Container>
                            }
                            <Divider />
                            { 
                                type === WAITLIST && (
                                    <>
                                    <Container sx={{ justifyContent: 'center',  alignItems: 'center', display: 'flex'}}>
                                        <Stack direction={'row'} spacing={0.5}>
                                            <Button disabled={errors ? true: false} size="small" variant="info" onClick={() => copyToClipboardHandler()}>share link</Button>
                                            <Button disabled={errors ? true: false} variant="info" onClick={() => navigateToWaitlist() }> View waitlist</Button>
                                            <Button disabled={errors ? true: false} variant="info" onClick={() => setOpen(true)}> Leave waitlist</Button>
                                        </Stack>
                                    </Container>
                                    </>
                                )
                            }
                            {
                                type === APPOINTMENT && (
                                    <>
                                    <Container sx={{ justifyContent: 'center',  alignItems: 'center', display: 'flex'}}>
                                        <Stack direction={'row'} spacing={0.5}>
                                            <Button disabled={errors ? true: false} size="small" variant="info" onClick={() => console.log("status")}>Update Status</Button>
                                            <Button disabled={errors ? true: false} size="small" variant="info" onClick={() => console.log("Reschedule")}>Edit appointment</Button>
                                            <Button disabled={errors ? true: false} size="small" variant="info" onClick={() => setOpen(true)}>Cancel appointment</Button>
                                        </Stack>
                                    </Container>
                                    </>
                                )
                            }
                            <Divider />
                        </Stack>
                    
                    
                        </CardContent>
                        }
                        <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 2}}>
                            <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                        </CardActions>
                    </Card>
            </Box>

            <Dialog
                id="leave_dialog"
                open={open}
                onClose={handleClose}
                maxWidth={'xs'}
            >
                
            <DialogTitle>
                {type === APPOINTMENT && (<Typography variant="h6" fontWeight={'bold'}>Cancel appointment ?</Typography> )}
                {type === WAITLIST && (<Typography variant="h6" fontWeight={'bold'}>Leave waitlist ?</Typography> )}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton>
                
            </DialogTitle>
            
            <DialogContent>
                <DialogContentText>
                    {type === APPOINTMENT && (<Typography variant="caption">You are abandoning your appointment.</Typography> )}
                    {type === WAITLIST && (<Typography variant="caption">This means that you will no longer receive notifications or updates regarding your position in the queue.</Typography> )}
                </DialogContentText>   
            </DialogContent>
            <DialogActions>
                <Button sx={{ borderRadius: 10}} variant="contained" color="primary" onClick={() => handleClose()}>No</Button>
                <Button sx={{ borderRadius: 10}} variant="outlined" color="error" onClick={() => leaveWaitlist()}>Yes</Button>
            </DialogActions>
            </Dialog>

            <Dialog
                id="status_dialog"
                open={openStatus}
                onClose={handleStatusClose}
                minWidth={'xs'}
                maxWidth={'sm'}
            >
            <DialogTitle>
                <Typography variant="h6" fontWeight={'bold'}>Set status</Typography>  
                <IconButton
                    aria-label="close"
                    onClick={handleStatusClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Divider />
                <DialogContentText>
                    <Typography variant="body2" gutterBottom>Let us know where you are at!</Typography>  
                </DialogContentText>
                
                <Container sx={{ width: '100%'}}>
                <Stack spacing={2}>
                    <Button size="large" color="primary" sx={{ borderRadius: 10}} variant={clientStatus.late ? "contained" : "outlined"} startIcon={<WatchLaterIcon /> } onClick={() => setClientStatus((prev) => ({...prev, late: !clientStatus.late})) }>Late</Button>
                    <Button size="large"  color="primary"sx={{ borderRadius: 10}} variant={clientStatus.here ? "contained" : "outlined"}  startIcon={<EmojiPeopleIcon /> } onClick={() => setClientStatus((prev) => ({...prev, here: !clientStatus.here})) }>Here</Button>
                    <Button size="large"  color="primary" sx={{ borderRadius: 10}} variant={clientStatus.parking ? "contained" : "outlined"}  startIcon={<DirectionsCarFilledIcon /> } onClick={() => setClientStatus((prev) => ({...prev, parking: !clientStatus.parking})) }>Parking</Button>
                </Stack>
                </Container>
            </DialogContent>
            <DialogActions>
                <Button sx={{ borderRadius: 10, color: 'black'}} variant="text" onClick={() => statusRequest()}>Update</Button>
            </DialogActions>
            </Dialog>

            <Dialog
                open={editClient}
                onClose={() => closeDialog()}
                maxWidth={'xs'}
                fullWidth={true}
            >
                <DialogTitle> 
                    <Typography variant="h6" fontWeight="bold">
                    {"Edit client"}
                </Typography> 
                <IconButton
                    aria-label="close"
                    onClick={() => closeDialog()}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton>
                </DialogTitle>

                
                <DialogContent>
                    { errors ? <Alert severity="error">{errors}</Alert>: null }
                    { success ? <Alert severity="success">{success}</Alert>: null }
                    <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                    >
                    {({ errors, touched, handleChange, handleBlur, values }) => (
                    
                        <Form>
                        <Stack sx={{ pt: 1 }} direction="column" spacing={2}>
                            <Field
                            as={TextField}
                            id="fullname"
                            size="small"
                            name="fullname"
                            label="Customer name"
                            placeholder="Customer name"
                            error={touched.fullname && !!errors.fullname}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />
                            <Field
                            as={TextField}
                            id="email"
                            size="small"
                            name="email"
                            label="Customer email"
                            placeholder="Email"
                            error={touched.email && !!errors.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />

                            <Field
                            as={TextField}
                            id="phone"
                            size="small"
                            name="phone"
                            label="Phone"
                            placeholder="xxx-xxx-xxxx"
                            error={touched.phone && !!errors.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />

                            <Field
                            as={TextField}
                            id="size"
                            name="size"
                            size="small"
                            label="Party size"
                            error={touched.size && !!errors.size}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />
                            <Grid container>
                                <Grid item xs={12} md={6} sm={6}>
                                {business ? (
                            <>
                                <Typography fontWeight={'bold'} variant="subtitle2">Resources</Typography>
                                <Field
                                as={Select}
                                labelId="resources"
                                size="small"
                                fullWidth={true}
                                name="resource_id"
                                onChange={handleChange}
                                >
                                <MenuItem key={'NONE'} value={''}>none</MenuItem>
                                {Array.isArray(resourceList) ? resourceList.map((resource) => (
                                    <MenuItem key={resource._id} value={resource._id}>
                                        <ListItemIcon>
                                            { resource.serving && resource.active ? <FiberManualRecordIcon fontSize="xs" htmlColor="#00FF00"/> : <FiberManualRecordIcon fontSize="xs" htmlColor="#00FF00"/> }
                                        </ListItemIcon>
                                        <Typography variant="body2">{resource.title} </Typography>
                                    </MenuItem>
                                )) : null}
                                </Field>
                            </>
                            ) : null}
                            </Grid>
                            <Grid item xs={12} md={6} sm={6}>
                            <>
                                <Typography fontWeight={'bold'} variant="subtitle2">Employee preference</Typography>
                                <Field
                                as={Select}
                                id="employee_id"
                                name="employee_id"
                                size="small"
                                fullWidth={true}
                                onChange={handleChange}
                                >
                                {Array.isArray(employeeList) ? employeeList.map((employee) => (
                                    <MenuItem key={employee._id} value={employee._id}>
                                        <Typography variant="body2">{employee.fullname} </Typography>
                                    </MenuItem>
                                )) : null}
                                </Field>
                            </>
                                </Grid>
                            </Grid>
                            

                            {values.employee_id ? (
                                
                            <>
                                <Typography fontWeight={'bold'} variant="subtitle2">Services available</Typography>
                                <Field
                                as={Select}
                                labelId="services"
                                name="service_id"
                                size="small"
                                onChange={handleChange}
                                >
                                { Array.isArray(serviceList) ?
                                
                                serviceList
                                .filter((service) => service.employeeTags.includes(values.employee_id))
                                .map((service) => (
                                    <MenuItem key={service._id} value={service._id}>
                                        <Stack>
                                            <Typography variant="body2">{service.title}</Typography>
                                            <Typography variant="caption">{'Duration: ' + service.duration + ", Cost: " + service.cost }</Typography>
                                        </Stack>
                            
                                    </MenuItem>
                                )):null }
                                </Field>
                            </>
                            ) : null}

                            <>
                                <Box>
                                    <FutureDatePicker label="Date" value={selectedDate} onChange={handleDateChange} />
                                
                                </Box>
                                <Button sx={{ borderRadius: 10}} fullWidth={false} variant="outlined" onClick={() => searchAppointments(values.employee_id, values.service_id) }>Search</Button>
                                <br/>
                            </>
                            {
                                (appointments !== null) ? 
                                (
                                    <div style={{ width: '100%', height: '100%',overflowX: 'auto'}}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap'}}>
                                        <Stack direction={'row'}>
                                        
                                        { 
                                           Object.keys(appointments).map((key, index) => {
                                            const appointment = appointments[key];
                                            return (
                                                <Button 
                                                    sx={{ margin: 1, borderRadius: 10}}
                                                    variant={selectedAppointment === appointment ? "contained": "outlined"}
                                                    onClick={() => handleAppointmentClick(appointment)} 
                                                    color={selectedAppointment === appointment ? 'primary': 'secondary'}
                                                    id="appointmentButtons">
                                                    <Typography sx={{ whiteSpace: 'nowrap' }} variant="caption">{DateTime.fromFormat(appointment.start, "HH:mm").toFormat("hh:mm a")}</Typography>
                                                    <Typography sx={{ whiteSpace: 'nowrap' }} variant="caption">{"-"}</Typography>
                                                    <Typography sx={{ whiteSpace: 'nowrap' }}  variant="caption">{DateTime.fromFormat(appointment.end, "HH:mm").toFormat("hh:mm a")}</Typography>
                                                </Button>
                                            )
                                        })
                                        }
                                        </Stack>
                                        </Box>
                                    </div>
                                )
                                :null
                            }
                            <Field
                            as={TextField}
                            id="notes"
                            name="notes"
                            size="small"
                            label="Notes"
                            placeholder="Additional notes"
                            error={touched.notes && !!errors.notes}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />

                            <ErrorMessage name="notes" component="div" />
                            <Button sx={{ borderRadius: 10}} variant="contained" type="submit">Submit</Button>
                        </Stack>
                        </Form>
                    )}
                    </Formik>
                </DialogContent>
                

            </Dialog>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
                open={openSnack}
                onClose={closeSnack}
                autoHideDuration={3000}
                message={'Copied to clipboard.'}
            >
            </Snackbar>
            
        
        </>
    )
}