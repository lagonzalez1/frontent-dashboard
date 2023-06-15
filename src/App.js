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
  
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Raleway']
      }
    });
   }, []);

  
  return (
    <Router>
      <div className='container'>
        <Navbar hide={hide}/>
        <Routes>
          <Route exact path='/' element={<Homepage setHide={setHide} />}></Route>
          <Route exact path='/Register' element={<Register setHide={setHide} />}></Route>
          <Route exact path='/Login' element={<Login setHide={setHide}/>}></Route>
          <Route exact path='/Dashboard' element={
              <RequireAuth loginPath="/Login">
                <Dashboard setHide={setHide} />
              </RequireAuth>
          }></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
