


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


/**
 * 
 * @param {*}   object              Object  need to be checked for empty values
 * @returns {status, array}         False: No mossing values,
 *                                  True: Missing values to address on the front end.
 */
export function checkObjectData (object) {
    let missing = []
    Object.keys(object).forEach( (key) => {
        if (object[key] === '' || object[key] === [] || object[key] === {}){
            missing.push(key);
        }
    })
    return {status: missing.length === 0 ? false : true, missing: missing };
}