import axios from "axios"



// Return the acceptance of both waittime and appointments
// Also checks for closedDate range {start and end} for waitlist
export const isBusinesssOpen = (link, time) => {   
  return new Promise((resolve, reject) => {
    axios.get('/api/external/isBusinessOpen', { params: {link, time}})
    .then((response) => {
      resolve(response.data);
    })
    .catch(error => {
      console.log(error);
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
    axios.get('/api/external/businessPresentables', {params: {link, time}})
    .then(response => {
      resolve(response.data);
    })
    .catch(error => {
      console.log(error);
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
      axios
        .get('/api/external/businessState', { params: { link, time } })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  
  export const getAvailableAppointments = (payload) => {
    return new Promise((resolve, reject) => {
        const data = { ...payload}
        axios.post('/api/external/available_appointments',data)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
          console.log(error);
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
        .get('/api/external/employeeList', { params: { link, date } })
        .then((response) => {
          if (response.status === 200){
            resolve(response.data.employees);
          }
          resolve(response.data.msg);
        })
        .catch(error => {
          console.log(error);
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
      .get('/api/external/businessExtras', { params: {link, date} })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      })
    })
  }

  

  export const requestBusinessArguments = (link) => {
    return new Promise((resolve, reject) => {
        axios.get(`/api/external/businessArgs`, {params: {link}})
        .then(response => {
            console.log(response);
            resolve(response.data.payload);
        }) 
        .catch(error => {
            reject(error);
        })
    })
  }

  export const requestBusinessSchedule = (link) => {
    return new Promise((resolve, reject) => {
        axios.get(`/api/external/businessSchedule`, {params: {link}})
        .then(response => {
            console.log(response);
            resolve(response.data);
        }) 
        .catch(error => {
          console.log(error);
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
      .get('/api/external/serveMax', { params: {link} })
      .then((response) => {
        resolve(response.data);
      })
      .catch(error => {
        console.log(error);
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
      .get('/api/external/serveMax', { params: {link} })
      .then((response) => {
        resolve(response.data);
      })
      .catch(error => {
        console.log(error);
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
      .get('/api/external/businessForm', { params: {link} })
      .then((response) => {
        resolve(response.data);
      })
      .catch(error => {
        console.log(error);
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
      axios.post('/api/external/waitlistRequest', payload)
      .then((res) => {
        resolve(res.data);
      })
      .catch(error => {
        console.log(error);
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
      .post('/api/external/checkDuplicates', payload )
      .then((response) => {
        resolve(response.data);
      })
      .catch(error => {
        console.log(error);
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
  


  

