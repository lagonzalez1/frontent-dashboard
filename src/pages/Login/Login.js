import React, { useState, useContext, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Avatar, Typography ,Button, TextField, FormControlLabel, Checkbox, Link, Paper, Box, Grid, Container, Alert } from "@mui/material";
import { useNavigate  } from "react-router-dom";
import { useSignIn } from "react-auth-kit";

export default function Login(props) {
    const navigate = useNavigate();
    const signIn = useSignIn();

    const [error, setErrors] = useState(false);
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    })

    useEffect(() => {
        removeNavbar();
    }, [])

    /**
     * Fade navabar for Register and Login pages.
     */
    const removeNavbar = () => {
        props.setHide(true);
    }

    async function loginRequest(data) {
        const response = await axios.post('/api/external/login', data)
        return response;
    }

	const handleSubmit = () => {
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
                    })
                    navigate('/Dashboard');
                    return;
                }else {
                    setErrors('Status: ' + response.status + 'Unable to proccess request at the moment.');
                    return;
                }
            })
            .catch(error => {
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

                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={ () => handleSubmit() }
                >
                    Sign In
                </Button>
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
