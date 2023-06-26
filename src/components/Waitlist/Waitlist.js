import React from "react";
import { Container, Box, Stack, Typography, Button, Grid } from "@mui/material";


export default function Waitlist () {
    return (
        <>

            <div id="UpperBar">
                <Grid container
                    spacing={2}
                    
                >
                    <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                        <Stack>
                            <Typography variant="body2">Buisness name</Typography>
                            <Typography variant="h5"><strong>Waitlist</strong></Typography>
                        </Stack>
                        
                    </Grid>
                    <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'right'}}>
                        { /** I can use a react-menu */}
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        Open
                        </button>
                        <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Remove and close</a></li>
                        <li><a class="dropdown-item" href="#">Go to check-in</a></li>
                        </ul>
                    </div>
                    </Grid>
                </Grid>





            </div>
        
        </>
    )
}