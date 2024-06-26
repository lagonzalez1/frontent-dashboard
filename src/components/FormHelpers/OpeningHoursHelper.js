import * as Yup from 'yup';
import { getAccessToken, getStateData } from '../../auth/Auth';
import axios from 'axios';
import React from 'react';
import { Slide } from '@mui/material';

export const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const DAYOFWEEK = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday'}

export const requestTimezoneChange = (timezone, bid, email) => {
  return new Promise((resolve, reject) => {
      axios.put('/api/internal/update_timezone', {timezone, b_id: bid, email}, { timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
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

export const requestRemoveCloseDate = (dateId, bid, email) => {
  return new Promise((resolve, reject) => {

      axios.put('/api/internal/remove_close_date', {dateId, b_id: bid, email}, { timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
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


export const requestScheduleChange = (payload, bid, email) => {
  return new Promise((resolve, reject) => {
      const schedule = {...payload}
      axios.put('/api/internal/update_schedule', {schedule, b_id: bid, email}, { timeout: 90000, timeoutErrorMessage: 'Timeout error.'})
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


export const requestClosedDate = (date, employeeId, start, end, bid, email) => {
  return new Promise((resolve, reject) => {
      axios.put('/api/internal/insert_closed_date', {date, b_id: bid, email, employeeId, start, end, }, { timeout: 90000, timeoutErrorMessage: 'Timeout error'})
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

// Nov 2 12:53
// @params [DateTime, DateTime]

export const validateTimerange = (selectedDate, start, end, schedule) => {
  if (!start || !end) { return false; }
  const selectedDayOfWeek = selectedDate.weekday;
  const KEY = DAYOFWEEK[selectedDayOfWeek];
  const scheduledStart = schedule[KEY].start;
  const scheduledEnd = schedule[KEY].end;
  const isStartTimeConsistent = start >= scheduledStart && start <= scheduledEnd;
  const isEndTimeConsistent = end <= scheduledEnd && end >= scheduledStart;
  return isStartTimeConsistent && isEndTimeConsistent;
}

const initialValuesSchedule = {
  Monday: {
    start: '',
    end: '',
  },
  Tuesday: {
    start: '',
    end: '',
  },
  Wednesday: {
    start: '',
    end: '',
  },
  Thursday: {
    start: '',
    end: '',
  },
  Friday: {
    start: '',
    end: '',
  },
  Saturday: {
    start: '',
    end: '',
  },
  Sunday: {
    start: '',
    end: '',
  },
  // ... repeat for other days of the week
};

export const validationSchemaTimezone = Yup.object().shape({
  timezone: Yup.string().required('Timezone is required'),
});


export const validationSchemaSchedule = Yup.object().shape({
  Monday: Yup.object().shape({
    start: Yup.string().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').nullable()
    .test('is-less-than-end', 'Start time must be less than end time', function (value) {
      const { end } = this.parent;
      if (!value || !end) {
        // If either start or end is not set, do not perform the validation
        return true;
      }
      const startTime = new Date(`1970-01-01T${value}:00`);
      const endTime = new Date(`1970-01-01T${end}:00`);
      return startTime < endTime;
    }),
    end: Yup.string().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').nullable(),
  }),
  Tuesday: Yup.object().shape({
    start: Yup.string().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').nullable()
    .test('is-less-than-end', 'Start time must be less than end time', function (value) {
      const { end } = this.parent;
      if (!value || !end) {
        // If either start or end is not set, do not perform the validation
        return true;
      }
      const startTime = new Date(`1970-01-01T${value}:00`);
      const endTime = new Date(`1970-01-01T${end}:00`);
      return startTime < endTime;
    }),
    end: Yup.string().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').nullable(),
  }),
  Wednesday: Yup.object().shape({
    start: Yup.string().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').nullable()
    .test('is-less-than-end', 'Start time must be less than end time', function (value) {
      const { end } = this.parent;
      if (!value || !end) {
        // If either start or end is not set, do not perform the validation
        return true;
      }
      const startTime = new Date(`1970-01-01T${value}:00`);
      const endTime = new Date(`1970-01-01T${end}:00`);
      return startTime < endTime;
    }),
    end: Yup.string().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').nullable(),
  }),
  Thursday: Yup.object().shape({
    start: Yup.string().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').nullable()
    .test('is-less-than-end', 'Start time must be less than end time', function (value) {
      const { end } = this.parent;
      if (!value || !end) {
        // If either start or end is not set, do not perform the validation
        return true;
      }
      const startTime = new Date(`1970-01-01T${value}:00`);
      const endTime = new Date(`1970-01-01T${end}:00`);
      return startTime < endTime;
    }),
    end: Yup.string().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').nullable(),
  }),
  Friday: Yup.object().shape({
    start: Yup.string().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').nullable()
    .test('is-less-than-end', 'Start time must be less than end time', function (value) {
      const { end } = this.parent;
      if (!value || !end) {
        // If either start or end is not set, do not perform the validation
        return true;
      }
      const startTime = new Date(`1970-01-01T${value}:00`);
      const endTime = new Date(`1970-01-01T${end}:00`);
      return startTime < endTime;
    }),
    end: Yup.string().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').nullable(),
  }),
  Saturday: Yup.object().shape({
    start: Yup.string().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').nullable()
    .test('is-less-than-end', 'Start time must be less than end time', function (value) {
      const { end } = this.parent;
      if (!value || !end) {
        // If either start or end is not set, do not perform the validation
        return true;
      }
      const startTime = new Date(`1970-01-01T${value}:00`);
      const endTime = new Date(`1970-01-01T${end}:00`);
      return startTime < endTime;
    }),
    end: Yup.string().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').nullable(),
  }),
  Sunday: Yup.object().shape({
    start: Yup.string().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').nullable()
    .test('is-less-than-end', 'Start time must be less than end time', function (value) {
      const { end } = this.parent;
      if (!value || !end) {
        // If either start or end is not set, do not perform the validation
        return true;
      }
      const startTime = new Date(`1970-01-01T${value}:00`);
      const endTime = new Date(`1970-01-01T${end}:00`);
      return startTime < endTime;
    }),
    end: Yup.string().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').nullable(),
  }),
  // ... repeat for other days of the week
});

export var TIMEZONES = [
    'Europe/Andorra',
    'Asia/Dubai',
    'Asia/Kabul',
    'Europe/Tirane',
    'Asia/Yerevan',
    'Antarctica/Casey',
    'Antarctica/Davis',
    'Antarctica/DumontDUrville', // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
    'Antarctica/Mawson',
    'Antarctica/Palmer',
    'Antarctica/Rothera',
    'Antarctica/Syowa',
    'Antarctica/Troll',
    'Antarctica/Vostok',
    'America/Argentina/Buenos_Aires',
    'America/Argentina/Cordoba',
    'America/Argentina/Salta',
    'America/Argentina/Jujuy',
    'America/Argentina/Tucuman',
    'America/Argentina/Catamarca',
    'America/Argentina/La_Rioja',
    'America/Argentina/San_Juan',
    'America/Argentina/Mendoza',
    'America/Argentina/San_Luis',
    'America/Argentina/Rio_Gallegos',
    'America/Argentina/Ushuaia',
    'Pacific/Pago_Pago',
    'Europe/Vienna',
    'Australia/Lord_Howe',
    'Antarctica/Macquarie',
    'Australia/Hobart',
    'Australia/Currie',
    'Australia/Melbourne',
    'Australia/Sydney',
    'Australia/Broken_Hill',
    'Australia/Brisbane',
    'Australia/Lindeman',
    'Australia/Adelaide',
    'Australia/Darwin',
    'Australia/Perth',
    'Australia/Eucla',
    'Asia/Baku',
    'America/Barbados',
    'Asia/Dhaka',
    'Europe/Brussels',
    'Europe/Sofia',
    'Atlantic/Bermuda',
    'Asia/Brunei',
    'America/La_Paz',
    'America/Noronha',
    'America/Belem',
    'America/Fortaleza',
    'America/Recife',
    'America/Araguaina',
    'America/Maceio',
    'America/Bahia',
    'America/Sao_Paulo',
    'America/Campo_Grande',
    'America/Cuiaba',
    'America/Santarem',
    'America/Porto_Velho',
    'America/Boa_Vista',
    'America/Manaus',
    'America/Eirunepe',
    'America/Rio_Branco',
    'America/Nassau',
    'Asia/Thimphu',
    'Europe/Minsk',
    'America/Belize',
    'America/St_Johns',
    'America/Halifax',
    'America/Glace_Bay',
    'America/Moncton',
    'America/Goose_Bay',
    'America/Blanc-Sablon',
    'America/Toronto',
    'America/Nipigon',
    'America/Thunder_Bay',
    'America/Iqaluit',
    'America/Pangnirtung',
    'America/Atikokan',
    'America/Winnipeg',
    'America/Rainy_River',
    'America/Resolute',
    'America/Rankin_Inlet',
    'America/Regina',
    'America/Swift_Current',
    'America/Edmonton',
    'America/Cambridge_Bay',
    'America/Yellowknife',
    'America/Inuvik',
    'America/Creston',
    'America/Dawson_Creek',
    'America/Fort_Nelson',
    'America/Vancouver',
    'America/Whitehorse',
    'America/Dawson',
    'Indian/Cocos',
    'Europe/Zurich',
    'Africa/Abidjan',
    'Pacific/Rarotonga',
    'America/Santiago',
    'America/Punta_Arenas',
    'Pacific/Easter',
    'Asia/Shanghai',
    'Asia/Urumqi',
    'America/Bogota',
    'America/Costa_Rica',
    'America/Havana',
    'Atlantic/Cape_Verde',
    'America/Curacao',
    'Indian/Christmas',
    'Asia/Nicosia',
    'Asia/Famagusta',
    'Europe/Prague',
    'Europe/Berlin',
    'Europe/Copenhagen',
    'America/Santo_Domingo',
    'Africa/Algiers',
    'America/Guayaquil',
    'Pacific/Galapagos',
    'Europe/Tallinn',
    'Africa/Cairo',
    'Africa/El_Aaiun',
    'Europe/Madrid',
    'Africa/Ceuta',
    'Atlantic/Canary',
    'Europe/Helsinki',
    'Pacific/Fiji',
    'Atlantic/Stanley',
    'Pacific/Chuuk',
    'Pacific/Pohnpei',
    'Pacific/Kosrae',
    'Atlantic/Faroe',
    'Europe/Paris',
    'Europe/London',
    'Asia/Tbilisi',
    'America/Cayenne',
    'Africa/Accra',
    'Europe/Gibraltar',
    'America/Godthab',
    'America/Danmarkshavn',
    'America/Scoresbysund',
    'America/Thule',
    'Europe/Athens',
    'Atlantic/South_Georgia',
    'America/Guatemala',
    'Pacific/Guam',
    'Africa/Bissau',
    'America/Guyana',
    'Asia/Hong_Kong',
    'America/Tegucigalpa',
    'America/Port-au-Prince',
    'Europe/Budapest',
    'Asia/Jakarta',
    'Asia/Pontianak',
    'Asia/Makassar',
    'Asia/Jayapura',
    'Europe/Dublin',
    'Asia/Jerusalem',
    'Asia/Kolkata',
    'Indian/Chagos',
    'Asia/Baghdad',
    'Asia/Tehran',
    'Atlantic/Reykjavik',
    'Europe/Rome',
    'America/Jamaica',
    'Asia/Amman',
    'Asia/Tokyo',
    'Africa/Nairobi',
    'Asia/Bishkek',
    'Pacific/Tarawa',
    'Pacific/Enderbury',
    'Pacific/Kiritimati',
    'Asia/Pyongyang',
    'Asia/Seoul',
    'Asia/Almaty',
    'Asia/Qyzylorda',
    'Asia/Qostanay', // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
    'Asia/Aqtobe',
    'Asia/Aqtau',
    'Asia/Atyrau',
    'Asia/Oral',
    'Asia/Beirut',
    'Asia/Colombo',
    'Africa/Monrovia',
    'Europe/Vilnius',
    'Europe/Luxembourg',
    'Europe/Riga',
    'Africa/Tripoli',
    'Africa/Casablanca',
    'Europe/Monaco',
    'Europe/Chisinau',
    'Pacific/Majuro',
    'Pacific/Kwajalein',
    'Asia/Yangon',
    'Asia/Ulaanbaatar',
    'Asia/Hovd',
    'Asia/Choibalsan',
    'Asia/Macau',
    'America/Martinique',
    'Europe/Malta',
    'Indian/Mauritius',
    'Indian/Maldives',
    'America/Mexico_City',
    'America/Cancun',
    'America/Merida',
    'America/Monterrey',
    'America/Matamoros',
    'America/Mazatlan',
    'America/Chihuahua',
    'America/Ojinaga',
    'America/Hermosillo',
    'America/Tijuana',
    'America/Bahia_Banderas',
    'Asia/Kuala_Lumpur',
    'Asia/Kuching',
    'Africa/Maputo',
    'Africa/Windhoek',
    'Pacific/Noumea',
    'Pacific/Norfolk',
    'Africa/Lagos',
    'America/Managua',
    'Europe/Amsterdam',
    'Europe/Oslo',
    'Asia/Kathmandu',
    'Pacific/Nauru',
    'Pacific/Niue',
    'Pacific/Auckland',
    'Pacific/Chatham',
    'America/Panama',
    'America/Lima',
    'Pacific/Tahiti',
    'Pacific/Marquesas',
    'Pacific/Gambier',
    'Pacific/Port_Moresby',
    'Pacific/Bougainville',
    'Asia/Manila',
    'Asia/Karachi',
    'Europe/Warsaw',
    'America/Miquelon',
    'Pacific/Pitcairn',
    'America/Puerto_Rico',
    'Asia/Gaza',
    'Asia/Hebron',
    'Europe/Lisbon',
    'Atlantic/Madeira',
    'Atlantic/Azores',
    'Pacific/Palau',
    'America/Asuncion',
    'Asia/Qatar',
    'Indian/Reunion',
    'Europe/Bucharest',
    'Europe/Belgrade',
    'Europe/Kaliningrad',
    'Europe/Moscow',
    'Europe/Simferopol',
    'Europe/Kirov',
    'Europe/Astrakhan',
    'Europe/Volgograd',
    'Europe/Saratov',
    'Europe/Ulyanovsk',
    'Europe/Samara',
    'Asia/Yekaterinburg',
    'Asia/Omsk',
    'Asia/Novosibirsk',
    'Asia/Barnaul',
    'Asia/Tomsk',
    'Asia/Novokuznetsk',
    'Asia/Krasnoyarsk',
    'Asia/Irkutsk',
    'Asia/Chita',
    'Asia/Yakutsk',
    'Asia/Khandyga',
    'Asia/Vladivostok',
    'Asia/Ust-Nera',
    'Asia/Magadan',
    'Asia/Sakhalin',
    'Asia/Srednekolymsk',
    'Asia/Kamchatka',
    'Asia/Anadyr',
    'Asia/Riyadh',
    'Pacific/Guadalcanal',
    'Indian/Mahe',
    'Africa/Khartoum',
    'Europe/Stockholm',
    'Asia/Singapore',
    'America/Paramaribo',
    'Africa/Juba',
    'Africa/Sao_Tome',
    'America/El_Salvador',
    'Asia/Damascus',
    'America/Grand_Turk',
    'Africa/Ndjamena',
    'Indian/Kerguelen',
    'Asia/Bangkok',
    'Asia/Dushanbe',
    'Pacific/Fakaofo',
    'Asia/Dili',
    'Asia/Ashgabat',
    'Africa/Tunis',
    'Pacific/Tongatapu',
    'Europe/Istanbul',
    'America/Port_of_Spain',
    'Pacific/Funafuti',
    'Asia/Taipei',
    'Europe/Kiev',
    'Europe/Uzhgorod',
    'Europe/Zaporozhye',
    'Pacific/Wake',
    'America/New_York',
    'America/Detroit',
    'America/Kentucky/Louisville',
    'America/Kentucky/Monticello',
    'America/Indiana/Indianapolis',
    'America/Indiana/Vincennes',
    'America/Indiana/Winamac',
    'America/Indiana/Marengo',
    'America/Indiana/Petersburg',
    'America/Indiana/Vevay',
    'America/Chicago',
    'America/Indiana/Tell_City',
    'America/Indiana/Knox',
    'America/Menominee',
    'America/North_Dakota/Center',
    'America/North_Dakota/New_Salem',
    'America/North_Dakota/Beulah',
    'America/Denver',
    'America/Boise',
    'America/Phoenix',
    'America/Los_Angeles',
    'America/Anchorage',
    'America/Juneau',
    'America/Sitka',
    'America/Metlakatla',
    'America/Yakutat',
    'America/Nome',
    'America/Adak',
    'Pacific/Honolulu',
    'America/Montevideo',
    'Asia/Samarkand',
    'Asia/Tashkent',
    'America/Caracas',
    'Asia/Ho_Chi_Minh',
    'Pacific/Efate',
    'Pacific/Wallis',
    'Pacific/Apia',
    'Africa/Johannesburg'
  ];