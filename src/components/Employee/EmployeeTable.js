import React, {useState} from "react";
import { Table, TableCell, TableHead, TableBody, Button, Typography, Container
    ,TableRow, Box, Stack, Modal, Dialog, DialogTitle, DialogContent, Divider, IconButton, ButtonGroup, Tooltip, FormLabel, RadioGroup, FormControl, FormControlLabel, Radio, DialogActions,
    FormGroup,
    Switch,
    FormHelperText,
    Checkbox} from "@mui/material";
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
import { findEmployee, getTimeZone } from "../../hooks/hooks";
import { usePermission } from "../../auth/Permissions";
import { useSubscription } from "../../auth/Subscription";
import { LoadingButton } from "@mui/lab";
import { Eye, EyeClosed } from "phosphor-react";
import CheckCircle from "@mui/icons-material/CheckCircle";
import { Transition } from "../FormHelpers/OpeningHoursHelper";
// Show table of employees
// Allow to delete and add employees
export default function EmployeeTable({reloadPage}) {


    const { canEmployeeEdit, checkPermission } = usePermission();
    const timezone = getTimeZone();
    const { checkSubscription, cancelledSubscription } = useSubscription();
    const employees = useSelector((state) => state.business.employees);
    const userEmail = useSelector((state) => state.user.email);
    const today = DateTime.local();
    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [employee, setEmployee] = useState(null);
    const [employeeId, setEmployeeId] = useState(null); 
    const [employeeScheduleDialog, setEmployeeScheduleDialog] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [quickActions, setQuickActions] = useState(false);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [visibility, setVisibilty] = useState({
        show: false,
        hide: false,
        revert: false
    })
    const dispatch = useDispatch();


    const showEmployeeModal = () => {
        setEmployeeDialog(true)
    }

    const showQuickActions = (employee) => {
        setEmployee(employee);
        setQuickActions(true);
    }

    const handleVisibiltyChange = (event) => {
        const status = event.target.checked;
        setVisibilty((prev) => ({...prev, revert: false, show: status, hide: !status}));
    }

    const handleVisibiltyChange2 = (event) => {
        const status = event.target.checked;
        setVisibilty((prev) => ({...prev, revert: false, hide: status, show: !status}));
    }

    const handleVisibiltyChange3 = (event) => {
        setVisibilty((prev) => ({...prev, revert: event.target.checked, hide: false, show: false}));
    }


    const closeEmployeeModal = () => {
        setEmployeeDialog(false)
        if (employee) {
            setEmployee(null);
        }
    }

    const removeEmployee = (id) => {
        setLoading(true);
        requestRemoveEmployee(id)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            cancelEmployeeDelete();
            setLoading(false);
            reloadPage();
        })
    }
    const editEmployee = (employee) => {
        setEmployee(employee);
        setEmployeeDialog(true);
    }

    const handleActionClose = () => {
        setQuickActions(false);
        setEmployee(null);
        setVisibilty({revert: false, hide: false, show: false})
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
        setEmployeeScheduleDialog(false);
        setEmployee(null);

    }

    const changevisibility= () => {
        if (!employee) { 
            console.log("Set error message change visibility");
            setMessage("Please select a employee")
            return;
        }
        setLoading(true);
        const currentDate = DateTime.local().setZone(timezone).toISO();
        const data = { revert: visibility.revert,
            lastUpdate: currentDate, show: visibility.show, hide: visibility.hide,
            eid: employee._id}
        requestBlockEmployee(data)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            handleActionClose();
            setLoading(false);
            reloadPage();
        })

    }

    const ShowVisibilityOptions = ({employee}) => {
        if (employee.visibility.lastUpdate === null) {
            return (
                <Typography variant="body1">
                    {'No active changes as of now.'}
                </Typography>
            )
        }
        else {
            const lastUpdatedOn = DateTime.fromISO(employee.visibility.lastUpdate).setZone(timezone);
            const currentDate = DateTime.local().setZone(timezone);
            const hide = employee.visibility.hide;
            const show = employee.visibility.show;
            const isSameDay = lastUpdatedOn.hasSame(currentDate, 'day');
            if (isSameDay) {
                return (
                    <Stack spacing={1} direction={'row'}>
                    <Typography variant="body1">
                        {hide ? "- " + currentDate.toLocaleString() + ' HIDDEN': null}
                        {show ? "-  " + currentDate.toLocaleString() + ' VISIBLE' : null}
                    </Typography>
                    {
                        hide ? (<EyeClosed size={20} />) : null
                     }
                     {
                        show ? (<Eye size={20} />) : null
                     }
                    </Stack>
                )
            }
            else {
                return (
                    <Typography variant="body1">
                        {'No active changes.'}
                    </Typography>
                )
            }
        }
    }

    return (
        <>
            <Stack spacing={1}>
                <Table container size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>#</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Visable</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Visable</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Permissions</strong>
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
                                            <Tooltip title="delete employee" placement="top">
                                            <IconButton disabled={!checkPermission('EMPL_REMOVE')} onClick={() => confirmDelete(employee._id)}>
                                                <DeleteIcon fontSize="Small" />
                                            </IconButton>
                                            </Tooltip>
                                            <Tooltip title="edit employee schedule" placement="top">
                                            <IconButton disabled={!canEmployeeEdit(employee._id, 'EMPL_EDIT')} onClick={() => editEmployee(employee)}>
                                                <BorderColorRoundedIcon fontSize="small"/>
                                            </IconButton>
                                            </Tooltip>
                                            <Tooltip title="add employee schedule" placement="top">
                                            <IconButton disabled={!canEmployeeEdit(employee._id, 'EMPL_EDIT')} onClick={() => editSchedule(employee)}>
                                                <CalendarMonthIcon fontSize="small"/>
                                            </IconButton>
                                            </Tooltip>
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
            <Button disabled={!checkPermission('EMPL_ADD') || cancelledSubscription()} onClick={() => showEmployeeModal()} sx={{borderRadius: 7}} variant="contained">
                Add
            </Button>

            <Dialog
                open={deleteConfirm}
                onClose={cancelEmployeeDelete}
                maxWidth={'sm'}
                disableBackdropClick
                disableEscapeKeyDown
            >
            <DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={cancelEmployeeDelete}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton> 
                <Typography variant="h5" fontWeight={'bold'}> Delete employee? </Typography>
                
            </DialogTitle>
            <Divider/>

            <DialogContent>
                <Typography variant="body2">Please confirm removal of <strong>{findEmployee(employeeId).fullname}</strong> from employee list. </Typography>
                
            </DialogContent>
            <DialogActions>
                <Button sx={{ borderRadius: 7}} variant="contained" color="error" onClick={() => removeEmployee(employeeId)} >yes</Button>
                <Button sx={{ borderRadius: 7}} variant="contained" onClick={() => cancelEmployeeDelete()}>no</Button>
            </DialogActions>
            </Dialog>


            <Dialog
                id="addNewEmployee"
                open={employeeDialog}
                onClose={closeEmployeeModal}
                maxWidth="sm"
                fullWidth={false}
                TransitionComponent={Transition}
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
                <AddEmployeeForm employee={employee} closeModal={closeEmployeeModal}/>
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
                <Typography variant="body1" gutterBottom>Toggle employee visibility for waitlist and appointments for the remainder of today.</Typography>
                
                {employee && <ShowVisibilityOptions employee={employee} /> }

                <br/>
                <FormControl component="fieldset" variant="standard">
                    <FormLabel color="secondary"  component="legend">Handle visibility</FormLabel>
                    <FormGroup>
                        
                    <FormControlLabel control={<Checkbox color="secondary" checked={visibility.show} onChange={handleVisibiltyChange} />} label="Show" />
                    <FormControlLabel control={<Checkbox color="secondary" checked={visibility.hide} onChange={handleVisibiltyChange2} />} label="Hide" />
                    <FormControlLabel control={<Checkbox color="secondary"  checked={visibility.revert} onChange={handleVisibiltyChange3} />} label="Revert to schedule" />

                    </FormGroup>
                    <FormHelperText>This will overide your schedule</FormHelperText>
                    </FormControl>
            </DialogContent>
            <DialogActions>
                <LoadingButton loading={loading} disabled={cancelledSubscription()} sx={{borderRadius: 10}} variant="contained" onClick={() => changevisibility(employee)}>Save</LoadingButton>
            </DialogActions>
            </Dialog>

        
        </>
    )
}