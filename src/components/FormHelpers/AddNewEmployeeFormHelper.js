import axios from "axios";
import { getAccessToken, getHeaders, getStateData } from "../../auth/Auth";


export const getEmployeeImageRef = () => {
    const { user, business} = getStateData();
    let li = []
    let employees = business.employees;
    for ( var employee of employees) {
        if (employee.image_path !== null){ li.push(employee.image_path); continue; }
    }
    return li;
}



export const requestProfileImages = async (ids) => {
    const { user, business} = getStateData();
    const accessToken = getAccessToken();
    const email = user.email;
    const requests = ids.map(id => axios.get(`/api/internal/get_employee_images`,{headers: {'x-access-token': accessToken}, params: {id}, timeout: 90000, timeoutErrorMessage: 'Timeout error.'}) );
    try {
        const responses = await axios.all(requests);
        const images = responses.map(response => response.data);
        return images;
    }
    catch(error) {
        console.log(error);
        if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
            reject('Request timed out. Please try again later.'); // Handle timeout error
        }
        if (error.response) {
            console.log(error.response);
            reject({msg: 'Response error', error: error.response});
        }
        else if (error.request){
            console.log(error.request);
            reject({msg: 'No response from server', error: error.request})
        }
        else {
            reject({msg: 'Request setup error', error: error.message})
        }
    }
}


/**
 *  IF payload includes _id then we treat the backedn to edit a current employee.
 *  ELSE new request.
 * @param {Object} payload 
 * @returns 
 * Middleware OK
 */
export const requestEmployeeAdd = (formData, config) => {
    return new Promise((resolve, reject) => {
        
        axios.post('/api/internal/add_employee', formData, {...config, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
                reject('Request timed out. Please try again later.'); // Handle timeout error
            }
            if (error.response) {
                console.log(error.response);
                reject({msg: 'Response error', error: error.response});
            }
            else if (error.request){
                console.log(error.request);
                reject({msg: 'No response from server', error: error.request})
            }
            else {
                reject({msg: 'Request setup error', error: error.message})
            }
            
        })
    })
} 
// * Middleware OK
export const requestEmployeeEdit = (formData, config) => {
    return new Promise((resolve, reject) => {
        const { user, business} = getStateData();
        const b_id = business._id;
        //const headers = getHeaders();
        //const data = { payload: {...payload}, b_id, email: user.email}
        axios.post('/api/internal/edit_employee', formData, {...config, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
                reject('Request timed out. Please try again later.'); // Handle timeout error
            }
            if (error.response) {
                console.log(error.response);
                reject({msg: 'Response error', error: error.response});
            }
            else if (error.request){
                console.log(error.request);
                reject({msg: 'No response from server', error: error.request})
            }
            else {
                reject({msg: 'Request setup error', error: error.message})
            }
            
        })
    })
} 

/**
 *  IF payload includes _id then we treat the backedn to edit a current employee.
 *  ELSE new request.
 * @param {Object} payload 
 * @returns 
 *  * Middleware OK

 */
export const requestRemoveEmployee = (employeeId) => {
    return new Promise((resolve, reject) => {
        const { user, business} = getStateData();
        const b_id = business._id;
        const headers = getHeaders();
        const data = { employeeId, b_id, email: user.email}
        axios.post('/api/internal/remove_employee', data, {...headers, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
                reject('Request timed out. Please try again later.'); // Handle timeout error
            }
            if (error.response) {
                console.log(error.response);
                reject({msg: 'Response error', error: error.response});
            }
            else if (error.request){
                console.log(error.request);
                reject({msg: 'No response from server', error: error.request})
            }
            else {
                reject({msg: 'Request setup error', error: error.message})
            }
            
        })
    })
} 


/**
 *  IF payload includes _id then we treat the backedn to edit a current employee.
 *  ELSE new request.
 * @param {Object} payload 
 * @returns 
 *  * Middleware OK

 */
export const requestBlockEmployee = (payload) => {
    return new Promise((resolve, reject) => {
        const { user, business} = getStateData();
        const b_id = business._id;
        const headers = getHeaders();
        const data = { ...payload, b_id, email: user.email}
        axios.post('/api/internal/block_employee', data, {...headers, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            resolve(response.data.msg);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
                reject('Request timed out. Please try again later.'); // Handle timeout error
            }
            if (error.response) {
                console.log(error.response);
                reject({msg: 'Response error', error: error.response});
            }
            else if (error.request){
                console.log(error.request);
                reject({msg: 'No response from server', error: error.request})
            }
            else {
                reject({msg: 'Request setup error', error: error.message})
            }
            
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