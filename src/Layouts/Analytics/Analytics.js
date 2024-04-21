import React, { useState, useEffect } from "react";
import { Container, Box, Button, Grid, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Stack, Typography, Rating, IconButton, Select, MenuItem, Card, CardContent, CircularProgress, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { findEmployee, findResource, findService, getEmployeeList } from "../../hooks/hooks";
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
import { Package, HourglassHigh, UserSwitch , UsersThree, XCircle, Database, FireSimple, Drop,Waves , Campfire , FlowerLotus, Tree, Coffee  } from "phosphor-react"; 
import Collapse from '@mui/material/Collapse';



const Analytics = () => {

    const iconsList = [<Package alignmentBaseline="center" size={22}/>,<FireSimple alignmentBaseline="center" size={22}/>, <Drop alignmentBaseline="center" size={22}/>,
     <Waves  alignmentBaseline="center" size={22}/>, <Campfire  alignmentBaseline="center" size={22}/>, <FlowerLotus  alignmentBaseline="center" size={22}/>, <Tree alignmentBaseline="center" size={22}/>,
     <Coffee alignmentBaseline="center" size={22}/>  ]
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

    const [loading, setLoading] = useState(false);

    const [loadBusiness, setLoadBusiness] = useState(false);
    const [businessLoader, setBusinessLoader] = useState(false);



    const [error, setError] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [alert, setAlert] = useState({title: null, body: null})


    const handleEmployeeClick = (event, index) => {
        setEmployeeSelect(index);

        setMock({waittime: Math.random(100), serve_time: Math.random(100)})
    };


    useEffect(() => {
        getEmployeeData();
    }, [employeeId])

    useEffect(() => {
        setBusinessLoader(true);
        getBusinessData();
        return () => {
            setLoadBusiness(false)
        }
    }, [loadBusiness])

    const getBusinessData = () => {
        getBusinessAnalytics()
        .then(response => {
            setBusinessData(response)
        })
        .catch(error => {
            setOpenError(true)
            setError(true);
            setAlert({title: error.response.data.msg})
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
        getEmployeeAnalytics(employeeId)
        .then(response => {
            console.log(response)
            setEmployeeData(response);
        })
        .catch(error => {
            setOpenError(true)
            setError(true)
            setAlert({title: error.response.data.msg})
        })
        .finally(() => {
            setLoading(false)
        })
        
    }

    const reloadAnalyticsData = () => {
        console.log(range)
        if (employeeId === ""){
            setOpenError(true)
            setError(true);
            setAlert({title: 'Error', body:'No employee has been selected', open: true});
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
        getEmployeeAnalyticsRange(payload)
        .then(response => {
            setEmployeeData(response)
        })
        .catch(error => {
            setOpenError(true)
            setError(true)
            setAlert({title: error.response.data.msg})
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

        
        
            <Grid container sx={{ pt: 1, width: '100%'}} 
                direction="row"
                
                >
                <Grid item lg={5} md={5} xs={12} sm={12}>
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
                
                {loading === true ?(
                    <Grid item sx={{display:'flex', justifyContent: 'center', alignItems: 'center'}} lg={6} md={6} xs={12} sm={12}>
                        <CircularProgress size={15} />
                    </Grid>
                ):
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    { /** Data FOR EMPLOYEES in various graph list, total, Waittime, servve_time, noshow, resorce/service average */}
                    {employeeData === null ? (
                            <Box sx={{ display: 'flex', pt: 4, justifyContent: 'center', alignItems: 'center'}}>
                                <Typography  variant="substitle2" fontWeight={'light'}>No data</Typography>
                                <Database size={27} />
                            </Box>
                        ): 
                        <DonutGraph data={employeeData}/>
                        }
                    { /** Serve_time, Wait_time, No_show, Party_size */}
                        { /**  */}                
                        <Stack sx={{pt:2, overflowX: 'auto'}} direction={'row'} spacing={1} justifyContent={'center'}>

                        { employeeData &&
                                employeeData.resources.map((item) => {
                                    const len = employeeData.resources.length;
                                    const randomIndex = Math.floor(Math.random() * len)
                                    return (
                                        <Card elevation={0} sx={{ maxWidth: 100}}>
                                            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                                {iconsList[randomIndex]}
                                                <Typography gutterBottom fontWeight={'bold'} textAlign={'center'} variant="subtitle2">
                                                    { findResource(item.id).title }
                                                </Typography>

                                                <Typography gutterBottom  variant="subtitle2">
                                                { Math.floor(item.avg * 100) + "%" }
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    )
                                })
                            }
                            <Divider orientation="vertical" />
                            { employeeData &&
                                employeeData.services.map((item) => {
                                    const len = employeeData.services.length;
                                    const randomIndex = Math.floor(Math.random() * len)
                                    return (
                                        <Card elevation={0} sx={{ maxWidth: 100}}>
                                            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                                { iconsList[randomIndex]}
                                                <Typography gutterBottom fontWeight={'bold'} textAlign={'center'} variant="subtitle2">
                                                    {findService(item.id).title }
                                                </Typography>

                                                <Typography gutterBottom variant="subtitle2">
                                                { Math.floor(item.avg * 100) + "%" }
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    )
                                })
                            }


                            
                        </Stack>

                    {
                        employeeData ? (
                        <Stack sx={{pt:0}} direction={'row'} spacing={1} justifyContent={'center'}>
                            <Card elevation={0} sx={{ maxWidth: 200}}>
                                <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                    <HourglassHigh alignmentBaseline="center" size={22} />
                                    <Typography gutterBottom fontWeight={'bold'} variant="subtitle2">
                                        Wait-time avg
                                    </Typography>

                                    <Typography gutterBottom variant="subtitle2">
                                    { employeeData && Math.floor(employeeData.wait_time) + " min." }
                                    </Typography>
                                </CardContent>
                            </Card>

                        <Card elevation={0} sx={{ maxWidth: 200}}>
                                <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                    <UserSwitch size={22}  />

                                    <Typography gutterBottom fontWeight={'bold'} variant="subtitle2">
                                        Serve-time avg
                                    </Typography>

                                    <Typography gutterBottom fontWeight={'normal'} variant="subtitle2">
                                        { employeeData && Math.floor(employeeData.serve_time) + " min" }
                                    </Typography>
                                </CardContent>
                            </Card>

                        <Card elevation={0} sx={{ maxWidth: 200}}>
                            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                    <UsersThree size={22}  />
                                    <Typography gutterBottom fontWeight={'bold'} variant="subtitle2">
                                        Party size avg
                                    </Typography>

                                    <Typography gutterBottom fontWeight={'normal'} variant="subtitle2">
                                        { employeeData && Math.floor(employeeData.party_size)}

                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card elevation={0} sx={{ maxWidth: 200}}>
                            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                    <XCircle  size={22}  />

                                    <Typography gutterBottom fontWeight={'bold'} variant="subtitle2">
                                        No shows
                                    </Typography>

                                    <Typography gutterBottom fontWeight={'normal'} variant="subtitle2">
                                        { employeeData && Math.floor(employeeData.no_show)}

                                    </Typography>
                                </CardContent>
                            </Card>
                        </Stack>
                        ):null
                    }   
                </Grid>
                }
            </Grid>
            { /** END OF EMPLOYEES Serve_time, Wait_time, No_show, Party_size */}
            <Divider />
            {businessLoader === true ? (
            <Grid container sx={{ display: 'flex', justifyContent: 'center'}}>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box>
                        <CircularProgress size={15} />
                    </Box>
                </Grid>

                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box>
                        <CircularProgress size={15} />
                    </Box>
                </Grid>
            </Grid>
            ):(
            <>
            {/** BUSINESS metrics below */}
            <Grid container sx={{ pt: 1}}
                direction="row"
            >
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    { /** Business metrics as of total, Waittime, servve_time, noshow, resorce/service average  */ }
                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <Typography variant="h6" fontWeight={'bold'}>Business metrics</Typography>
                            <Typography variant="subtitle1" sx={{ pt: 1}}>In line metrics</Typography>
                            {businessData ? ( 
                            <Stack direction={'row'} spacing={0.5} justifyContent={'center'} divider={<Divider orientation="vertical" flexItem />}>
                                <Card elevation={0} sx={{ maxWidth: 200}}>
                                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                            <HourglassHigh alignmentBaseline="center" size={22}  />
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
                                            <UserSwitch alignmentBaseline="center" size={22}  />
                                            <Typography gutterBottom fontWeight={'bold'} variant="subtitle2">
                                                {'Serve time average'}
                                            </Typography>

                                            <Typography gutterBottom fontWeight={'normal'} variant="body2">
                                            { Math.ceil(businessData.serve_time) + " min" }
                                            </Typography>
                                        </CardContent>
                                    </Card>

                                    <Card elevation={0} sx={{ maxWidth: 200}}>
                                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                            <UserSwitch alignmentBaseline="center" size={22}  />
                                            <Typography gutterBottom fontWeight={'bold'} variant="subtitle2">
                                                {'Party size average'}
                                            </Typography>

                                            <Typography gutterBottom fontWeight={'normal'} variant="body2">
                                            { Math.ceil(businessData.serve_time) + " min" }
                                            </Typography>
                                        </CardContent>
                                    </Card>

                            </Stack>) : null }

                            <Typography gutterBottom variant="subtitle1">Service and resource popularity</Typography>
                            {businessData ? (
                                <>
                                <Stack sx={{ flexWrap: 'wrap', overflowX: 'auto'}} direction={'row'} spacing={1} divider={<Divider orientation="vertical" flexItem />}
                                    justifyContent={'center'}>
                                {   
                                    businessData.services.map((item, count) => {
                                        const len = businessData.services.length;
                                        const randomIndex = Math.floor(Math.random() * len);
                                        return (
                                            <Card elevation={0} sx={{ maxWidth: 200}}>
                                            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                                {iconsList[randomIndex]}
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
                                <Stack sx={{ overflowX: 'auto', flexWrap: 'wrap'}} direction={'row'} spacing={1} divider={<Divider orientation="vertical" flexItem />}
                                    justifyContent={'center'}>
                                {   
                                    businessData.resources.map((item, count) => {

                                        return (
                                            <Card elevation={0} sx={{ maxWidth: 200}}>
                                            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                                <Package alignmentBaseline="center" size={22}  />
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
                                <Stack direction={'row'} spacing={1} divider={<Divider orientation="vertical" flexItem />}
                                justifyContent={'center'}>
                                <Card elevation={0} sx={{ maxWidth: 200}}>
                                    <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                        <XCircle alignmentBaseline="center" size={22}  />
                                        <Typography gutterBottom fontWeight={'bold'} variant="subtitle2">
                                            {"No shows"}
                                        </Typography>

                                        <Typography fontWeight={'normal'} variant="body2">
                                        { "Total " + businessData.no_show }
                                        </Typography>
                                        
                                    </CardContent>
                                </Card>
                                </Stack>
                            ): null}
                    </Box>
                </Grid>

                <Grid item lg={6} md={6} xs={12} sm={12}>
                    { /** Ratings */}
                    <Typography variant="h6" fontWeight={'bold'}>Employee Ratings</Typography>
                    <List sx={{overflow: 'auto', maxHeight: 300}} component="nav" aria-label="employeeSelect">

                            {businessData && businessData.employeeRatings.map((item, index) => {
                                const id = item.id;
                                const popularity = Math.ceil(item.popularity);
                                const employee = findEmployee(id);
                                const rating = Math.ceil(item.data);
                                const count = item.count;
                                return (
                                    <ListItem alignItems="flex-start">
                                        
                                        <ListItemText primary={employee.fullname}
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

            </Grid>
            
            { businessLoader === true  ? (
                <Grid container sx={{pt: 2}} id="visual_bars">
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <CircularProgress size={15} />
                </Grid>

                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <CircularProgress size={15} />
                </Grid>
            </Grid>
            ):
            <Grid container sx={{pt: 2}} id="visual_bars">
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <BarGraphApp data={businessData} />
                </Grid>

                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <BarGraphWait data={businessData} />
                </Grid>
            </Grid>
            }
            </>
            )}
        
    </div>

        
    )
}

export default Analytics;