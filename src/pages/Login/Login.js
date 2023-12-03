import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Avatar, Typography ,Button, TextField, Link, Box, Grid, Container, Alert, ToggleButtonGroup, ToggleButton, Tooltip, IconButton, Collapse, Paper} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useNavigate  } from "react-router-dom";
import { useSignIn } from "react-auth-kit";
import { setAccessToken } from "../../auth/Auth";
import BadgeIcon from '@mui/icons-material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { useSelector, useDispatch } from 'react-redux';
import { setLocation, setPermisisons, setUser } from '../../reducers/user';
import { DateTime } from "luxon";
import loginImage from "../../assets/images/login.jpg"


export default function Login() {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const signIn = useSignIn();
    
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);
    const [error, setErrors] = useState(false);
    const [isRoot, setIsRoot] = useState('root');

    const [employeeCred,setEmployeeCred] = useState({
        employeeUsername: '',
        employeePassword: '',
    })

    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    })

    useEffect(() => {
        console.log("LOGIN")
    }, [])


    const handleEmployeeLogin = () => {
        setLoading(true);
        if (employeeCred.employeeUsername && employeeCred.employeeUsername) {
            const data = { employeeUsername: employeeCred.employeeUsername, employeePassword: employeeCred.employeePassword }
            employeeLoginRequest(data)
            .then(response => {
                console.log(response);
                if (response.status === 200){
                    signIn({
                        token: response.data.token,
                        expiresIn: response.data.expiration,
                        tokenType: "Bearer",
                        authState: { id: response.data.id },
                    });
                    setAccessToken(response.data.accessToken);
                    dispatch(setUser({ id: response.data.id, email: response.data.email, permissions: response.data.permissions}));
                    navigate('/Dashboard');
                    setLoading(false);
                    return;
                }
                setErrors(response.data.msg);
                setLoading(false);
            })
            .catch(error => {
                setErrors(error.response.data.msg)
                setAlert(true);
            }) 
            .finally(() => {
                setLoading(false);
            })
        }else {
            setErrors('Missing employee username and password.');
            setLoading(false);
            setAlert(true);
            return;
        }
        
    }

    async function employeeLoginRequest(data) {
        const response = await axios.post('/api/external/employeeLogin', data)
        return response;
    }

    async function loginRequest(data) {
        const response = await axios.post('/api/external/login', data)
        return response;
    }

	const handleSubmit = () => {
        setLoading(true);
        if ( credentials.email && credentials.password ){
            const data = { email: credentials.email, password: credentials.password };
            loginRequest(data)
            .then(response => {
                if (response.status === 200){
                    signIn({
                        token: response.data.token,
                        expiresIn: response.data.expiration,
                        tokenType: "Bearer",
                        authState: { id: response.data.id },
                    });
                    
                    setAccessToken(response.data.accessToken);
                    dispatch(setUser({ id: response.data.id, email: response.data.email, permissions: response.data.permissions}));
                    // Set business ref ?
                    navigate('/Dashboard');
                    setLoading(false);
                    return;
                }
                setErrors(response.data.msg);
                setAlert(true);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                setErrors(error.response.data.msg);
                setAlert(true);

            })
        }
        else {
            setLoading(false);
            setErrors('Error: Empty fields found.');
            setAlert(true);

            return;
        }
	}

    const handleLoginChange = (event, type) => {
        setIsRoot(type);
      };

	return(
        <>
            <Container sx={{ pt: 1, p: 2, mt:0, mb:0, height: '100%', width: '100%'}}>
                    
            
            { isRoot === "root" ? 
                (
                <Box
                    sx={{
                    pt: 1,
                    my: 8,
                    mx: 4,
                    pb: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    }}
                >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Typography component="subtitle2" variant="caption">
                    (Root user)
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                <Collapse in={alert}>
                        <Alert
                        severity="error"
                        action={
                            <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setAlert(false);
                                setErrors(null);
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        >
                        {error}
                        </Alert>
                    </Collapse>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    value={credentials.email}
                    onChange={e => setCredentials((prev) => ({ ...prev, email: e.target.value}))}
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    id="password"
                    value={credentials.password}
                    onChange={e => setCredentials((prev) => ({ ...prev, password: e.target.value}))}
                    autoComplete="current-password"
                />
                { loading ? (<LoadingButton
                                fullWidth
                                loading={loading}
                                variant="outlined"
                                disabled
                                sx={{ mt: 3, mb: 2, borderRadius: 15 }}
                                > Sign In</LoadingButton>): 
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2, borderRadius: 15 }}
                    onClick={ () => handleSubmit() }
                >
                    Sign In
                </Button>
                }
                <Grid container>
                    <Grid item xs>
                    <Link href="#" variant="caption">
                        Forgot password?
                    </Link>
                    </Grid>
                    <Grid item xs>
                        <Link href="/Register" variant="caption">
                            {"Don't have an account? Register now!"}
                        </Link>
                    </Grid>
                </Grid>
                <Typography pt={2} variant="caption" color="text.secondary" align="center">
                    {'Copyright © '}
                    <Link color="inherit" href="/">
                        waitonline.us
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                    </Typography>
                </Box>
                </Box>
                ): 
                (
                <Box
                sx={{
                pt: 1,
                pb: 1,
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
                >
                <Avatar sx={{ m: 1, bgcolor: 'secondary' }}>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Typography component="subtitle2" variant="caption">
                    (Employee)
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                <Collapse in={alert}>
                        <Alert
                        action={
                            <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setAlert(false);
                                setErrors(null);
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        >
                        {error}
                        </Alert>
                    </Collapse>

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="Username"
                    label="Username"
                    autoComplete="username"
                    value={employeeCred.employeeUsername}
                    onChange={e => setEmployeeCred((prev) => ({ ...prev, employeeUsername: e.target.value}))}
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    id="employeePassword"
                    value={employeeCred.employeePassword}
                    onChange={e => setEmployeeCred((prev) => ({ ...prev, employeePassword: e.target.value}))}
                    autoComplete="current-password"
                />
                { loading ? (<LoadingButton
                                fullWidth
                                loading={loading}
                                variant="outlined"
                                disabled
                                sx={{ mt: 3, mb: 2, borderRadius: 15 }}
                                > Sign In</LoadingButton>): 
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2, borderRadius: 15, textAlign: 'center' }}
                    onClick={ () => handleEmployeeLogin() }
                >
                    Sign In
                </Button>
                }
                <Grid container>
                    <Grid item xs>
                    <Link href="#" variant="caption">
                        Forgot password?
                    </Link>
                    </Grid>
                    <Grid item xs>
                        <Link href="/Register" variant="caption">
                            {"Don't have an account? Register now!"}
                        </Link>
                    </Grid>
                </Grid>
                <Typography pt={2} variant="caption" color="text.secondary" align="center">
                    {'Copyright © '}
                    <Link color="inherit" href="/">
                        waitonline.us
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                    </Typography>
                </Box>
                    </Box> 
                    )
                    }

                    <Container sx={{  display: 'flex', justifyContent: 'center'}}>
                        <ToggleButtonGroup
                        value={isRoot}
                        exclusive
                        onChange={handleLoginChange}
                        >
                        <ToggleButton value="root">
                            <Tooltip placement="left" title="Root user login.">
                                <PersonIcon />
                            </Tooltip>
                        </ToggleButton>

                        <ToggleButton value="employee">
                            <Tooltip placement="right" title="If you are an employee click here.">
                                <BadgeIcon />
                            </Tooltip>
                        </ToggleButton>
                        </ToggleButtonGroup>
                    </Container>
            </Container>

        </>
	)
}
