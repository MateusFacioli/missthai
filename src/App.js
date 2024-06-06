import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, BrowserRouter } from 'react-router-dom';
import './App.css';
import AdminLogin from './pages/AdminLogin';
import StudentPortalPage from './pages/StudentPortalPage';
import AdminAreaPage from './pages/AdminAreaPage';
import HomePage from './pages/HomePage';

import ProtectedRoute from './ProtectedRoute'; // Certifique-se de que este é o caminho correto

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <Routes>
         <Route path ='/' element = { <HomePage/> }/>
          <Route path ='/area-admin' element = { <AdminAreaPage/> }/>
          <Route path ='/area-portal' element = {<StudentPortalPage/>}/>
          <Route path ='/area-login' element = {<AdminLogin/>}/>
      </Routes>
      </BrowserRouter>
    );
  }
}

export default App;