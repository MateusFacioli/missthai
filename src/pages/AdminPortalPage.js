import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const AdminPortalPage = () => {

  return (
    <div className="App">
      <header className="App-header">
        <p>Portal Admin</p>
        <nav className="App-nav">
          <ul className="nav-list">
            <li><Link to="/area-admin/students" className="menu-item">My students</Link></li>
            <li><Link to="/area-admin/agenda" className="menu-item">My Agenda</Link></li>
            {/* <li><Link to="/area-portal/contact" className="menu-item">Contact</Link></li>
            <li><Link to="/area-portal/payments" className="menu-item">Payments</Link></li>
            <li><Link to="/area-portal/schedule" className="menu-item">Schedule</Link></li>
            <li><Link to="/area-portal/extras" className="menu-item">Extra Classes</Link></li> */}
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default AdminPortalPage;