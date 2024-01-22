import React, { memo, useState} from "react";
import { Dialog, Button, IconButton, DialogActions, Typography, DialogContent, DialogTitle, Select, Menu, MenuItem, Grid} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"
import { DateTime } from "luxon";
import { getEmployeeList, moveClientServing } from "../../hooks/hooks";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../reducers/user";


const NewRegister = ({open, onClose}) => {

    const dispatch = useDispatch();
    const employeeList = getEmployeeList();
    const [employeeId, setEmployeeId] = useState('');


    const registerNewBusiness = () => {
        console.log("REgister")
    }

    const initialValue = {
        businessName: '',
        businessWebsite: '',
        businessAddress: '',
        businessPhone: ''
        
    }
    

    return (
        <>
        <Dialog
        keepMounted
        id="servingClient"
        open={open}
        onClose={onClose}
        maxWidth={'md'}
        
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
                <Typography variant="h5" fontWeight={'bold'}>Who is serving your client? </Typography>
            </DialogTitle>
                
            <DialogContent>
              <Grid container spacing={1}>
                    <Grid item xs>
                        
                    </Grid>
                    <Grid item xs>
                        
                    </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} sx={{borderRadius: 10}} variant='contained' color='primary'>Close</Button>
              <Button onClick={() => registerNewBusiness() } sx={{borderRadius: 10}} variant='contained' color='success'>Register</Button>
            </DialogActions>

      </Dialog>
      
      </>
    )


}

export default memo(NewRegister);