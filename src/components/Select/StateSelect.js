import React, { useState, useEffect} from 'react';
import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material';

export default function DateSelect() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState('any-status');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    handleClose();
  };

  return (
    <div>
      <ButtonGroup aria-label="outlined primary button group">
        <Button sx={{backgroundColor: 'white'}} onClick={handleClick}>{selectedOption}</Button>
        <Button sx={{backgroundColor: 'white'}} onClick={handleClick} size="small">
          &#9662;
        </Button>
      </ButtonGroup>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleOptionSelect('any-status')}>Any status</MenuItem>
        <MenuItem onClick={() => handleOptionSelect('serving')}>Serving</MenuItem>
        <MenuItem onClick={() => handleOptionSelect('completed')}>Completed</MenuItem>
        <MenuItem onClick={() => handleOptionSelect('flagged')}>Flag</MenuItem>
        <MenuItem onClick={() => handleOptionSelect('no-show ')}>No show</MenuItem>

      </Menu>
    </div>
  );
};
