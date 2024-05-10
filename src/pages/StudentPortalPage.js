import React, { Component } from 'react';
import '../App.css';

class StudentPortalPage extends Component {
  render() {
  
    return (
      <div className="App">
        <header className="App-header">
          <p>você esta em portal do aluno</p>
          <nav className="App-nav">
              <ul className="nav-list">
                <li><a href="#about-us" className="menu-item">About Us</a></li>
                <li><a href="#material" className="menu-item">Material</a></li>
                <li><a href="#contact" className="menu-item">Contact</a></li>
                <li><a href="#payments" className="menu-item">Payments</a></li>
                <li><a href="#schedule" className="menu-item">Schedule</a></li>
              </ul>
            </nav>
        </header>
      </div>
    );
  }
}


export default StudentPortalPage;