import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Avatar, Typography ,Button, TextField, Link, Box, Grid, Container, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useNavigate  } from "react-router-dom";
import { useSignIn } from "react-auth-kit";
import { setAccessToken } from "../../auth/Auth";

import { useSelector, useDispatch } from 'react-redux';
import { setLocation, setPermisisons, setUser } from '../../reducers/user';
import { DateTime } from "luxon";


export default function Login() {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const signIn = useSignIn();
    
    const [loading, setLoading] = useState(false);
    const [error, setErrors] = useState(false);
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    })

    useEffect(() => {
        console.log("LOGIN")
    }, [])

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
                    // Set business ref ?
                    navigate('/Dashboard');
                    setLoading(false);
                    return;
                }
                setErrors(response.data.msg);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                setErrors(error.response.data.msg);
            })
        }
        else {
            setLoading(false);
            setErrors('Error: Empty fields found.');
            return;
        }
	}

	return(
        <>
            <Container sx={{ pt: 1, p: 2}}>
                <Grid container>
                    <Grid item>
                        
                    </Grid>
                    <Grid item>
                    <Box
                sx={{
                my: 8,
                mx: 4,
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
                    {error ? (<Alert severity="error">{error}</Alert>): null}
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
                    </Grid>
                </Grid>
            </Container>

        </>
	)
}
