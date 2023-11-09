import React, { useState, useEffect } from "react";
import { Container, Button, Typography, Box, Stack, CircularProgress, Card, CardActions, CardContent } from "@mui/material";
import "../../css/LandingPage.css";
import PunchClockTwoToneIcon from "@mui/icons-material/PunchClockTwoTone"
import { APPOINTMENT_REMOVE, WAITLIST_REMOVE, APPOINTMENT, WAITLIST } from "../../static/static";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {

    const { link, type } = useParams();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {

        return () => {
            setLoading(false);
        }
    }, [])


    const ShowLandingStatus = ({type}) => {
        if (type === "" || type === undefined || type ===  null) {
            return (
                <Box>
                    <Typography variant="h5" fontWeight='bold'>
                            {APPOINTMENT_REMOVE['title']}
                    </Typography>
                    
                    <Typography variant="body2" fontWeight={'bold'}>
                        <strong>{APPOINTMENT_REMOVE['message']}</strong>
                        
                    </Typography>
                </Box>
            )
            
        }
        if (type === APPOINTMENT){
            return (
                <>
                    <Box>
                    <Typography variant="h5" fontWeight='bold'>
                            {APPOINTMENT_REMOVE['title']}
                    </Typography>
                    
                    <Typography variant="body2" fontWeight={'bold'}>
                        <strong>{APPOINTMENT_REMOVE['message']}</strong>
                        
                    </Typography>
                    </Box>
                </>
            )
        }
        if (type === WAITLIST){
            return (
                <>
                    <Box>
                    <Typography variant="h5" fontWeight='bold'>
                            {WAITLIST_REMOVE['title']}
                    </Typography>
                    
                    <Typography variant="body2" fontWeight={'bold'}>
                        <strong>{WAITLIST_REMOVE['message']}</strong>
                        
                    </Typography>
                    </Box>
                </>
            )
        }

    }



    return (
        <Box className="center-box" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3 }}>
        <Card className="custom-card" sx={{ p: 2, borderRadius: 5, boxShadow: 0 }}>
            
            { loading ? <CircularProgress/> : 
            (<>
            <CardContent sx={{ justifyContent: 'center'}}>
                <Typography variant="body2" fontWeight="bold" color="gray" gutterBottom>
                    {link}
                </Typography>
                <ShowLandingStatus type={type} />

            </CardContent>
            </>
            )}
            <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 2, pt: 7}}>
                <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
            </CardActions>
        </Card>
    </Box>
    )
}