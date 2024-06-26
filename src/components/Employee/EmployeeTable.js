import React, {useEffect, useState} from "react";
import { Table, TableCell, TableHead, TableBody, Button, Typography, Container
    ,TableRow, Box, Stack, Modal, Dialog, DialogTitle, DialogContent, Divider, IconButton, ButtonGroup, Tooltip, FormLabel, RadioGroup, FormControl, FormControlLabel, Radio, DialogActions,
    FormGroup,
    Switch,
    FormHelperText,
    Checkbox,
    ListItemAvatar,
    ListItem,
    Avatar,
    List,
    ListItemText} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AddEmployeeForm from "../Forms/AddEmployeeForm";
import CloseIcon from "@mui/icons-material/Close"
import { requestRemoveEmployee, requestBlockEmployee } from "../FormHelpers/AddNewEmployeeFormHelper";
import { setSnackbar } from "../../reducers/user";
import EmployeeScheduleForm from "../Forms/EmployeeScheduleForm";
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { DateTime } from "luxon";
import { findEmployee, getEmployees, getTimeZone } from "../../hooks/hooks";
import { usePermission } from "../../auth/Permissions";
import { useSubscription } from "../../auth/Subscription";
import { LoadingButton } from "@mui/lab";
import { Calendar, Eye, EyeClosed, PencilSimpleLine, Trash } from "phosphor-react";
import CheckCircle from "@mui/icons-material/CheckCircle";
import { Transition } from "../FormHelpers/OpeningHoursHelper";
import { payloadAuth } from "../../selectors/requestSelectors";
// Show table of employees
// Allow to delete and add employees


export default function EmployeeTable() {


    const { canEmployeeEdit, checkPermission } = usePermission();
    const timezone = getTimeZone();
    const { checkSubscription, cancelledSubscription } = useSubscription();
    //const employees = useSelector((state) => state.business.employees);
    const business = useSelector((state) => state.business);
    const {id, bid, email} = useSelector((state) => payloadAuth(state));


    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [employees, setEmployees] = useState();
    const [employee, setEmployee] = useState(null);
    const [employeeId, setEmployeeId] = useState(null); 
    const [employeeScheduleDialog, setEmployeeScheduleDialog] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [quickActions, setQuickActions] = useState(false);
    const [reload, setReload] = useState(false);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editEmployeeDialog, setEditEmployee] = useState(false);
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
        requestRemoveEmployee(id, bid, email)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            cancelEmployeeDelete();
            setLoading(false);
            setReload(true);
        })
    }
    const editEmployee = (employee) => {
        setEmployee(employee);
        setEditEmployee(true);
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

    const closeEditEmployee = () => {
        setEditEmployee(false);
        setEmployee(null)
    }

    const closeEditSchedule = () => {
        setEmployeeScheduleDialog(false);
        setEmployee(null);

    }

    useEffect(() => {
        getEmployeeList();
        return () => {
            setReload(false)
        }
    }, [reload])

    const reloadPage = () => {
        setReload(true);
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
        requestBlockEmployee(data, bid, email)
        .then(response => {
            dispatch(setSnackbar({requestMessage: response, requestStatus: true}))
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        .finally(() => {
            handleActionClose();
            setLoading(false);
            setReload(true)
        })

    }

    const getEmployeeList = () => {
        getEmployees(bid, email)
        .then(response => {
            setEmployees(response.employees);
        })
        .catch(error => {
            dispatch(setSnackbar({requestMessage: error.msg, requestStatus: true}))
        })
        
    }

    const ShowVisibilityOptions = ({employee}) => {
        if (employee.visibility.lastUpdate === null) {
            return (
                <Typography variant="body1" color={'warning'}>
                    {'-No active changes as of now.'}
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
                    <Typography variant="body1" color={'error'}>
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
                    <Typography variant="body1" color={'warning'}>
                        {'No active changes.'}
                    </Typography>
                )
            }
        }
    }

    return (
        <>

            <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: '400'}}>
                {employees ? employees.map((employee, index) => {
                    return (
                        <>
                        <ListItem key={index}  
                            secondaryAction = {
                            <Stack direction={'row'} spacing={1}>
                               
                                <Tooltip title="delete employee" placement="top">
                                    <Button startIcon={<Trash size={20} weight="duotone" />} disabled={!checkPermission('EMPL_REMOVE')} onClick={() => confirmDelete(employee._id)}>
                                        <Typography variant="caption">delete</Typography>
                                    </Button>
                                </Tooltip>

                                <Tooltip title="edit employee schedule" placement="top">
                                <Button startIcon={<PencilSimpleLine size={20} weight="duotone" />} disabled={!canEmployeeEdit(employee._id, 'EMPL_EDIT')} onClick={() => editEmployee(employee)}>
                                        <Typography variant="caption">edit</Typography>
                                </Button>
                                </Tooltip>

                                <Tooltip title="add employee schedule" placement="top">
                                <Button startIcon={<Calendar size={20} weight="duotone" />} disabled={!canEmployeeEdit(employee._id, 'EMPL_EDIT')} onClick={() => editSchedule(employee)}>
                                        <Typography variant="caption">schedule</Typography>
                                </Button>
                                </Tooltip>
                                <Tooltip title="Make employee available/unavailable" placement="top">
                                <Button startIcon={<Eye size={20} weight="duotone" />} disabled={!canEmployeeEdit(employee._id, 'EMPL_EDIT')} onClick={() => showQuickActions(employee)}>
                                    <Typography variant="caption">visibility</Typography>
                                </Button>
                                </Tooltip>
                            </Stack>
                        }
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ width: 50, height: 50 }} src={employee.image !== null ? employee.image : null} variant="rounded" />
                            </ListItemAvatar>
                            <ListItemText
                                primary={employee.fullname}
                                secondary={
                                    <React.Fragment>
                                    <Stack>
                                        <Typography variant="caption">{ `Permission level: ${employee.permissionLevel}` }</Typography>
                                        <Typography variant="caption">{ employee.presentDaySchedule }</Typography>
                                    </Stack>
                                    </React.Fragment>
                                }
                                />
                        </ListItem>
                        <Divider />
                        </>
                    )

                }) : null}
                
            </List>
            <Stack spacing={1}>
                
            </Stack>
            <br/>
            <Button disabled={!checkPermission('EMPL_ADD') || cancelledSubscription()} onClick={() => showEmployeeModal()} sx={{borderRadius: 5, textTransform: 'lowercase', fontWeight: 'bold'}}variant="contained">
                Add
            </Button>

            <Dialog
                open={deleteConfirm}
                onClose={cancelEmployeeDelete}
                TransitionComponent={Transition}
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
                <AddEmployeeForm employee={employee} closeModal={closeEmployeeModal} reloadPage={reloadPage}/>
            </DialogContent>
            </Dialog>

            <Dialog
                id="editEmployee"
                open={editEmployeeDialog}
                onClose={closeEditEmployee}
                maxWidth="sm"
                fullWidth={false}
                TransitionComponent={Transition}
            >
            <DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={closeEditEmployee}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" fontWeight={'bold'}>Edit employee</Typography> 
           </DialogTitle>
           <Divider/>

            <DialogContent>
                <AddEmployeeForm employee={employee} closeModal={closeEditEmployee} reloadPage={reloadPage}/>
            </DialogContent>
            </Dialog>

            <Dialog
                id="employeeSchedule"
                open={employeeScheduleDialog}
                onClose={closeEditSchedule}
                fullWidth={false}
                TransitionComponent={Transition}
                maxWidth={'lg'}
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
                <Typography variant="h5" fontWeight={'bold'}>Schedule:  {employee ? employee.fullname: ''}</Typography>
                
           </DialogTitle>
            <Divider />
            <DialogContent>
                <EmployeeScheduleForm employee={employee} closeEditSchedule={closeEditSchedule} reloadPage={reloadPage} />
            </DialogContent>
            </Dialog>

            <Dialog
                id="quickActions"
                open={quickActions}
                onClose={handleActionClose}
                fullWidth={false}
                maxWidth={'xs'}
                TransitionComponent={Transition}
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
                <Typography variant="body1" gutterBottom>Change employee visability for today.</Typography>
                <Typography variant="body1" gutterBottom>In part, employee will not be bookable until the end of today.</Typography>
                
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
                <LoadingButton loading={loading} disabled={cancelledSubscription()} sx={{borderRadius: 5, textTransform: 'lowercase', fontWeight: 'bold'}} variant="contained" onClick={() => changevisibility(employee)}>Save</LoadingButton>
            </DialogActions>
            </Dialog>

        
        </>
    )
}