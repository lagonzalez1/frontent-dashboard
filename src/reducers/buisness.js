import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  buisness: null,
  buisnessId: null,
  settings: null,
  appointments: null,
  services: null,
  resources: null,
  employees: null,
};

const buisnessSlice = createSlice({
  name: 'buisness',
  initialState,
  reducers: {
    setBuisness: (state, action) => {
      state.buisness = action.payload;
    },
    setBuisnessId: (state, action) => {
      state.email = action.payload;
    },
    setSettings: (state, action) => {
      state.settings = action.payload;
    },
    setServices: (state, action) => {
      state.services = action.payload;
    },
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    setResources: (state, action) => {
      state.resources = action.payload;
    },
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
  },
});

export const { setBuisness, setBuisnessId, setServices, setSettings, setResources, setAppointments, setEmployees } = buisnessSlice.actions;
export default buisnessSlice.reducer;