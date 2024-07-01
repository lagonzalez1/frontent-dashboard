import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentClients: null,
  services: null,
  employees: null,
  timezone: null,
  accepting_override: null,
  businessAddress: null,
  businessName: null,
  businessPhone: null,
  businessWebsite: null,
  closedDates: null,
  currentPlan: null,
  notifications: null,
  settings: null,
  stripe: null,
  system: null,
  social: null,
  timestamp: null,
  terminating: null,
  resources: null,
  partySize: null,
  appointments: null,
  theme: null,
  publicLink: null,
  serveMax: null,
  _id: null,
  country: null,
  schedule: null,
  noShowData: null,
  appointmentDate: null,
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setAppointmentDate: (state, action) => {
      state.appointmentDate = action.payload;
    },
    setBusiness: (state, action) => {
      state.schedule = action.payload.schedule;
      state.services = action.payload.services;
      state.employees = action.payload.employees;
      state.timezone = action.payload.timezone;
      state.accepting_override = action.payload.accepting_override;
      state.businessAddress = action.payload.businessAddress;
      state.businessName = action.payload.businessName;
      state.businessPhone = action.payload.businessPhone;
      state.businessWebsite = action.payload.businessWebsite;
      state.closedDates = action.payload.closedDates;
      state.currentPlan = action.payload.currentPlan;
      state.notifications = action.payload.notifications;
      state.settings = action.payload.settings;
      state.stripe = action.payload.stripe;
      state.system = action.payload.system;
      state.social = action.payload.social;
      state.timestamp = action.payload.timestamp;
      state.terminating = action.payload.terminating;
      state.resources = action.payload.resources;
      state.partySize = action.payload.partySize;
      state.appointments = action.payload.appointments;
      state.theme = action.payload.theme;
      state.publicLink = action.payload.publicLink;
      state.serveMax = action.payload.serveMax;
      state._id = action.payload._id;
      state.country = action.payload.country;

    },
    setWaitlistClients: (state, action) => {
      state.currentClients = action.payload
    },
    setNoShowData: (state, action) => {
      state.noShowData = action.payload
    }
  
  },
});

export const { setBusiness, setWaitlistClients, setNoShowData, setAppointmentDate} = businessSlice.actions;
export default businessSlice.reducer;