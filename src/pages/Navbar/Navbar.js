import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

    return (
        <>
            <N collapseOnSelect expand="lg" bg="light" variant="light" id="app_bar" fixed="top">
                <Container>
                    <N.Brand href="/"><RocketTwoToneIcon /> <strong>Logo</strong></N.Brand>
                    <N.Toggle aria-controls="responsive-navbar-nav" />
                    <N.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => navigate('/Products')}>Features</Nav.Link>
                        <Nav.Link onClick={() => navigate('/Pricing')}>Pricing</Nav.Link>
                        <Nav.Link onClick={() => navigate('/Resources')}>Resources</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={() => navigate('/Login')}><strong>Login</strong></Nav.Link>
                        <Nav.Link eventKey={2} onClick={() => navigate('/Register')}> <strong>Register</strong></Nav.Link>
                    </Nav>
                    </N.Collapse>
                </Container>
            </N>

        </>
    )
}
