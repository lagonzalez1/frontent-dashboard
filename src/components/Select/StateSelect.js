import React, { useState, useEffect} from 'react';
import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material';

export default function DateSelect({set}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState('all');

  useEffect(() => {
    set(selectedOption);
  }, [])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    set(option)
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
        <MenuItem onClick={() => handleOptionSelect('all')}>Any status</MenuItem>
        <MenuItem onClick={() => handleOptionSelect('flag')}>Flag</MenuItem>
        <MenuItem onClick={() => handleOptionSelect('no-show')}>No show</MenuItem>

      </Menu>
    </div>
  );
};
