import React, { useEffect } from 'react';
import './App.css';
import WebFont from 'webfontloader';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import Register from './pages/Register/Register';
import Dashboard from './Layouts/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import { RequireAuth } from "react-auth-kit";


function App() {

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
      <div id="mainContainer">
      
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
