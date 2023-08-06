import React, {useState} from "react";
import { Table, TableCell, TableHead, TableBody, Button, Typography, Container
    ,TableRow, Box, Stack, Modal, Dialog, DialogTitle, DialogContent, Divider, IconButton} from "@mui/material";
import { useSelector } from "react-redux";
import AddEmployeeForm from "../Forms/AddEmployeeForm";
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


// Show table of employees
// Allow to delete and add employees
export default function EmployeeTable() {

    const employees = useSelector((state) => state.business.employees);


    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [employee, setEmployee] = useState(null)



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
        console.log("Remove employee", id);
    }
    const editEmployee = (employee) => {
        // Launch dialog and pass payload to AddEmployeeForm
        console.log(employee);
        setEmployee(employee);
        setEmployeeDialog(true);
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
                                Username
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
                                            {employee.employeeUsername}
                                        </TableCell>
                                        <TableCell>
                                            {employee.permissionLevel}
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction={'row'}>
                                            <IconButton onClick={() => removeEmployee(employee._id)}>
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