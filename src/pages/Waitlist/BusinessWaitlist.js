import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { Container, Box, Typography, Table, TableCell, TableBody, TableRow, Button, Link, CardContent, TableHead, Card, CircularProgress, Alert, CardActions } from "@mui/material";
import { requestBusinessArguments, requestBusinessWaitlist } from "./WaitlistHelper";
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PunchClockTwoToneIcon from "@mui/icons-material/PunchClockTwoTone"

export default function BusinessWaitlist () {

    const { link } = useParams();

    const [error, setErrors] = useState();
    const [loading, setLoading] = useState();
    const [args, setArgs] = useState(null);
    const [waitlist,setWaitlist] = useState();
    const [isOpen, setIsOpen] = useState(null);
    


    useEffect(() => {
        getBusinessArgs();
        getWaitlist();
        return () => {
            if (args && waitlist) {
                setLoading(false);
            }
        }
    }, [])


    const getBusinessArgs = () => {
        setLoading(true);
        requestBusinessArguments(link)
        .then(response => {
            setArgs(response);
        })
        .catch(error => {
            console.log(error);
            setErrors('Error found when collecting arguments.')
        })
        .finally(() => {
            setLoading(false);
        })
    }

    const getWaitlist = () => {
        setLoading(true);
        console.log("ENTER")
        requestBusinessWaitlist(link)
        .then(response => {
            setWaitlist(response.sorted);
            setIsOpen(response.isAccepting);
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
            if (args.present.waitlist === false){
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
                                                <TableRow>
                                                    <TableCell>
                                                    <Typography variant="body2" textAlign={'left'}>{++index}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                    <Typography variant="body2" textAlign={'center'}>{item.fullname}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                    <Typography variant="body2" textAlign={'center'}>{item.partySize}</Typography>
                                                    </TableCell>
                                                </TableRow>
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

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3, pl: 2, pr: 2 }}>
                <Card sx={{ textAlign:'center', p: 3, borderRadius: 5, boxShadow: 0 }}>
                    <Typography variant="body2" fontWeight="bold" color="gray" gutterBottom>
                        <Link underline="hover" href={`/welcome/${link}`}>{link}</Link>
                    </Typography>
                    {loading ? 
                    <Container sx={{ p: 3}}>
                        <CircularProgress /> 
                    </Container>: 
                    
                        <CardContent>
                            <DisplayWaitlist />
                        </CardContent>
                    }
                    <CardActions sx={{ justifyContent: 'center', alignItems: 'center', alignContent: 'baseline', marginBottom: 5, pt: 2}}>
                        <Typography gutterBottom variant="caption" fontWeight="bold" color="gray">Powered by Waitlist <PunchClockTwoToneIcon fontSize="small"/> </Typography>
                    </CardActions>
                </Card>
            </Box>
        
        </>
    )
}