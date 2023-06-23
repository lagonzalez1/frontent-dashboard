import React, { useEffect, useState } from 'react';
import './App.css';
import WebFont from 'webfontloader';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Homepage from "./pages/Homepage/Homepage";
import Navbar from './pages/Navbar/Navbar';
import Register from './pages/Register/Register';
import Dashboard from './Layouts/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import { RequireAuth } from "react-auth-kit";


function App() {
  const [hide, setHide] = useState(false);

  function setFont() {
    WebFont.load({
      google: {
        families: ['Raleway']
      }
    });
  }
  
  useEffect(() => {
    setFont()
   }, []);

  
  return (
    <Router>
      <div className='container'>
      
        <Routes>
          <Route path='/' element={<Homepage />}></Route>
          <Route path='/Register' element={<Register />}></Route>
          <Route path='/Login' element={<Login />}></Route>

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
