import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { findEmployee } from '../hooks/hooks';

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
    const userPermissions = useSelector((state) => state.user.permissions);
    const signOnEmail = useSelector((state) => state.user.email);
    let permissions = {
        0: ['SETTINGS', 'EMP_CHANGE', 'SERV_CHANGE', 'RESO_CHANGE', 'CUST_REMOVAL','RESO_DEL', 'SERV_DEL', 'OPEN_LOCK', 'LOC_URL','PERS_IMG', 'BUSI_FIELDS',
        'HOUR_TZ', 'HOUR_OPEN_HR', 'HOUR_CLOSE_DEL', 'SYSTEM', 'NOTI_SETTINGS','CLIENT_REMOVAL', 'CLIENT_EDIT', 'EMPL_ATTACH',
        'BUSI_INFO', 'EMPL_REMOVE', 'EMPL_ADD', 'EMPL_EDIT' ,'CLIENT_SIGNU', 'CLIENT_FORM' , 'PAY_CHANGE', 'EMPL_DETACH', 'SERV_ADD', 'RESO_ADD', 'DEL_BUSI'],
        1: ['SETTINGS', 'EMP_CHANGE', 'SERV_CHANGE', 'RESO_CHANGE', 'RESO_DEL', 'SERV_DEL', 'CUST_REMOVAL', 'OPEN_LOCK', 'PERS_IMG', 'EMPL_ATTACH','BUSI_FIELDS',
        'HOUR_OPEN_HR', 'HOUR_CLOSE_DEL', 'SYSTEM', 'NOTI_SETTINGS','EMPL_EDIT' ,'EMPL_REMOVE', 'EMPL_ADD', 'CLIENT_SIGNU', 'CLIENT_FORM', 'EMPL_DETACH',
         'SERV_ADD', 'RESO_ADD'],
        2: ['CLIENT_REMOVAL', 'CLIENT_EDIT', 'SERVE'],
        3: ['CLIENT_REMOVAL', 'SERVE']
    }

    const checkPermission = (requiredPermission) => {
        return permissions[userPermissions].includes(requiredPermission);
    };

    const canEmployeeEdit = (id, requiredPermission) => {
        const isEmployee = findEmployee(id); // Employee can delete its own request
        if (signOnEmail === isEmployee.employeeUsername) { return true; }
        if (permissions[userPermissions].includes(requiredPermission)) { return true;} // Override for 0, 1
        return false; // Otherwise deny
    }   


    return (
        <PermissionContext.Provider value={{ checkPermission, canEmployeeEdit }}>
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermission = () => {
  return useContext(PermissionContext);
};
