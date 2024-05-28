import React, { memo, useState} from "react";
import { Dialog, Button, IconButton, DialogActions, Typography, DialogContent, DialogTitle, Select, Menu, MenuItem} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"
import { DateTime } from "luxon";
import { getEmployeeList, moveClientServing } from "../../hooks/hooks";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../reducers/user";


const ServingClient = ({open, onClose, clientId, type}) => {

    const dispatch = useDispatch();
    const employeeList = getEmployeeList();
    const [employeeId, setEmployeeId] = useState('');

    const sendClientServing = (clientId, type) => {
        console.log(`Sending client ${clientId} from ${type} to serving`)
        moveClientServing(clientId, type, employeeId)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response.msg, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            onClose();
        })
    }

    return (
        <>
        <Dialog
        keepMounted
        id="servingClient"
        open={open}
        onClose={onClose}
        maxWidth={'sm'}
        
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
              <Typography variant='body2'>
                Providing a employee reduces your online estimated wait time.
              </Typography>
              <Select
                labelId="employeeList"
                id="employeeList"
                value={employeeId}
                label="Employees"
                fullWidth
                onChange={e => setEmployeeId(e.target.value)}
            >   
                <MenuItem value={''}>{'NONE'}</MenuItem>

                {employeeList ? employeeList.map((employee) => {
                    return (
                        <MenuItem value={employee._id}>{employee.fullname}</MenuItem>
                    )
                }): null}
            </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} sx={{borderRadius: 10}} variant='contained' color='primary'>Close</Button>
              <Button onClick={() => sendClientServing(clientId, type) } sx={{borderRadius: 10}} variant='contained' color='success'>Send</Button>
            </DialogActions>

      </Dialog>
      
      </>
    )


}

export default memo(ServingClient);