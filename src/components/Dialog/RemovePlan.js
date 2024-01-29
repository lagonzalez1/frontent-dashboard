import React, { memo, useEffect, useState} from "react";
import { Dialog, Button, IconButton, DialogActions, Typography, 
  DialogContent, DialogTitle, Select, Menu, MenuItem, Grid, TextField, Stack, Checkbox, FormControl, FormControlLabel, Box, InputLabel, Divider} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"
import { DateTime } from "luxon";
import { getEmployeeList, moveClientServing } from "../../hooks/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "../../reducers/user";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { getCountries } from "../../pages/Register/RegisterHelper.js";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useFormik } from "formik";
import { HOURS_LIST } from "../../pages/Testing/RegisterTest.js";
import { usePermission } from "../../auth/Permissions.js";

const DAYOFWEEK = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday'}

const RemovePlan = ({open, onClose}) => {

    
    const trial = useSelector((state) => state.business.trial);
    const { checkPermission } = usePermission();


    const handleRemovePlan = () => {
        if (checkPermission('DEL_BUSI')){
            console.log("Process cancelation")
        }
        else {
            console.log("Permissions does not allow to change this.");
            return;
        }
    }

    {
        /**
         * 1. Get the last date needed based on stripe last billing cycle
         * 2. Show last date-> decide if cancel or not
         * 3. Update terminating field in business
         * 4. remove upon logins
         */
    }

    

    useEffect(() => {

    }, [])




    return (
        <Dialog
        keepMounted
        id="servingClient"
        open={open}
        onClose={onClose}
        maxWidth={'sm'}
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
                <Typography variant="h5" fontWeight={'bold'}>Remove plan</Typography>
                <Divider />
            </DialogTitle>
                
            <DialogContent>
                <Typography variant="body2" fontWeight={'bold'}>What will happen</Typography>
                <Typography variant="body2">If you continue with cancellation, you will no longer be charged for any additional months. Keep in mind you will still have access until the last month of your billed plan.</Typography>

                <Typography variant="body2" fontWeight={'bold'}>Discounts</Typography>
                <Typography variant="body2">If you are removing an additional business from a already existing plan, keep in mind you will lose any discounts applied.</Typography>

                <Typography variant="body2" fontWeight={'bold'}>Tax purposes</Typography>
                <Typography variant="body2">You will be emailed all billings recipts immediately.</Typography>

                <Typography variant="body2" fontWeight={'bold'}>Last date your data will be stored</Typography>
                <Typography variant="body2"><u>{}</u> </Typography>

            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} sx={{borderRadius: 10}} variant='contained' color='primary'>Close</Button>
              <Button disabled={!checkPermission('DEL_BUSI')} onClick={() => handleRemovePlan()} sx={{borderRadius: 10}} variant='contained' color='error'>Remove</Button>
            </DialogActions>

        </Dialog>      
    )


}

export default memo(RemovePlan);