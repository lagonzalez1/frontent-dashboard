import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {Container, Nav, Navbar as N, NavDropdown} from 'react-bootstrap';

import './Navbar.css';
import RocketTwoToneIcon from '@mui/icons-material/RocketTwoTone';

export default function Navbar(props) {

    const navigate = useNavigate();

     useEffect(() => {
        if(props.hide === true) {
            const ref = document.getElementById('app_bar');
            ref.classList.add('fade-out-up');
            setTimeout(() => {
                ref.style.display = 'none';
            }, 200)
        }
     }, [props])


    const requestToBackend = () => {
        axios.get('/api/external/data')
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <>
            <N collapseOnSelect expand="lg" bg="light" variant="light" id="app_bar" fixed="top">
                <Container>
                        <Typography fontWeight='bold'>
                        <RocketTwoToneIcon />
                            Schedule
                        </Typography>
                    
                    <N.Toggle aria-controls="responsive-navbar-nav" />
                    <N.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => requestToBackend()}>
                            <Typography>
                                Features
                            </Typography>

                        </Nav.Link>
                        <Nav.Link onClick={() => navigate('/Pricing')}>
                            <Typography>
                                Pricing
                            </Typography>
                        </Nav.Link>
                        <Nav.Link onClick={() => navigate('/Resources')}>
                            <Typography>
                                Resources
                            </Typography>
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={() => navigate('/Login')}>
                            <Typography>
                                Login
                            </Typography>
                        </Nav.Link>
                        <Nav.Link eventKey={2} onClick={() => navigate('/Register')}> 
                            <Typography>
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
