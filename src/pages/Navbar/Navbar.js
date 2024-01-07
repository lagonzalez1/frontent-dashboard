import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {Container, Nav, Navbar as N, NavDropdown} from 'react-bootstrap';
import './Navbar.css';
import { BellSimpleRinging } from "phosphor-react"
import { useTheme } from '@mui/system';

export default function Navbar(props) {

    const navigate = useNavigate();
    const theme = useTheme();

     useEffect(() => {
        if(props.hide === true) {
            const ref = document.getElementById('app_bar');
            ref.classList.add('fade-out-up');
            setTimeout(() => {
                ref.style.display = 'none';
            }, 200)
        }
     }, [props])


    return (
        <>
            <N collapseOnSelect expand="lg" bg="light" variant="light" id="app_bar" fixed="top">
                <Container>

                        <Stack direction={'row'} spacing={1}>
                        <BellSimpleRinging size={20} weight="duotone" />
                        <Nav.Link onClick={() => navigate('/')}>
                            <Typography fontWeight='bolder' color={theme.palette.primary.main}>
                                Waitonline
                            </Typography>
                        </Nav.Link>
                        </Stack>
                        
                    
                    <N.Toggle aria-controls="responsive-navbar-nav" />
                    <N.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => navigate('/Features')}>
                            <Typography fontWeight={'bold'}>
                                Features
                            </Typography>

                        </Nav.Link>
                        <Nav.Link onClick={() => navigate('/Pricing')}>
                            <Typography  fontWeight={'bold'}>
                                Pricing
                            </Typography>
                        </Nav.Link>
                        <Nav.Link onClick={() => navigate('/Resources')}>
                            <Typography  fontWeight={'bold'}>
                                Resources
                            </Typography>
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={() => navigate('/Login')}>
                            <Typography  fontWeight={'bold'}>
                                Login
                            </Typography>
                        </Nav.Link>
                        <Nav.Link eventKey={2} onClick={() => navigate('/Register')}> 
                            <Typography  fontWeight={'bold'}>
                                Register
                            </Typography>
                        </Nav.Link>
                    </Nav>
                    </N.Collapse>
                </Container>
            </N>

        </>
    )
}
