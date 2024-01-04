import React, { useState, useEffect} from "react";
import { Typography, IconButton, CardContent} from "@mui/material";
//import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import { StyledCardService } from "../../pages/Register/CardStyle";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';


export default function ServicesGrid (props) {

    const [services, setServices] = useState([]);
    useEffect(() => {
        setServices(props.services);
    },[props.services])

    /**
     * 
     * @param {*} index      remove service object
     */
    const removeService = (index) => {
        const up = [...services];
        up.splice(index, 1);
        props.setServices((prev) => ({
            ...prev, 
            services: up 
        }));
        console.log(services)
    }
  
    return(
        <>
        <Grid container sx={{ pt: 2}} spacing={{ xs: 3, md: 3, sm: 3, lg: 2 }} columns={{ xs: 6, sm: 4, md: 4, lg: 6 }}>


            <>
            <Grid item xs={2} sm={2} md={2} key={78}>
                <StyledCardService sx={{ backgroundColor: '#f0ebf8'}} id="service_cards">
                    <CardContent>
                        <Typography variant="subtitle1"><strong>{"Mens haircut"}</strong></Typography>
                            <Typography variant="body2">Duration:
                                <Typography fontSize={12} variant="body2">{"45 min"}</Typography>
                            </Typography>
                        
                            <IconButton disabled={true}>
                                <CloseRoundedIcon/>
                            </IconButton>
                    </CardContent>
                </StyledCardService>
            </Grid>
            </>
            {

                
                services.map((item, index) => {
                    if (item.title === "default"){
                        return null;
                    }
                    return (
                        <Grid item xs={2} sm={2} md={2} key={index}>
                            <StyledCardService id="service_cards">
                                <CardContent>
                                    <Typography variant="subtitle1"><strong>{item.title}</strong></Typography>
                                        <Typography variant="body2">Duration:
                                            <Typography fontSize={12} variant="body2">{item.duration}</Typography>
                                        </Typography>
                                    
                                        <IconButton onClick={ () => removeService(index)}>
                                            <CloseRoundedIcon/>
                                        </IconButton>
                                </CardContent>
                            </StyledCardService>
                        </Grid>
                    )
                })
            }
        </Grid>
        
        </>
    )
}