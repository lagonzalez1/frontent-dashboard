import React, { useEffect, useState } from 'react';
import './App.css';
import WebFont from 'webfontloader';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import Register from './pages/Register/Register';
import Dashboard from './Layouts/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Welcome from './pages/Welcome/Welcome';
import WelcomeSize from "./pages/Welcome/WelcomeSize";
import { RequireAuth } from "react-auth-kit";
import WelcomeDetails from './pages/Welcome/WelcomeDetails';
import Waiting from './pages/Waiting/Waiting';


function App() {


  useEffect(() => {
    
   }, []);


  
  return (
    <Router>
      <div id="mainContainer">
      
        <Routes>
          <Route path='/' element={<Homepage />}></Route>
          <Route path='/Register' element={<Register />}></Route>
          <Route path='/Login' element={<Login />}></Route>
          <Route path={'/welcome/:link'} element={<Welcome />}></Route> { /** Check if business open. Advance if so. */}
          <Route path={'/welcome/:link/size'} element={<WelcomeSize />}></Route> { /** Check if business open. Advance if so. */}
          <Route path={'/welcome/:link/details'} element={<WelcomeDetails />}></Route> { /** Check if business open. Advance if so. */}
          <Route path={'/welcome/:link/visits/:unid'} element={<Waiting/>}></Route>
          <Route path={'/welcome/:link/waitlist'}></Route>

          <Route path={'/Dashboard'} element={
              <RequireAuth loginPath={'/Login'}>
                <Dashboard/>
              </RequireAuth>
          }> </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
