import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Avatar, Typography ,Button, TextField, Link, Box, Grid, Container, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useNavigate  } from "react-router-dom";
import { useSignIn } from "react-auth-kit";
import { setAccessToken } from "../../auth/Auth";

import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../reducers/user';

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
    }, [])

    async function loginRequest(data) {
        const response = await axios.post('/api/external/login', data)
        return response;
    }

	const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if ( credentials.email && credentials.password ){
            const data = { email: credentials.email, password: credentials.password };
            loginRequest(data)
            .then(response => {
                if (response.status === 200){
                    console.log(response.data);
                    signIn({
                        token: response.data.token,
                        expiresIn: response.data.expiration,
                        tokenType: "Bearer",
                        authState: { id: response.data.id },
                    });
                    
                    console.log(response.data.accessToken)
                    setAccessToken(response.data.accessToken);
                    dispatch(setUser({ id: response.data.id, email: response.data.email}))
                    navigate('/Dashboard');
                    setLoading(false);
                    return;
                }else {
                    setErrors('Status: ' + response.status + 'Unable to proccess request at the moment.');
                    setLoading(false);
                    return;
                }
                
            })
            .catch(error => {
                setLoading(false);
                if (error && error instanceof AxiosError){
                    setErrors('Axios: ' + error);
                    return;
                }else if (error && error instanceof Error){
                    setErrors('Error: ' + error);
                    return;
                }
                setErrors('Error: ' + error);
                return;
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
                                sx={{ mt: 3, mb: 2 }}
                                > Sign In</LoadingButton>): 
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={ (e) => handleSubmit(e) }
                >
                    Sign In
                </Button>
                }
                <Grid container>
                    <Grid item xs>
                    <Link href="#" variant="body2">
                        Forgot password?
                    </Link>
                    </Grid>
                    <Grid item xs>
                        <Link href="/Register" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
                <Typography pt={2} variant="body2" color="text.secondary" align="center">
                    {'Copyright © '}
                    <Link color="inherit" href="/Home">
                        Your Website
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                    </Typography>
                </Box>
            </Box>
            </Container>

        </>
	)
}
