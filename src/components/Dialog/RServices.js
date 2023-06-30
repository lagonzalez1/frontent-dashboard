import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material/Delete";

const RService = ({ open, onClose, data }) => {
  const handleClose = () => {
    onClose();
  };

  const handleRemove = () => {
    // Handle remove button click
    console.log(data)
    console.log('Remove button clicked');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogContent>
        <TextField label="Title" fullWidth />
        <TextField label="Service ID" fullWidth />
        <TextField label="Description" fullWidth />
        <TextField label="Serve Size" fullWidth />
        <TextField label="Active" fullWidth />
      </DialogContent>
      <DialogActions>
        <Button startIcon={<DeleteIcon />} onClick={handleRemove}>
          Remove
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RService;
