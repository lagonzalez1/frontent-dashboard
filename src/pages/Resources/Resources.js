import React, { useState, useEffect } from "react";
import { ThemeProvider, Container } from "@mui/material";
import { HomePageTheme } from "../../theme/theme";
import Footer from "../Footer/Footer.js";
import Navbar from '../Navbar/Navbar';

export default function Resources() {

    const [mode, setMode] = useState(0);
   
    
    return (
        <ThemeProvider theme={HomePageTheme}>
            <Navbar />
                <Container>

                </Container>
            <Footer />
        </ThemeProvider>
    )
}