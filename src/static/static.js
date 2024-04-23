

export const APPOINTMENT = 'appointment';
export const WAITLIST = 'waitlist';
export const SERVING = 'serving';
export const NOSHOW = 'noshow';
export const APPOINTMENT_DATE_SELECT = 'appointment-date';
export const CLIENT = 'client';
export const APPOINTMENT_REMOVE = {
    title: 'Appointment removed!',
    message: 'Appointment has been succesfully removed from our appointment system, thank you.',
}
export const WAITLIST_REMOVE = {
    title: 'Waitlist removd!',
    message: 'You has been succesfully removed from our waitlist, thank you.',
}

export const WAITLIST_PLAN = "price_1Odn7GFBv6mpTbIZlmB4v8vZ";
export const WAITLIST_APP_PLAN = "price_1Odn7yFBv6mpTbIZdEVpjuym";
export const WAITLIST_APP_ANALYTICS_PLAN = "price_1Odn8NFBv6mpTbIZYxSQHjns";

export const SUPPORT = "For any quiestions or concerns feel free to email: support@waitonline.us";


export const CURRENT_PLANS_NUMERAL = {
    0: 'price_1Odn7GFBv6mpTbIZlmB4v8vZ',
    1: 'price_1Odn7yFBv6mpTbIZdEVpjuym',
    2: 'price_1Odn8NFBv6mpTbIZYxSQHjns'
}

export const CURRENT_PLANS = {
    'price_1Odn7GFBv6mpTbIZlmB4v8vZ': {
        title: 'Waitlist',
        description: 'This plan allows you to manage an online waitlist with clients. Utilize employees, resources and services.',
        price: '$6.99/mo'
    },
    'price_1Odn7yFBv6mpTbIZdEVpjuym': {
        title: 'Waitlist + Appointments',
        description: 'This plan allows you to manage an online waitlist and appointments with your clients. Utilize employees, resources and services.',
        price: '$9.99/mo'
    },
    'price_1Odn8NFBv6mpTbIZYxSQHjns': {
        title: 'Waitlist + Appointments + Analytics',
        description: 'This plan allows you to manage and online waitlist and appointments with clients. Utlilze employees, resources and services. Utilize and manage you business analytics and metrics to improve!',
        price: '$15.99/mo'
    }
}