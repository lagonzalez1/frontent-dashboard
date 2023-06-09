import React, { useState, useEffect } from "react";

export default function Homepage(props) {

    useEffect(() => {
        showNavbar();
    }, []);

    const showNavbar = () => {
        props.setHide(false);
    }
    
    
    return (
        <>
            
        </>
    )
}