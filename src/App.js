import React, { useEffect, useState } from 'react';
import './App.css';
import WebFont from 'webfontloader';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";


import Homepage from "./pages/Homepage/Homepage";
import Navbar from './pages/Navbar/Navbar';
import Register from './pages/Register/Register';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
