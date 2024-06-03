import axios from "axios";

let GET_BUSINESS_OPEN = '/api/external/isBusinessOpen';
let GET_BUSINESS_PRESENTABLE ='/api/external/businessPresentables'
let GET_BUSINESS_STATE = '/api/external/businessState'
let GET_EMPLOYEE_LIST = '/api/external/employeeList'
let GET_BUISNESS_EXTRAS = '/api/external/businessExtras';
let GET_BUSINESS_ARGS = `/api/external/businessArgs`
let GET_BUSINESS_SCHEDULE = `/api/external/businessSchedule`;
let GET_SERVE_MAX = '/api/external/serveMax'
let GET_BUSINESS_FORM = '/api/external/businessForm';
let GET_TIMEZONE = '/api/external/businessTimezone';

let POST_WAITLIST_REQUEST = '/api/external/waitlistRequest';
let POST_CHECK_DUP = '/api/external/checkDuplicates';
let POST_AVAILABLE_APPOINTMENTS = '/api/external/available_appointments'

// Return the acceptance of both waittime and appointments
// Also checks for closedDate range {start and end} for waitlist
export const isBusinesssOpen = (link, time) => {  
   
  return new Promise((resolve, reject) => {
    axios.get(GET_BUSINESS_OPEN, { params: {link, time}, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
    .then((response) => {
      resolve(response.data);
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

export const getBusinessPresent = (link, time) => {
  return new Promise((resolve, reject) => {
    axios.get(GET_BUSINESS_PRESENTABLE, {params: {link, time}, timeout: 9000, timeoutErrorMessage: 'Timeout error'})
    .then(response => {
      resolve(response.data);
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


export const allowClientJoin = (time,link) => {
    return new Promise((resolve, reject) => {
      axios.get(GET_BUSINESS_STATE, { params: { link, time }, timeout: 90000, timeoutErrorMessage: 'Timeout error' })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          if (error.code === 'ECONNABORTED' && error.message === 'Timeout error') {
            reject('Request timed out. Please try again later.'); // Handle timeout error
          }
          reject(error);
        });
    });
};
  
export const getAvailableAppointments = (payload) => {
    return new Promise((resolve, reject) => {
        const data = { ...payload}
        axios.post(POST_AVAILABLE_APPOINTMENTS,data, {timeout: 90000, timeoutErrorMessage: 'Timeout error'})
        .then(response => {
            resolve(response.data);
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

export const findServicesAssociatedWithEmployee = (id, services) => {
    const collection = [];
    for (var service of services){
      if (service._id === id){
        collection.push(service)
      }
    }
    return collection;
}

export const getEmployeeList = (date,link) => {
  return new Promise((resolve, reject) => {
    axios
      .get(GET_EMPLOYEE_LIST, { params: { link, date }, timeout: 90000, timeoutErrorMessage: 'Timeout error' })
      .then((response) => {
        if (response.status === 200){
          resolve(response.data.employees);
        }
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
  });
};


export const getExtras = (link, date) => {
    return new Promise((resolve, reject) => {
      axios
      .get(GET_BUISNESS_EXTRAS, { params: {link, date}, timeout: 90000, timeoutErrorMessage:'Timeout error' })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
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

export const requestBusinessArguments = (link) => {
  return new Promise((resolve, reject) => {
      axios.get(GET_BUSINESS_ARGS, {params: {link}, timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
      .then(response => {
          console.log(response);
          resolve(response.data.payload);
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

export const requestBusinessSchedule = (link) => {
  return new Promise((resolve, reject) => {
      axios.get(GET_BUSINESS_SCHEDULE, {params: {link}, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
      .then(response => {
          console.log(response);
          resolve(response.data);
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

export const getBusinessServeMax = (link) => {
  return new Promise((resolve, reject) => {
    axios
    .get(GET_SERVE_MAX, { params: {link}, timeout:90000, timeoutErrorMessage: 'Timeout Error.' })
    .then((response) => {
      resolve(response.data);
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

export const getMax = (link) => {
  return new Promise((resolve, reject) => {
    axios
    .get(GET_SERVE_MAX, { params: {link}, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
    .then((response) => {
      resolve(response.data);
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

export const getBusinessForm = (link) => {
  return new Promise((resolve, reject) => {
    axios
    .get(GET_BUSINESS_FORM, { params: {link}, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
    .then((response) => {
      resolve(response.data);
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

export const getBusinessTimezone = (link) => {
  return new Promise((resolve, reject) => {
    axios.get(GET_TIMEZONE, { params: {link}, timeout: 90000, timeoutErrorMessage: 'Timeout error'})
    .then((res) => {
      resolve(res.data);
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

export const waitlistRequest = (payload) => {
  return new Promise((resolve, reject) => {
    axios.post(POST_WAITLIST_REQUEST, payload, {timeout: 90000, timeoutErrorMessage: 'Timeout error'})
    .then((res) => {
      resolve(res.data);
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

export const checkDuplicatesRequest = (payload) => {
  return new Promise((resolve, reject) => {
    axios
    .post(POST_CHECK_DUP, payload, {timeout: 90000, timeoutErrorMessage: 'Timeout error'})
    .then((response) => {
      resolve(response.data);
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
  


  

