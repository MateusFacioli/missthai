import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, BrowserRouter } from 'react-router-dom';
import './App.css';
import AdminLogin from './pages/AdminLogin';
import StudentPortalPage from './pages/StudentPortalPage';
import AdminAreaPage from './pages/AdminAreaPage';
import HomePage from './pages/HomePage';
import Contact from './components/Contact';
import Materials from './components/Materials';
import AboutMe from './components/AboutMe';
import Payments from './components/Payments';
<<<<<<< HEAD
import Schedule from './components/Schedule';
=======
import Restrictions from './components/Restrictions';
>>>>>>> 3c519dc (restriction)
import PasswordRecovery from './components/PasswordRecovery';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/area-admin' element={<AdminAreaPage />} />
          <Route path='/area-portal' element={<StudentPortalPage />} />
          <Route path='/area-login' element={<AdminLogin />} />
          <Route path='/area-portal/contact' element={<Contact />} />
          <Route path='/area-portal/material' element={<Materials />} />
          <Route path='/area-portal/aboutme' element={<AboutMe />} />
          <Route path='/area-portal/payments' element={<Payments />} />
<<<<<<< HEAD
          <Route path='/area-portal/schedule' element={<Schedule />} />
=======
          <Route path='/area-portal/schedule' element={<Restrictions />} />
>>>>>>> 3c519dc (restriction)
          <Route path='/passwordrecovery' element={<PasswordRecovery />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;