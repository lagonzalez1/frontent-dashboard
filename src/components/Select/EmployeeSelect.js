import React, {useEffect, useState} from 'react';
import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { getEmployeeList } from '../../hooks/hooks';

export default function EmployeeSelect({set}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Employees');
  const employeeList = getEmployeeList();

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
    setSelectedOption(option.fullname);
    set(option._id)
    handleClose();
  };

  return (
    <div>
  <ButtonGroup aria-label="outlined primary button group">
    <Button sx={{ backgroundColor: 'white' }} startIcon={<CalendarTodayIcon fontSize='xs'/>} onClick={handleClick}>
      {selectedOption}
    </Button>
    <Button sx={{ backgroundColor: 'white' }} onClick={handleClick} size="small">
      &#9662;
    </Button>
  </ButtonGroup>
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleClose}
    MenuListProps={{ 'aria-labelledby': 'basic-button' }}
  > 
    
    {employeeList && employeeList.map((employee, index) => (
      <MenuItem key={index} onClick={() => handleOptionSelect(employee)}>
        {employee.fullname}
      </MenuItem>
    ))}
  </Menu>
</div>

  );
};
