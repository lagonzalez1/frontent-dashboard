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
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { DateTime } from "luxon";
import { allowEmployeeEdit, findEmployee } from "../../hooks/hooks";
import { usePermission } from "../../auth/Permissions";
// Show table of employees
// Allow to delete and add employees
export default function EmployeeTable({setLoading, loading}) {


    const { canEmployeeEdit, checkPermission } = usePermission();
    const employees = useSelector((state) => state.business.employees);
    const userEmail = useSelector((state) => state.user.email);
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
            setLoading(true);
        })
    }
    const editEmployee = (employee) => {
        setEmployee(employee);
        setEmployeeDialog(true);
    }

    const handleActionClose = () => {
        setQuickActions(false);
        setInvisable(null)
        setEmployee(null);
    }

    const confirmDelete = (id) => {
        setDeleteConfirm(true);
        setEmployeeId(id);
    }
    const cancelEmployeeDelete = () => {
        setDeleteConfirm(false);
        setEmployeeId(null);
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
            setLoading(true);
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
                                Visable
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
                                            {++index}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton disabled={!canEmployeeEdit(employee._id, 'EMPL_EDIT')} aria-label="InfoClick" size="small" onClick={() => showQuickActions(employee)}>
                                                <VisibilityRoundedIcon fontSize="small"/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {employee.fullname}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {employee.permissionLevel}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction={'row'}>
                                            <IconButton disabled={!checkPermission('EMPL_REMOVE')} onClick={() => confirmDelete(employee._id)}>
                                                <DeleteIcon fontSize="Small" />
                                            </IconButton>
                                            <IconButton disabled={!canEmployeeEdit(employee._id, 'EMPL_EDIT')} onClick={() => editEmployee(employee)}>
                                                <BorderColorRoundedIcon fontSize="small"/>
                                            </IconButton>
                                            <IconButton disabled={!canEmployeeEdit(employee._id, 'EMPL_EDIT')} onClick={() => editSchedule(employee)}>
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
            <Button disabled={!checkPermission('EMPL_ADD')} onClick={() => showEmployeeModal()} sx={{borderRadius: 15}} variant="contained">
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
                <Typography variant="h5" fontWeight={'bold'}> Delete employee</Typography>
                
            </DialogTitle>
            <Divider/>

            <DialogContent>
                <Typography variant="body2">Delete {findEmployee(employeeId).fullname} from buisness?</Typography>
                
            </DialogContent>
            <DialogActions>
                <Button sx={{ borderRadius: 15}} variant="outlined" color="error" onClick={() => removeEmployee(employeeId)} >yes</Button>
                <Button sx={{ borderRadius: 15}} variant="contained" onClick={() => cancelEmployeeDelete()}>no</Button>
            </DialogActions>
            </Dialog>


            <Dialog
                id="addNewEmployee"
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
                <Typography variant="h6" fontWeight={'bold'}>Add new employee</Typography> 
           </DialogTitle>
           <Divider/>

            <DialogContent>
                <AddEmployeeForm employee={employee}/>
            </DialogContent>
            </Dialog>

            <Dialog
                id="employeeSchedule"
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
                <Typography variant="h5" fontWeight={'bold'}>Breaks:  {employee ? employee.fullname: ''}</Typography>
                
           </DialogTitle>
            <Divider />
            <DialogContent>
                <EmployeeScheduleForm employee={employee}/>
            </DialogContent>
            </Dialog>

            <Dialog
                id="quickActions"
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
                <Typography variant="h5" fontWeight={'bold'}>Actions: {employee ? employee.fullname: ''} </Typography>
                <Divider />
           </DialogTitle>

            <DialogContent>
                <Typography variant="body2">Make employee invisable for waitlist and appointments for the rest of today, {DateTime.local().toFormat('dd LLLL yyyy')}.</Typography>
                <Typography variant="body2" fontWeight={'bold'}>{ employee && today.hasSame(DateTime.fromISO(employee.blockOff.lastUpdate), 'day') ? "Blocked for  " + DateTime.fromISO(employee.blockOff.lastUpdate).toLocaleString() : '' }</Typography>
                <br/>
                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">Block employee</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={invisable}
                        onChange={(e) => setInvisable(e.target.value) }
                    >
                        <FormControlLabel value={false} control={<Radio />} label="Visable" />
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