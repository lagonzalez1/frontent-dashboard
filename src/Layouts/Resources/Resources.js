import React from "react";
import { Grid, Typography, Stack,CardContent,Avatar, Container } from '@mui/material';
import { getResourcesAvailable, StyledCardService, stringAvatar } from "./ResourcesHelper"; 

import AddResource from "../../components/AddResource/AddResource.js";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function Resources() {
    const styles = {
        container: {
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
        },
      };

    return(
        <>
        <Grid container
            spacing={2}    
        >
            <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'left'}}>
                <Stack direction={'row'} sx={{alignItems: 'center'}} spacing={2}>
                    <Typography variant="h6"><strong> Available resources</strong></Typography>
                    <Typography variant="caption"> <FiberManualRecordIcon fontSize="xs" htmlColor="#00FF00"/> 4 Active</Typography>
                    <Typography variant="caption"> <FiberManualRecordIcon fontSize="xs" htmlColor="#FF0000"/> 0 Unavailable</Typography>
                </Stack>
                
            </Grid>
            <Grid item xs={6} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'right'}}>
            
            </Grid>
        </Grid>

        
        <Grid container style={styles.container} sx={{ pt: 2}} spacing={{ xs: 3, md: 3, sm: 3, lg: 2 }} columns={{ xs: 6, sm: 4, md: 4, lg: 4 }}>
            {getResourcesAvailable().map((resource) => (
                <Grid item key={resource.id}>
                    <StyledCardService>
                        <CardContent>
                            <Stack direction="row" spacing={2}>
                            <Avatar {...stringAvatar(resource.title)} />
                            <Container>    
                            <Typography variant="subtitle1" component="p" style={{ fontWeight: 'bold' }}>
                            {resource.active ? (<FiberManualRecordIcon fontSize="xs" htmlColor="#00FF00"/>):
                             (<FiberManualRecordIcon fontSize="xs" htmlColor="#FF0000"/>)}
                                { ' ' + resource.title}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                
                                <Typography variant="caption" component="p">
                                    Waitlist: {resource.waitlist ? 1 : 0}
                                </Typography>
                                <Typography variant="caption" component="p">
                                    Serving: {resource.serveSize}
                                </Typography>
                            </Stack>
                            </Container>
                            </Stack>    
                        </CardContent>    
                    </StyledCardService>
                
                </Grid>
            ))}
        </Grid>

        <AddResource />

        </>
    )
}