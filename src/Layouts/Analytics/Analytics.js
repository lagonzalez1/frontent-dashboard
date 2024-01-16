import React, { useState, useEffect } from "react";
import { Container, Box, Button, Grid, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Stack, Typography, Rating, IconButton, Select, MenuItem, Card, CardContent, CircularProgress, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { findResource, findService, getEmployeeList } from "../../hooks/hooks";
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import ProgressBar from 'react-bootstrap/ProgressBar';
import DonutGraph from "../../components/Vizual/DonutGraph";
import axios from "axios";
import { getBusinessAnalytics, getEmployeeAnalytics, getEmployeeAnalyticsRange } from "./AnalyticsHelper";
import { DateTime } from "luxon";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CachedIcon from '@mui/icons-material/Cached';
import AlertMessageGeneral from "../../components/AlertMessage/AlertMessageGeneral";
import BarGraphWait from "../../components/Vizual/BarGraphWait";
import BarGraphApp from "../../components/Vizual/BarGraphApp";
import { CalendarBlank, HourglassHigh, UserSwitch , UsersThree, XCircle  } from "phosphor-react"; 



const Analytics = () => {


    const business = useSelector((state) => state.business);
    const employeeList = getEmployeeList();
    const [range, setRange] = useState({ start: DateTime.local().setZone(business.timezone), end: DateTime.local().setZone(business.timezone)});

    const [mock, setMock] = useState({
        waittime: 90,
        serve_time: 60
    })
    const [type, setType] = useState('AVERAGE');
    const [employeeId, setEmployeeSelect] = useState('');
    const [employeeData, setEmployeeData] = useState(null);
    const [businessData, setBusinessData] = useState(null);

    const [loading, setLoading] = useState({employee: false, business: false});

    const [error, setError] = useState(false);
    const [alert, setAlert] = useState({title: null, body: null})


    const handleEmployeeClick = (event, index) => {
        setEmployeeSelect(index);

        setMock({waittime: Math.random(100), serve_time: Math.random(100)})
    };


    useEffect(() => {
        getEmployeeData();
    }, [employeeId])

    useEffect(() => {
        getBusinessData();
    }, [])

    const getBusinessData = () => {
        getBusinessAnalytics()
        .then(response => {
            setBusinessData(response)
        })
        .catch(error => {
            setError(true)
            setAlert({title: error.response.data.msg})
        })
        .finally(() => {
            setLoading((prev) => ({...prev, business: false}))
        })
    }



    const getEmployeeData = () => {
        if (employeeId === "") {
            return;
        }
        setLoading((prev) => ({...prev, employee: true}))
        getEmployeeAnalytics(employeeId)
        .then(response => {
            console.log(response)
            setEmployeeData(response);
        })
        .catch(error => {
            setError(true)
            setAlert({title: error.response.data.msg})
        })
        .finally(() => {
            setLoading((prev) => ({...prev, employee: false}))
        })
        
    }

    const reloadAnalyticsData = () => {
        console.log(range)
        if (employeeId === ""){
            setError(true);
            setAlert({title: 'Error', body:'No employee has been selected', open: true});
            return;
        }
        if (!checkValidRange(range.start, range.end)) {
            setError(true);
            setAlert({title: 'Error', body:'Range is not valid, {from} must be before than {to}.', open: true});
            return;
        }
        setLoading((prev) => ({...prev, employee: true}))

        const payload = { eid: employeeId, type: type, start: range.start.toISO(), end: range.end.toISO()}
        getEmployeeAnalyticsRange(payload)
        .then(response => {
            setEmployeeData(response)
        })
        .catch(error => {
            setError(true)
            setAlert({title: error.response.data.msg})
        })
        .finally(() => {
            setLoading((prev) => ({...prev, employee: false}))
        })

        
    }

    const closeAlert = () => {
        setError(false);
        setAlert({title: null, body: null})
    }

    function checkValidRange (start, end) {
        return start < end ? true: false;
    }


    return (
    <div className="mainContainer">
        { error === true ? (
            <Box sx={{pt:1}}>
                <AlertMessageGeneral open={error} onClose={closeAlert} title={alert.title} body={alert.body} />
            </Box>
        ): null}

        <Grid container direction="row">
            <Grid  item xs={12} md={6} sm={12} lg={6}>
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
                    <Select
                        labelId="select-type"
                        id="select-type"
                        value={type}
                        label="Type"
                        onChange={e => setType(e.target.value)}
                    >
                        <MenuItem value={'AVERAGE'}>Avg</MenuItem>
                        <MenuItem value={'TOTAL'}>Total</MenuItem>
                    </Select>
                    <IconButton onClick={() => reloadAnalyticsData()}><CachedIcon/></IconButton>
                </Stack>

            </Grid>
        </Grid>

        
        
            <Grid container sx={{ pt: 1}} 
                direction="row"
                >
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    { /** Employee list */}
                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <Typography variant="subtitlel" fontWeight={'bold'}>Current employees</Typography>
                        <List component="nav" aria-label="employeeSelect" sx={{maxHeight: 250}}>

                            {employeeList && employeeList.map((item, index) => {
                                return (
                                    <ListItemButton
                                        selected={employeeId === item._id}
                                        onClick={(event) => handleEmployeeClick(event, item._id)}
                                        >
                                        <ListItemIcon>
                                            <PersonIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={item.fullname} />
                                    </ListItemButton>
                                )
                            })}            
                        </List>
                        </Box>
                    
                </Grid>
                
                {loading.employee === true ?(
                    <Container sx={{ display: 'flex', justifyContent: 'center'}}>
                        <CircularProgress />
                    </Container>
                ):
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    { /** Data FOR EMPLOYEES in various graph list, total, Waittime, servve_time, noshow, resorce/service average */}
                    <Stack direction={'row'}>
                        <DonutGraph data={employeeData}/>
                        { /**  */}                
                        <Stack spacing={1} alignContent={'flex-start'}>
                            { employeeData &&
                                employeeData.resources.map((item) => {
                                    return (
                                        <Card elevation={0} sx={{ maxWidth: 100}}>
                                            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                                <CalendarBlank alignmentBaseline="center" size={22} weight="thin" />
                                                <Typography gutterBottom fontWeight={'bold'} variant="subtitle2">
                                                    {findResource(item.id).title}
                                                </Typography>

                                                <Typography gutterBottom fontWeight={'normal'} variant="body2">
                                                { Math.floor(item.avg) * 100 }
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    )
                                })
                            }
                                

                            
                        </Stack>

                        { /**  */}                
                        <Stack spacing={1} alignContent={'flex-start'}>
                            { employeeData &&
                                employeeData.services.map((item) => {
                                    return (
                                        <Card elevation={0} sx={{ maxWidth: 100}}>
                                            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                                <CalendarBlank alignmentBaseline="center" size={22} weight="thin" />
                                                <Typography gutterBottom fontWeight={'bold'} variant="subtitle2">
                                                    {findService(item.id).title}
                                                </Typography>

                                                <Typography gutterBottom fontWeight={'normal'} variant="body2">
                                                { Math.floor(item.avg * 100) + "%" }
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    )
                                })
                            }
                                

                            
                        </Stack>
                    </Stack>
                    { /** Serve_time, Wait_time, No_show, Party_size */}
                    <Stack sx={{pt:2}} direction={'row'} spacing={1} justifyContent={'center'}>
                            <Card elevation={0} sx={{ maxWidth: 200}}>
                                <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                    <HourglassHigh alignmentBaseline="center" size={22} weight="thin"/>
                                    <Typography gutterBottom fontWeight={'bold'} variant="subtitle2">
                                        Wait-time avg
                                    </Typography>

                                    <Typography gutterBottom fontWeight={'normal'} variant="body2">
                                    { employeeData && Math.floor(employeeData.wait_time) + " min." }
                                    </Typography>
                                </CardContent>
                            </Card>

                        <Card elevation={0} sx={{ maxWidth: 200}}>
                                <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                    <UserSwitch size={22} weight="thin" />

                                    <Typography gutterBottom fontWeight={'bold'} variant="body1">
                                        Serve-time avg
                                    </Typography>

                                    <Typography gutterBottom fontWeight={'normal'} variant="body2">
                                        { employeeData && Math.floor(employeeData.serve_time) + " min." }
                                    </Typography>
                                </CardContent>
                            </Card>

                        <Card elevation={0} sx={{ maxWidth: 200}}>
                            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                    <UsersThree size={22} weight="thin" />
                                    <Typography gutterBottom fontWeight={'bold'} variant="body1">
                                        Party size avg
                                    </Typography>

                                    <Typography gutterBottom fontWeight={'normal'} variant="body2">
                                        { employeeData && Math.floor(employeeData.party_size)}

                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card elevation={0} sx={{ maxWidth: 200}}>
                            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                    <XCircle  size={22} weight="thin" />

                                    <Typography gutterBottom fontWeight={'bold'} variant="body1">
                                        No shows
                                    </Typography>

                                    <Typography gutterBottom fontWeight={'normal'} variant="body2">
                                        { employeeData && Math.floor(employeeData.no_show)}

                                    </Typography>
                                </CardContent>
                            </Card>
                    </Stack>
                    
                </Grid>
                }

            </Grid>
            {loading.business === true && businessData === null ? (
            <Container sx={{ display: 'flex', justifyContent: 'center'}}>
                <CircularProgress />
            </Container>
            ):(
            <>
            <Divider />
            <Grid container sx={{ pt: 1}}
                direction="row"
            >
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    { /** Business metrics as of total, Waittime, servve_time, noshow, resorce/service average  */ }
                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <Typography variant="h6" fontWeight={'bold'}>Business metrics</Typography>
                            <Typography variant="subtitle1" sx={{ pt: 1}}>In line metrics</Typography>
                            {businessData ? ( 
                            <Stack direction={'row'} spacing={0.5}>
                                <Card elevation={0} sx={{ maxWidth: 200}}>
                                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                            <CalendarBlank alignmentBaseline="center" size={22} weight="thin" />
                                            <Typography gutterBottom fontWeight={'bold'} variant="subtitle2">
                                                {'Wait time average'}
                                            </Typography>

                                            <Typography gutterBottom fontWeight={'normal'} variant="body2">
                                            { Math.ceil(businessData.wait_time) + " min" }
                                            </Typography>
                                        </CardContent>
                                    </Card>

                                    <Card elevation={0} sx={{ maxWidth: 200}}>
                                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                            <CalendarBlank alignmentBaseline="center" size={22} weight="thin" />
                                            <Typography gutterBottom fontWeight={'bold'} variant="subtitle2">
                                                {'Serve time average'}
                                            </Typography>

                                            <Typography gutterBottom fontWeight={'normal'} variant="body2">
                                            { Math.ceil(businessData.serve_time) + " min" }
                                            </Typography>
                                        </CardContent>
                                    </Card>
                            </Stack>) : null }

                            <Typography gutterBottom variant="subtitle1">Service and resource popularity <strong>average</strong></Typography>
                            {businessData ? (
                                <>
                                <Stack direction={'row'} spacing={1}>
                                {
                                    businessData.services.map((item, count) => {

                                        return (
                                            <Card elevation={0} sx={{ maxWidth: 200}}>
                                            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                                <CalendarBlank alignmentBaseline="center" size={22} weight="thin" />
                                                <Typography gutterBottom fontWeight={'bold'} variant="subtitle2">
                                                    {findService(item.id).title}
                                                </Typography>

                                                <Typography fontWeight={'normal'} variant="body2">
                                                { "Total " + item.count }
                                                </Typography>
                                                <Typography gutterBottom fontWeight={'normal'} variant="body2">
                                                { "Avg " + Math.floor(item.avg * 100) + "%" }
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                            
                                        )
                                    })
                                }
                                </Stack>
                                <Stack direction={'row'} spacing={1}>
                                {
                                    businessData.resources.map((item, count) => {

                                        return (
                                            <Card elevation={0} sx={{ maxWidth: 200}}>
                                            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                                <CalendarBlank alignmentBaseline="center" size={22} weight="thin" />
                                                <Typography gutterBottom fontWeight={'bold'} variant="subtitle2">
                                                    {findResource(item.id).title}
                                                </Typography>

                                                <Typography fontWeight={'normal'} variant="body2">
                                                { "Total " + item.count }
                                                </Typography>
                                                <Typography gutterBottom fontWeight={'normal'} variant="body2">
                                                { "Avg " + Math.floor(item.avg * 100) + "%" }
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        )
                                    })
                                }

                                </Stack>
                                </>
                            ): null}

                            <Typography variant="subtitle1">No shows</Typography>
                            {businessData ? (
                                <ProgressBar label={`No show ${businessData.no_show}`} animated striped variant="danger" now={10} />
                            ): null}
                    </Box>
                </Grid>

                <Grid item lg={6} md={6} xs={12} sm={12}>
                    { /** Ratings */}
                    <Typography variant="h6" fontWeight={'bold'}>Employee metrics</Typography>
                    <List component="nav" aria-label="employeeSelect" sx={{maxHeight: 300}}>

                            {employeeList && employeeList.map((item, index) => {
                                return (
                                    <ListItem alignItems="flex-start">
                                        
                                        <ListItemText primary={item.fullname}
                                        secondary={
                                            <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                Ratings
                                            </Typography>
                                            <Box>
                                            <Rating
                                                name="text-feedback"
                                                value={Math.floor(Math.random() * 5)}
                                                readOnly
                                                precision={0.5}
                                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                                />
                                            </Box>
                                            </React.Fragment>
                                        }
                                        />
                                    </ListItem>
                                )
                            })}            
                        </List>
                    

                </Grid>

            </Grid>
            
            <Grid container sx={{pt: 2}} id="visual_bars">
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <BarGraphApp data={businessData} />
                </Grid>

                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <BarGraphWait data={businessData} />
                </Grid>
            </Grid>
            </>
            )}
        
    </div>

        
    )
}

export default Analytics;