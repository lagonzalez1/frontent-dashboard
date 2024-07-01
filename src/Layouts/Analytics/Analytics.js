import React, { useState, useEffect } from "react";
import { Container, Box, Button, Grid, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Stack, Typography, Rating, IconButton, Select, MenuItem, Card, CardContent, CircularProgress, Divider, Avatar, ListItemAvatar, Skeleton, CardActionArea } from "@mui/material";
import { useSelector } from "react-redux";
import {searchEmployees, searchResources, searchServices } from "../../hooks/hooks";
import StarIcon from '@mui/icons-material/Star';
import { getBusinessAnalytics, getEmployeeAnalytics, getEmployeeAnalyticsRange } from "./AnalyticsHelper";
import { DateTime } from "luxon";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CachedIcon from '@mui/icons-material/Cached';
import { useDispatch } from "react-redux";
import AlertMessageGeneral from "../../components/AlertMessage/AlertMessageGeneral";

import { Package, HourglassHigh, UserSwitch , UsersThree, XCircle, Database, FireSimple, Drop,Waves , Campfire , FlowerLotus, Tree, Coffee, User  } from "phosphor-react"; 
import Collapse from '@mui/material/Collapse';
import BusinessTotalsBars from "../../components/Vizual/BusinessTotalsBars";
import GuageService from "../../components/Vizual/GuageService";
import EmployeePie from "../../components/Vizual/EmployeePie";
import ServiceBar from "../../components/Vizual/ServiceBar";
import ResourcesBars from "../../components/Vizual/ResourcesBars";
import GuagePercentages from "../../components/Vizual/GuagePercentages";
import { setSnackbar } from "../../reducers/user";
import { payloadAuth } from "../../selectors/requestSelectors";



const Analytics = () => {

    
    const business = useSelector((state) => state.business);
    const [range, setRange] = useState({ start: DateTime.local().setZone(business.timezone), end: DateTime.local().setZone(business.timezone)});

    const dispatch = useDispatch();
    const services = useSelector(state => state.business.services);
    const resources = useSelector(state => state.business.resources);
    const employeeList = useSelector(state => state.business.employees);
    const {id, bid, email} = useSelector((state) => payloadAuth(state));

    const [type, setType] = useState('AVERAGE');
    const [employeeId, setEmployeeSelect] = useState('');
    const [employeeData, setEmployeeData] = useState(null);
    const [businessData, setBusinessData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [loadBusiness, setLoadBusiness] = useState(false);
    const [businessLoader, setBusinessLoader] = useState(false);

    const [error, setError] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [alert, setAlert] = useState({title: null, body: null})


    const handleEmployeeClick = (event, index) => {
        setEmployeeSelect(index);
    };

    

    useEffect(() => {
        getEmployeeData();
    }, [employeeId])

    useEffect(() => {
        getBusinessData();
        return () => {
            setLoadBusiness(false)
        }
    }, [loadBusiness])

    const getBusinessData = () => {
        getBusinessAnalytics( bid, email)
        .then(response => {
            setBusinessData(response);
        })
        .catch(error => {
            setOpenError(true)
            setError(true);
            setAlert({title: error.msg});
        })
        .finally(() => {
            setLoading((prev) => ({...prev, business: false}))
            setBusinessLoader(false);
        })
    }

    const getEmployeeData = () => {
        if (employeeId === "") {
            return;
        }
        setLoading(true)
        getEmployeeAnalytics(employeeId, bid, email)
        .then(response => {
            setEmployeeData(response);
        })
        .catch(error => {
            setOpenError(true)
            setError(true)
            setAlert({title: 'Error', body: error.msg, open: true});        
        })
        .finally(() => {
            setLoading(false)
        })
        
    }

    const reloadAnalyticsData = () => {
        if (employeeId === ""){
            setOpenError(true)
            setError(true);
            setAlert({title: 'Error', body:'Please select an employee to view its available data given its date range.', open: true});
            return;
        }
        if (!checkValidRange(range.start, range.end)) {
            setOpenError(true)
            setError(true);
            setAlert({title: 'Error', body:'Range is not valid, {from} must be before than {to}.', open: true});
            return;
        }
        setLoading(true)
        const payload = { eid: employeeId, type: type, start: range.start.toISO(), end: range.end.toISO()}
        getEmployeeAnalyticsRange(payload, bid, email)
        .then(response => {
            setEmployeeData(response)
        })
        .catch(error => {
            setOpenError(true)
            setError(true);
            setAlert({title: 'Error', body: error.msg, open: true});
        })
        .finally(() => {
            setLoading(false)
        })

        
    }

    const closeAlert = () => {
        setOpenError(false);
        setError(false);
        setAlert({title: null, body: null})
    }

    function checkValidRange (start, end) {
        return start < end ? true: false;
    }


    return (
    <div className="mainContainer">
        <Collapse in={openError}>
            <Box sx={{pt:1}}>
                <AlertMessageGeneral open={error} onClose={closeAlert} title={alert.title} body={alert.body} />
            </Box>
        </Collapse>
        

        <Grid container direction="row">
            <Grid item xs={12} md={6} sm={12} lg={6}>
                <Stack>
                    <Typography variant="body2">{business ? business.businessName: <Skeleton/> }</Typography>
                    <Typography variant="h5"><strong>Analytics</strong></Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} md={6} sm={12} lg={6}>
                <Typography gutterBottom variant="body2">{'Date range'}</Typography>
                <Stack sx={{width: '100%'}} direction={'row'} spacing={1} alignItems={'center'} justifyContent="flex-start">

                    <DatePicker label="From" value={range.start} onChange={(newValue) => setRange((prev) => ({...prev, start: newValue}))} />
                    <Typography variant="body2" fontWeight={'bold'}> {'-'} </Typography>
                    <DatePicker label="To" value={range.end} onChange={(newValue) => setRange((prev) => ({...prev, end: newValue}))}/>
                    
                    <IconButton onClick={() => reloadAnalyticsData()}><CachedIcon/></IconButton>
                </Stack>

            </Grid>
        </Grid>

        
        
            <Grid container sx={{ pt: 1, width: '100%'}} direction="row">
                <Grid item lg={4} md={4} xs={12} sm={12}>
                    { /** Employee list */}
                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <Typography variant="h6" fontWeight={'bold'}>Current employees</Typography>
                        <List component="nav" aria-label="employeeSelect" sx={{maxHeight: 250}}>

                            {employeeList ? employeeList.map((employee, index) => {
                                return (
                                    <ListItemButton
                                        selected={employeeId === employee._id}
                                        onClick={(event) => handleEmployeeClick(event, employee._id)}
                                        >
                                        <ListItemAvatar>
                                            <Avatar sx={{ width: 40, height: 40 }} src={employee.image !== null ? employee.image : null} variant="rounded" />
                                        </ListItemAvatar>
                                        <ListItemText primary={employee.fullname} />
                                    </ListItemButton>
                                )
                            }): null}            
                        </List>
                    </Box>
                    
                </Grid>
                
                <Grid item lg={8} md={8} xs={12} sm={12}>
                    { /** Data FOR EMPLOYEES in various graph list, total, Waittime, servve_time, noshow, resorce/service average */}
                    {employeeData === null ? (
                            <Box sx={{ display: 'flex', pt: 4, justifyContent: 'center', alignItems: 'center'}}>
                                <Typography  variant="substitle2" fontWeight={'light'}>No data</Typography>
                                <Database size={27} />
                            </Box>
                        ): 
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Stack spacing={3}>
                                <EmployeePie data={employeeData.waitlist} type={'Wait'} centerLabel={'waitlist'}/>
                                <EmployeePie data={employeeData.appointments} type={'App'} centerLabel={'appointments'} />
                            </Stack>
                        </Box>
                        
                        }
                </Grid>  
                <Grid item lg={6} md={6} xs={12} sm={12}>
                <div style={{ overflowX: 'auto', display: 'flex', width: '100%' }}>
                    <Stack sx={{ whiteSpace: 'nowrap' }} direction="row"
                        justifyContent="space-evenly"
                        alignItems="center"
                        spacing={2}>
                    { employeeData &&
                        employeeData.resources.map((item) => {
                        return (
                            <Card elevation={0} sx={{minWidth: '150px'}}>
                                <CardActionArea>
                                <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                    <GuagePercentages value={Math.floor(item.avg * 100)} />
                                    <Typography gutterBottom textAlign={'center'} variant="subtitle2">
                                        { searchResources(item.id, resources).title }
                                    </Typography>
                                    <Typography variant="caption">
                                            {'(resources)'}
                                    </Typography>
                                    <Typography gutterBottom  variant="subtitle2">
                                    { Math.floor(item.avg * 100) + "%" }
                                    </Typography>
                                </CardContent>
                                </CardActionArea>
                            </Card>
                        )
                    })
                }
                { employeeData &&
                        employeeData.services.map((item, index) => {
                            const len = employeeData.services.length;
                            return (
                                <Card elevation={0} key={index} sx={{minWidth: '150px'}}>
                                    <CardActionArea>
                                    <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                        <GuagePercentages value={Math.floor(item.avg * 100) } />
                                        <Typography gutterBottom textAlign={'center'} variant="subtitle2">
                                            {searchServices(item.id, services).title }
                                        </Typography>
                                        <Typography variant="caption">
                                            {'(services)'}
                                        </Typography>

                                        <Typography gutterBottom variant="subtitle2">
                                        { Math.floor(item.avg * 100) + "%" }
                                        </Typography>
                                    </CardContent>
                                    </CardActionArea>
                                </Card>
                            )
                        })
                    }
                    </Stack>
                </div>
                </Grid>

                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <div style={{ overflowX: 'auto', display: 'flex', width: '100%' }}>
                    
                    {
                        employeeData && 
                        (
                        <Stack 
                            direction="row"
                            sx={{ whiteSpace: 'nowrap' }} 
                            justifyContent="space-evenly"
                            alignItems="center"
                            spacing={2}>
                            <Card elevation={0} sx={{ maxWidth: 200, minWidth: 150}}>
                            <CardActionArea>
                                <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                    <GuageService value={Math.floor(employeeData.wait_time)}  />
                                    <HourglassHigh alignmentBaseline="center" size={20} />
                                    <Typography textAlign={'center'}  gutterBottom variant="body2">
                                        {'Wait time average (min)'}
                                    </Typography>
                                </CardContent>
                                </CardActionArea>
                            </Card>

                    <Card elevation={0} sx={{ maxWidth: 200,minWidth: 150}}>
                        <CardActionArea>
                            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                <GuageService value={Math.floor(employeeData.serve_time)}  />
                                <UserSwitch size={20}  />
                                <Typography textAlign={'center'}  gutterBottom variant="body2">
                                    {'Serve time average (min)'}
                                </Typography>
                            </CardContent>
                            </CardActionArea>
                        </Card>

                    <Card elevation={0} sx={{ maxWidth: 200, minWidth: 150}}>
                        <CardActionArea>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                <GuageService value={Math.floor(employeeData.party_size)}/>
                                <UsersThree size={20}  />
                                <Typography  textAlign={'center'}  gutterBottom variant="body2">
                                {'Party size average (persons)'}
                                </Typography>
                            </CardContent>
                            </CardActionArea>
                        </Card>
                    <Card elevation={0} sx={{ maxWidth: 200, minWidth: 150}}>
                        <CardActionArea>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                            <GuageService value={Math.floor(employeeData.no_show)}  />
                            <XCircle  size={20}  />
                            <Typography  textAlign={'center'}  gutterBottom variant="body2">
                                No shows
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </Card>
                        </Stack>
                        )
                    }
                    </div>
                </Grid>
            </Grid>

            { /** END OF EMPLOYEES Serve_time, Wait_time, No_show, Party_size */}
            <Divider />
            <Grid 
                container sx={{ pt: 1}}
                direction="row"
            >
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    { /** Business metrics as of total, Waittime, servve_time, noshow, resorce/service average  */ }
                    <Box sx={{ width: '100%', bgcolor: 'background.paper', overflowX: 'auto'}}>
                            <Typography variant="h6" fontWeight={'bold'}>Business metrics</Typography>
                            <Typography variant="subtitle1" fontWeight={'bold'}  sx={{ pt: 0.5}}>In line metrics</Typography>
                            {businessData ? ( 
                            <Grid container direction={'row'} spacing={1} columnSpacing={1}>
                                <Grid item xs={12} sm={6} md={3} lg={3}>
                                <Card elevation={0} sx={{ maxWidth: 200, minWidth: 165}}>
                                    <CardActionArea>
                                    <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                        <GuageService value={Math.ceil(businessData.wait_time)} />
                                        <HourglassHigh alignmentBaseline="center" size={22} />
                                        <Typography textAlign={'center'} gutterBottom variant="body2">
                                            {'Wait time average (min)'}
                                        </Typography>
                                    </CardContent>
                                    </CardActionArea>
                                </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} lg={3}>
                                <Card elevation={0} sx={{ maxWidth: 200, minWidth: 165}}>
                                    <CardActionArea>
                                    <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                        <GuageService value={Math.ceil(businessData.serve_time)} />
                                        <UserSwitch alignmentBaseline="center" size={22}  />
                                        <Typography textAlign={'center'}  gutterBottom variant="body2">
                                            {'Serve time average (min)'}
                                        </Typography>
                                    </CardContent>
                                    </CardActionArea>
                                </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} lg={3}>
                                <Card elevation={0} sx={{ maxWidth: 200, minWidth: 165}}>
                                    <CardActionArea>
                                    <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                        <GuageService value={Math.ceil(businessData.party_size)} />
                                        <UsersThree alignmentBaseline="center" size={22} />
                                        <Typography textAlign={'center'}  gutterBottom  variant="body2">
                                            {'Party size average (persons)'}
                                        </Typography>
                                    </CardContent>
                                    </CardActionArea>
                                </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} lg={3}>
                                <Card elevation={0} sx={{ maxWidth: 200, minWidth: 165}}>
                                    <CardActionArea>
                                    <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                        <GuageService value={Math.ceil(businessData.no_show)} />
                                        <UsersThree alignmentBaseline="center" size={22} />
                                        <Typography textAlign={'center'}  gutterBottom  variant="body2">
                                            {'No show'}
                                        </Typography>
                                    </CardContent>
                                    </CardActionArea>
                                </Card>
                                </Grid>
                            </Grid>) : null }
                            
                    </Box>
                </Grid>
                <Divider />

                <Grid item lg={6} md={6} xs={12} sm={12}>
                    { /** Ratings */}
                    <Typography variant="h6" fontWeight={'bold'}>Employee Ratings</Typography>
                    <List sx={{overflow: 'auto', maxHeight: 320}} component="nav" aria-label="employeeSelect">

                            {businessData && businessData.employeeRatings.map((item, index) => {
                                const id = item.id;
                                const employeeResult = searchEmployees(id, employeeList);
                                if (employeeResult.fullname === "NA") { return null; }
                                const popularity = Math.ceil(item.popularity);
                                const rating = Math.ceil(item.data);
                                const count = item.count;
                                return (
                                    <ListItem key={index} alignItems="flex-start">
                                        
                                        <ListItemText primary={employeeResult.fullname}
                                            secondary={
                                            <React.Fragment>                                            
                                            <Stack>
                                            <Rating
                                                name="text-feedback"
                                                value={rating}
                                                readOnly
                                                precision={0.5}
                                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                                />
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                            {`Completed (${popularity})`}
                                            </Typography>                                                
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {`Ratings (${count})`} 
                                                
                                            </Typography>
                                            </Stack>
                                            <Box>
                                            
                                            </Box>
                                            </React.Fragment>
                                        }
                                        />
                                    </ListItem>
                                )
                            })}            
                        </List>
                    

                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                    <Typography gutterBottom variant="subtitle1" fontWeight={'bold'}>Service and resource popularity</Typography>
                </Grid>

                <Grid item lg={6} md={6} xs={12} sm={12}>
                    {businessData && (
                        <Container>
                            <ServiceBar serviceData={businessData.services} />
                        </Container>
                    )
                    }
                    <Divider />
                </Grid>

                <Grid item lg={6} md={6} xs={12} sm={12}>
                    {
                        businessData && (
                        <Container>
                            <ResourcesBars resourceData={businessData.resources} />
                        </Container>)
                    }
                    
                </Grid>
            </Grid>
            <Divider />

            <Grid container>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                    <Typography gutterBottom variant="subtitle1" fontWeight={'bold'}>Business totals</Typography>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                <Container>
                    {businessData && <BusinessTotalsBars data={businessData} /> }
                </Container>
                </Grid>
            </Grid>
        
    </div>

        
    )
}

export default Analytics;