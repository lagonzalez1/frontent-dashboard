import React, {useState} from "react";
import { Table, TableCell, TableHead, TableBody, Button, Typography, Container
    ,TableRow, Box, Stack, Modal, Dialog, DialogTitle, DialogContent, Divider, IconButton} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AddEmployeeForm from "../Forms/AddEmployeeForm";
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { requestRemoveEmployee } from "../FormHelpers/AddNewEmployeeFormHelper";
import { setReload, setSnackbar } from "../../reducers/user";


// Show table of employees
// Allow to delete and add employees
export default function EmployeeTable() {

    const employees = useSelector((state) => state.business.employees);

    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [employee, setEmployee] = useState(null);
    const [employeeId, setEmployeeId] = useState(null); 
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const dispatch = useDispatch();


    const showEmployeeModal = () => {
        setEmployeeDialog(true)
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


    const confirmDelete = (id) => {
        setDeleteConfirm(true);
        setEmployeeId(id);
    }
    const cancelEmployeeDelete = () => {
        setDeleteConfirm(false);
        setEmployeeId(id);
    }

    return (
        <>
            <Stack spacing={1}>
                <Table container>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                #
                            </TableCell>
                            <TableCell>
                                Fullname
                            </TableCell>
                            <TableCell>
                                Permission lvl.
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

        
        </>
    )
}