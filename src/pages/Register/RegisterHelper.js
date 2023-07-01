import axios, { AxiosError } from 'axios';
import { IANAZone, DateTime } from "luxon";



/**
 * 
 * @returns The current timezone by the user browser. 
 */
export const getTimeZone = () => {
    return DateTime.local().zoneName;
}

export const getTimestamp = () => {
    return DateTime.local().toString();
}


/**
 * 
 * @param {RegisterData} object     Object key value
 * @returns FormData(RegisterData)  formData represented by the incoming object.
 */
export function getFormData (object) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}


export const getCountries = (lang = 'en') => {
    const A = 65
    const Z = 90
    const countryName = new Intl.DisplayNames([lang], { type: 'region' });
    let countries = {}
    for(let i=A; i<=Z; ++i) {
        for(let j=A; j<=Z; ++j) {
            let code = String.fromCharCode(i) + String.fromCharCode(j)
            let name = countryName.of(code)
            if (code !== name) {
                countries[code] = name
            }
        }
    }
    return countries
}

/**
 * 
 * @param {*}   object              Object  need to be checked for empty values
 * @returns {status, array}         False: No missing values,
 *                                  True: Missing values to address on the front end.
 */
export function checkObjectData (object) {
    let missing = {}
    let status = false;
    Object.keys(object).forEach( (key) => {
        if (object[key] === '' || object[key] === {}){
            missing[key] = true;
            status = true;
        }else {
            missing[key] = false;
        }
    })
    return {status: status, missing: missing };
}


/**
     * 
     * @returns a promise resolve (Boolean)
     *          a promise reject (String)
     */

export const checkPublicLink = (publicLink) => {
  return new Promise((resolve, reject) => {
    axios
      .get('/api/external/unique_link/' + publicLink)
      .then((response) => {
        resolve(response); // Return response data instead of the entire response
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a non-success status code
          reject(`Error: ${error.response.data}`);
        } else if (error.request) {
          // The request was made but no response was received
          reject('No response received from the server.');
        } else {
          // Something happened in setting up the request
          reject('Error occurred while making the request.');
        }
      });
  });
}

