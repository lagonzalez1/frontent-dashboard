import axios from "axios";
import { getHeaders, getStateData } from "../../auth/Auth";
import business from "../../reducers/business";

/**
 *  IF payload includes _id then we treat the backedn to edit a current employee.
 *  ELSE new request.
 * @param {Object} payload 
 * @returns 
 */
export const requestEmployeeChange = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business} = getStateData();
        const b_id = business._id;
        const headers = getHeaders();
        const data = { payload: {...payload}, b_id}
        axios.post('/api/internal/add_edit_employee', data, headers)
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