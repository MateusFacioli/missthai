import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const StudentPortalPage = () => {

  return (
    <div className="App">
      <header className="App-header">
        <p>Portal do aluno</p>
        <nav className="App-nav">
          <ul className="nav-list">
            <li><Link to="/area-portal/aboutme" className="menu-item">About Me</Link></li>
            <li><Link to="/area-portal/material" className="menu-item">My files</Link></li>
            <li><Link to="/area-portal/contact" className="menu-item">Contact</Link></li>
            <li><Link to="/area-portal/payments" className="menu-item">Payments</Link></li>
            <li><Link to="/area-portal/schedule" className="menu-item">Schedule</Link></li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default StudentPortalPage;