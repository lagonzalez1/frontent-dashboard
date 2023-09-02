import React, {useEffect, useState} from 'react';
import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function DateSelect({set}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Today');

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
        <Button sx={{backgroundColor: 'white'}} startIcon={<CalendarTodayIcon fontSize='xs'/>} onClick={handleClick}>{selectedOption}</Button>
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
        <MenuItem onClick={() => handleOptionSelect('Today')}>Today</MenuItem>
        <MenuItem onClick={() => handleOptionSelect('Last 24 hours')}>Last 24 hours</MenuItem>
        <MenuItem onClick={() => handleOptionSelect('Last 7 days')}>Last 7 days</MenuItem>
        <MenuItem onClick={() => handleOptionSelect('Last 30 days')}>Last 30 days</MenuItem>
        <MenuItem onClick={() => handleOptionSelect('Yesterday')}>Yesterday</MenuItem>
        <MenuItem onClick={() => handleOptionSelect('Last week')}>Last week</MenuItem>
        <MenuItem onClick={() => handleOptionSelect('This month')}>This month</MenuItem>
        <MenuItem onClick={() => handleOptionSelect('Last month')}>Last month</MenuItem>
        <MenuItem onClick={() => handleOptionSelect('This year')}>This year</MenuItem>
        <MenuItem onClick={() => handleOptionSelect('All time')}>All time</MenuItem>
      </Menu>
    </div>
  );
};
