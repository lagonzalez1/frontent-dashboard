import React, {useState, useEffect} from "react";
import { Dialog, Button, IconButton, DialogActions, TextField, Typography, DialogContent, DialogTitle, Rating, Stack, Slide} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DateTime } from "luxon";
import StarIcon from '@mui/icons-material/Star';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function ReviewDialog({open, payload, onClose}) {
    const labels = {
        0.5: 'Useless',
        1: 'Useless+',
        1.5: 'Poor',
        2: 'Poor+',
        2.5: 'Ok',
        3: 'Ok+',
        3.5: 'Good',
        4: 'Good+',
        4.5: 'Excellent',
        5: 'Excellent+',
    };
      
    function getLabelText(value) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }

    useState(() => {
        console.log(payload)
    }, [])

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={'sm'}
            TransitionComponent={Transition}
            fullWidth={true}
        >
            <DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton> 
                <Typography variant="h5" fontWeight={'bold'}>Review:  { payload && payload.timestamp ? DateTime.fromISO(payload.timestamp).toLocaleString() : ''} </Typography>
            </DialogTitle>
            <DialogContent>
            <Stack spacing={2}>
                <Rating
                    name="hover-feedback"
                    value={payload && payload.rate ? payload.rate : 0}
                    getLabelText={getLabelText}
                    readOnly 
                    size="large"
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                <TextField value={payload && payload.comment ? payload.comment : 'No review has been made'} multiline rows={4} label={'Comment'} />
            </Stack>
            </DialogContent>
        </Dialog>
    )
}
