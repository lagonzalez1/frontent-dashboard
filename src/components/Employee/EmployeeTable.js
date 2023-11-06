import React, {useState} from "react";
import { Table, TableCell, TableHead, TableBody, Button, Typography, Container
    ,TableRow, Box, Stack, Modal, Dialog, DialogTitle, DialogContent, Divider, IconButton, ButtonGroup, Tooltip, FormLabel, RadioGroup, FormControl, FormControlLabel, Radio, DialogActions} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AddEmployeeForm from "../Forms/AddEmployeeForm";
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import { requestRemoveEmployee, requestBlockEmployee } from "../FormHelpers/AddNewEmployeeFormHelper";
import { setReload, setSnackbar } from "../../reducers/user";
import EmployeeScheduleForm from "../Forms/EmployeeScheduleForm";
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { DateTime } from "luxon";
// Show table of employees
// Allow to delete and add employees
export default function EmployeeTable() {

    const employees = useSelector((state) => state.business.employees);
    const today = DateTime.local();
    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [employee, setEmployee] = useState(null);
    const [employeeId, setEmployeeId] = useState(null); 
    const [employeeScheduleDialog, setEmployeeScheduleDialog] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [quickActions, setQuickActions] = useState(false);
    const [invisable, setInvisable] = useState(null);
    const [message, setMessage] = useState(null);
    const dispatch = useDispatch();


    const showEmployeeModal = () => {
        setEmployeeDialog(true)
    }

    const showQuickActions = (employee) => {
        setEmployee(employee);
        setInvisable(employee.blockOff.status)
        setQuickActions(true);
    }

    const closeEmployeeModal = () => {
        setEmployeeDialog(false)
        if (employee) {
            setEmployee(null);
        }
    }

    const removeEmployee = (id) => {
        requestRemoveEmployee(id)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.response.msg, requestStatus: true}))
        })
        .finally(() => {
            dispatch(setReload(true))
        })
    }
    const editEmployee = (employee) => {
        setEmployee(employee);
        setEmployeeDialog(true);
    }

    const handleActionClose = () => {
        setQuickActions(false);
        setEmployee(null);
    }


    const confirmDelete = (id) => {
        setDeleteConfirm(true);
        setEmployeeId(id);
    }
    const cancelEmployeeDelete = () => {
        setDeleteConfirm(false);
        setEmployeeId(id);
    }

    const editSchedule = (employee) => {
        setEmployee(employee);
        setEmployeeScheduleDialog(true);
    }

    const closeEditSchedule = () => {
        setEmployee(null);
        setEmployeeScheduleDialog(false);
    }

    const changeVisability = () => {
        if (!employee) { 
            console.log("Set error message changeVisability");
            setMessage("Please select a employee")
            return;
        }
        const currentDate = DateTime.local().toISO();
        const data = { status: invisable, eid: employee._id, lastUpdate: currentDate}

        requestBlockEmployee(data)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.response.msg, requestStatus: true}))
        })
        .finally(() => {
            dispatch(setReload(true))
        })

    }

    return (
        <>
            <Stack spacing={1}>
                <Table container size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                #
                            </TableCell>
                            <TableCell>
                                Fullname
                            </TableCell>
                            <TableCell>
                                Permissions
                            </TableCell>
                            <TableCell>
                                
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {

                            employees ? employees.map((employee, index) => {
                                return (
                                    <TableRow>
                                        <TableCell>
                                            <IconButton aria-label="InfoClick" size="small" onClick={() => showQuickActions(employee)}>
                                                <VisibilityOffOutlinedIcon  fontSize="sm"/>
                                            </IconButton>
                                            {++index}
                                        </TableCell>
                                        <TableCell>
                                            {employee.fullname}
                                        </TableCell>
                                        <TableCell>
                                            {employee.permissionLevel}
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction={'row'}>
                                            <IconButton onClick={() => confirmDelete(employee._id)}>
                                                <DeleteIcon fontSize="Small" />
                                            </IconButton>
                                            <IconButton onClick={() => editEmployee(employee)}>
                                                <EditIcon fontSize="small"/>
                                            </IconButton>
                                            <IconButton onClick={() => editSchedule(employee)}>
                                                <CalendarMonthIcon fontSize="small"/>
                                            </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                )
                            }) :null
                        }

                    </TableBody>

                </Table>
            </Stack>
            <br/>
            <Button onClick={() => showEmployeeModal()} sx={{borderRadius: 15}} variant="contained">
                Add
            </Button>

            <Dialog
                open={deleteConfirm}
                onClose={() => cancelEmployeeDelete()}
                maxWidth={'sm'}
                disableBackdropClick
                disableEscapeKeyDown
            >
            <DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={() => cancelEmployeeDelete()}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton> 
                Delete employee ?
            </DialogTitle>

            <DialogContent>
                <Container>
                    <Stack spacing={2}>
                        <Button sx={{ borderRadius: 15}} variant="contained" onClick={() => removeEmployee(employeeId)} >yes</Button>
                        <Button sx={{ borderRadius: 15}} variant="outlined" onClick={() => cancelEmployeeDelete()}>no</Button>
                    </Stack>
                </Container>
                
            </DialogContent>
            </Dialog>


            <Dialog
                open={employeeDialog}
                onClose={closeEmployeeModal}
            >
            <DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={closeEmployeeModal}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton> 
                Employee

           </DialogTitle>

            <DialogContent>
                <AddEmployeeForm employee={employee}/>
            </DialogContent>
            </Dialog>



            <Dialog
                open={employeeScheduleDialog}
                onClose={closeEditSchedule}
                fullWidth={'xs'}
                maxWidth={'xs'}
            >
            <DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={closeEditSchedule}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton> 
                Employee {employee ? employee.fullname: ''} breaks
           </DialogTitle>

            <DialogContent>
                <EmployeeScheduleForm employee={employee}/>
            </DialogContent>
            </Dialog>

            <Dialog
                open={quickActions}
                onClose={handleActionClose}
                fullWidth={'xs'}
                maxWidth={'xs'}
            >
            <DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={handleActionClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton> 
                Employee {employee ? employee.fullname: ''}
           </DialogTitle>

            <DialogContent>
                <Typography variant="subtitle1">Make employee invisable for waitlist and appointments for the rest of today, {DateTime.local().toFormat('dd LLLL yyyy')}.</Typography>
                <Typography variant="body2">{ employee && today.hasSame(DateTime.fromISO(employee.blockOff.lastUpdate), 'day') ? DateTime.fromISO(employee.blockOff.lastUpdate).toString() : '' }</Typography>
                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group"></FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={invisable}
                        onChange={(e) => setInvisable(e.target.value) }
                    >
                        <FormControlLabel value={false}control={<Radio />} label="Visable" />
                        <FormControlLabel value={true} control={<Radio />} label="Invisable" />
                    </RadioGroup>
                    </FormControl>
            </DialogContent>
            <DialogActions>
                <Button sx={{borderRadius: 10}} variant="contained" onClick={() => changeVisability(employee)}>Save</Button>
            </DialogActions>
            </Dialog>

        
        </>
    )
}