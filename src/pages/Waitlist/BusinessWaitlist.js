import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { Container, Box, Typography, Table, TableCell, TableBody, TableRow, Button, Link, CardContent, TableHead, Card, CircularProgress, Alert, CardActions, Collapse } from "@mui/material";
import { requestBusinessArguments, requestBusinessWaitlist } from "./WaitlistHelper";
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PunchClockTwoToneIcon from "@mui/icons-material/PunchClockTwoTone"
import { DateTime } from "luxon";

export default function BusinessWaitlist () {

    const { link } = useParams();

    const [error, setErrors] = useState();
    const [loading, setLoading] = useState();
    const [args, setArgs] = useState(null);
    const [waitlist,setWaitlist] = useState();
    const [isOpen, setIsOpen] = useState(null);


    useEffect(() => {
       
        // Reload after 1.5 min
        const intervalId = setInterval(getWaitlist, 30000);
        console.log("Auto refresh")
        return () => {
          // Clear the interval to avoid memory leaks
            clearInterval(intervalId);
        };
      }, []); 


    const getWaitlist = () => {
        setLoading(true);
        const time = DateTime.local().toISO();
        requestBusinessWaitlist(link,time)
        .then(response => {
            setWaitlist(response.virginList);
            setIsOpen(response.isAccepting);
            setArgs(response.present);
        })
        .catch(error => {
            console.log(error);
            setErrors('Error found when collecting arguments.')
        })
        .finally(() => {
            setLoading(false);
        })
    }


    const DisplayWaitlist = () => {
        if (args) {
            if (isOpen === false) {
                return (
                    <>
                        <Typography variant="h6" fontWeight='bold'>
                            This waitlist is currently closed.
                        </Typography>
                    </>
                )
            }
            if (args.waitlist === false){
                return (
                    <>
                        <Typography variant="h6" fontWeight='bold'>
                            This waitlist is not enabled by the business owner.
                        </Typography>
                    </>
                )
            } else {
                return (
                    <>
                        <Typography variant="h6" fontWeight='bold'>
                            Current waitlist..
                        </Typography>
                        <br/>
                    <Table container>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={'bold'}>#</Typography>
                                        </TableCell>
                                        <TableCell>
                                        <Typography variant="body2" fontWeight={'bold'}>Full name</Typography>
                                        </TableCell>
                                        <TableCell>
                                        <Typography variant="body2" fontWeight={'bold'}>Party size</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {
                                        waitlist ? waitlist.map((item, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <TableRow>
                                                    <TableCell>
                                                        <Typography variant="body2" textAlign={'left'}>
                                                        {index + 1}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" textAlign={'center'}>
                                                        {item.fullname}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" textAlign={'center'}>
                                                        {item.partySize}
                                                        </Typography>
                                                    </TableCell>
                                                    </TableRow>
                                                    
                                                </React.Fragment>
                                            )
                                        }) : null
                                    }
                                </TableBody>
                                
                            </Table>

                    </>
                )
            }
        }
    }


    return(
        <>

            <Box className="center-box" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3, pl: 2, pr: 2 }}>
                <Card sx={{ textAlign:'center', p: 3, borderRadius: 5, boxShadow: 0 }}>
                    <Typography variant="body2" fontWeight="bold" color="gray" gutterBottom>
                        <Link underline="hover" href={`/welcome/${link}`}>{link}</Link>
                    </Typography>
                    <DisplayWaitlist />

                    <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 2}}>
                        <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                    </CardActions>
                </Card>
            </Box>
        
        </>
    )
}