import React, { useState, useEffect } from "react";
import { Container, Box, Button, Grid, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Stack, Typography, Rating, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { getEmployeeList } from "../../hooks/hooks";
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import ProgressBar from 'react-bootstrap/ProgressBar';
import DonutGraph from "../../components/Vizual/DonutGraph";
import axios from "axios";
import { getEmployeeAnalytics, getEmployeeAnalyticsRange } from "./AnalyticsHelper";
import { DateTime } from "luxon";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CachedIcon from '@mui/icons-material/Cached';
import AlertMessageGeneral from "../../components/AlertMessage/AlertMessageGeneral";



const Analytics = () => {


    const business = useSelector((state) => state.business);
    const employeeList = getEmployeeList();
    const [range, setRange] = useState({ start: DateTime.local().setZone(business.timezone), end: DateTime.local().setZone(business.timezone)});

    const [mock, setMock] = useState({
        waittime: 90,
        serve_time: 60
    })


    const [employeeId, setEmployeeSelect] = useState('');
    const [employeeData, setEmployeeData] = useState();
    const [error, setError] = useState(false);
    const [alert, setAlert] = useState({title: null, body: null})


    const handleEmployeeClick = (event, index) => {
        setEmployeeSelect(index);

        setMock({waittime: Math.random(100), serve_time: Math.random(100)})
    };


    useEffect(() => {
        getEmployeeData();
    }, [employeeId])



    const getEmployeeData = () => {
        if (employeeId === "") {
            return;
        }
        console.log("Called");
        getEmployeeAnalytics(employeeId)
        .then(response => {
            setEmployeeData(response);
        })
        .catch(error => {
            console.log(error);
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
        const payload = { eid: employeeId, type: 'AVERAGE', start: range.start.toISO(), end: range.end.toISO()}
        getEmployeeAnalyticsRange(payload)
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
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
                <Stack direction={'row'} spacing={1} alignItems={'center'}>

                    <DatePicker label="From" value={range.start} onChange={(newValue) => setRange((prev) => ({...prev, start: newValue}))} />
                    <Typography variant="body2" fontWeight={'bold'}> {'-'} </Typography>
                    <DatePicker label="To" value={range.end} onChange={(newValue) => setRange((prev) => ({...prev, end: newValue}))}/>
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
                    <List component="nav" aria-label="employeeSelect" sx={{maxHeight: 300}}>

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

            <Grid item lg={6} md={6} xs={12} sm={12}>
                { /** Data FOR EMPLOYEES in various graph list, total, Waittime, servve_time, noshow, resorce/service average */}
                <DonutGraph employeeData={employeeData}/>

                

            </Grid>

        </Grid>

        <Grid container sx={{ pt: 1}}
            direction="row"
           >
            <Grid item lg={6} md={6} xs={12} sm={12}>
                { /** Business metrics as of total, Waittime, servve_time, noshow, resorce/service average  */ }
                {
                    /**
                     * 
                     * 
                     * 
                     */
                }
                <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    <Typography variant="subtitlel" fontWeight={'bold'}>Business metrics</Typography>
                        <Typography variant="subtitle1" sx={{ pt: 1}}>In line metrics</Typography>
                        <ProgressBar>
                            <ProgressBar max={mock.serve_time + mock.waittime} animated striped label={`Serve time ${mock.serve_time}`} variant="success" now={mock.serve_time} key={1} />
                            <ProgressBar max={mock.serve_time + mock.waittime} animated striped variant="danger" label={`Wait time ${mock.waittime}`} now={mock.waittime} key={2} />
                        </ProgressBar>
                        <Typography variant="subtitle1">Service and resource popularity</Typography>
                        <Stack spacing={0.5}>
                        <ProgressBar label={'Men haircut 40'} animated striped variant="success" now={40} />
                            <ProgressBar label={'Women haircut 20'}  animated striped variant="danger" now={20} />
                            <ProgressBar label={'Kids haircut 60'} animated striped variant="warning" now={60} />
                            <ProgressBar label={'Lashes haircut 80'} animated striped variant="info" now={80} />
                        </Stack>
                        <Typography variant="subtitle1">No shows</Typography>
                        <ProgressBar label={'No shows 11'} animated striped variant="danger" now={11} />

                </Box>
            </Grid>

            <Grid item lg={6} md={6} xs={12} sm={12}>
                { /** Ratings */}
                <Typography variant="subtitlel" fontWeight={'bold'}>Employee metrics</Typography>
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
    </div>

        
    )
}

export default Analytics;