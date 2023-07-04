import React, { useState } from 'react';
import {
  Fab,
  Modal,
  TextField,
  Button,
  Dialog, Box, IconButton, DialogTitle, DialogContentText, DialogContent, DialogActions
} from '@mui/material';

import makeStyles from "@emotion/styled"
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  duration: Yup.number().required('Duration is required'),
  cost: Yup.number(),
});

const AddService = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (values) => {
    console.log(values); // Handle form submission logic here
    setOpen(false);
  };

  return (
    <Box sx={{ '& > :not(style)': { m: 1 }, position: 'absolute', bottom: '10px', right :'10px' } }>
      <Fab color="primary" className={classes.fab} onClick={handleOpen}>
        <AddIcon />
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        className={classes.modal}
      >
        <DialogTitle>
            Add a resource
            <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              title: '',
              description: '',
              duration: '',
              cost: '',
              resourceId: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Field
                as={TextField}
                name="title"
                label="Title"
                fullWidth
                margin="normal"
                variant="outlined"
                helperText={<ErrorMessage name="title" />}
              />
              <Field
                as={TextField}
                name="description"
                label="Description"
                fullWidth
                margin="normal"
                variant="outlined"
                helperText={<ErrorMessage name="description" />}
              />
              <Field
                as={TextField}
                name="duration"
                label="Duration"
                fullWidth
                margin="normal"
                variant="outlined"
                helperText={<ErrorMessage name="duration" />}
              />
              <Field
                as={TextField}
                name="cost"
                label="Cost"
                fullWidth
                margin="normal"
                variant="outlined"
                helperText={<ErrorMessage name="cost" />}
              />
              
              
            </Form>
          </Formik>
          <DialogActions>
          <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitButton}
              >
                save
              </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AddService;
