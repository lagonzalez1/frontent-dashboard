import React, { lazy, useEffect, useState, Suspense } from 'react';
import './App.css';
import WebFont from 'webfontloader';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import { ThemeProvider } from '@emotion/react';
import { DashboardThemeLight, DashboardThemeDark } from './theme/theme';
import { useTheme } from './theme/ThemeContext';
import { RequireAuth } from "react-auth-kit";


// Import only when needed to. 
const Dashboard = lazy(() => import('./Layouts/Dashboard/Dashboard'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const Homepage = lazy(() => import('./pages/Homepage/Homepage'));

const Welcome = lazy(() => import('./pages/Welcome/Welcome'));
const WelcomeSize = lazy(() => import('./pages/Welcome/WelcomeSize'));
const WelcomeDetails = lazy(() => import('./pages/Welcome/WelcomeDetails'));
const WelcomeSelector = lazy(() => import('./pages/Welcome/WelcomeSelector'));
const Waiting = lazy(() => import('./pages/Waiting/Waiting'));
const BusinessWaitlist = lazy(() => import ('./pages/Waitlist/BusinessWaitlist'));
const LandingPage = lazy(() => import('./pages/Landing/LandingPage'));
const PasswordReset = lazy(() => import('./pages/PasswordReset/PasswordReset'));
const VerifyUser = lazy(() => import("./pages/Verify/VerifyUser"));
const WelcomeExtras = lazy(() => import('./pages/Welcome/WelcomeExtras'))

const ForgotPassword = lazy(() => import('./pages/ForgotPassword/ForgotPassword'))


const Resources = lazy(() => import ('./pages/Resources/Resources'));
const Features = lazy(() => import('./pages/Features/Features'));
const Pricing = lazy(() => import ('./pages/Pricing/Pricing'));


// Handle dark and light theme changes.
function App() {
  const { theme, getCurrentTheme, updateTheme } = useTheme();

  useEffect(() => {
    console.log("APP>JU")
    // Get the current theme from localStorage and update the state
    const currentTheme = getCurrentTheme();
    updateTheme(currentTheme);
  }, [updateTheme]);

  return (
    <Router>
      <div id="mainContainer">
        <Suspense fallback={<div><h6>Loading...</h6></div>}>
          <Routes>
            <Route path='/' element={<Homepage />}></Route>
            <Route path='/Register' element={<Register />}></Route>
            <Route path='/Login' element={<Login />}></Route>


            <Route path='/Resources' element={<Resources />}></Route>
            <Route path='/Features' element={<Features />}></Route>
            <Route path='/Pricing' element={<Pricing />}></Route>

            <Route path='/PasswordReset/:token' element={<PasswordReset />}></Route>
            <Route path='/ForgotPassword' element={<ForgotPassword />}></Route>
            
            <Route path={'/welcome/:link'} element={<Welcome />}></Route> { /** Check if business open. Advance if so. */}
            <Route path={'/welcome/:link/selector'} element={<WelcomeSelector />}></Route> { /** Check if business open. Advance if so. */}
            <Route path={'/welcome/:link/size'} element={<WelcomeSize />}></Route> { /** Check if business open. Advance if so. */}
            <Route path={'/welcome/:link/details'} element={<WelcomeDetails />}></Route> { /** Check if business open. Advance if so. */}
            <Route path={'/welcome/:link/extras'} element={<WelcomeExtras />}></Route> { /** Check if business open. Advance if so. */}
            <Route path={'/welcome/:link/visits/:unid'} element={<Waiting/>}></Route>
            <Route path={'/welcome/:link/waitlist'} element={<BusinessWaitlist />}></Route>
            <Route path={'/welcome/:link/:status/landingPage'} element={<LandingPage />}></Route>
            <Route path={'/verify/user/:idd/:email'} element={<VerifyUser />}></Route>
            

            <Route path={'/Dashboard'} element={
                <RequireAuth loginPath='/Login'>
                    <ThemeProvider theme={theme && theme === "light" ? DashboardThemeLight : DashboardThemeDark}>
                      <Dashboard/>                
                    </ThemeProvider>
                </RequireAuth>
            }></Route>
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
