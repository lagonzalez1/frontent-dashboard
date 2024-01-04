import axios from "axios";
import { getHeaders, getStateData } from "../../auth/Auth";

/**
 *  IF payload includes _id then we treat the backedn to edit a current employee.
 *  ELSE new request.
 * @param {Object} payload 
 * @returns 
 */
export const requestEmployeeAdd = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business} = getStateData();
        const b_id = business._id;
        const headers = getHeaders();
        const data = { payload: {...payload}, b_id}
        axios.post('/api/internal/add_employee', data, headers)
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            reject(error.response.data);
        })


    })
} 

export const requestEmployeeEdit = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business} = getStateData();
        const b_id = business._id;
        const headers = getHeaders();
        const data = { payload: {...payload}, b_id}
        axios.post('/api/internal/edit_employee', data, headers)
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            reject(error.response.data);
        })


    })
} 

/**
 *  IF payload includes _id then we treat the backedn to edit a current employee.
 *  ELSE new request.
 * @param {Object} payload 
 * @returns 
 */
export const requestRemoveEmployee = (employeeId) => {
    return new Promise((resolve, reject) => {
        const { user, business} = getStateData();
        const b_id = business._id;
        const headers = getHeaders();
        const data = { employeeId, b_id}
        axios.post('/api/internal/remove_employee', data, headers)
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            reject(error.response.data);
        })


    })
} 


/**
 *  IF payload includes _id then we treat the backedn to edit a current employee.
 *  ELSE new request.
 * @param {Object} payload 
 * @returns 
 */
export const requestBlockEmployee = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business} = getStateData();
        const b_id = business._id;
        const headers = getHeaders();
        const data = { ...payload, b_id}
        axios.post('/api/internal/block_employee', data, headers)
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            reject(error.response.data);
        })


    })
} 


export const permissionLevel = [
    {
        title: 'Root',
        desc: 'complete access to make changes',
        value: 0
    },
    {
        title: 'Managment',
        desc: 'Allow user to edit, resources, services, employees, settings.',
        value: 1
    },
    {
        title: 'Employee 1',
        desc: 'Allow user to create appointments and serve clients.',
        value: 2
    },
    {
        title: 'Employee 2',
        desc: 'Allow user to serve clients.',
        value: 3
    }
]