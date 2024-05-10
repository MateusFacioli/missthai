import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="login-section">
            <button className="login-button">Login</button>
          </div>
          <nav className="App-nav">
            <ul className="nav-list">
              <li><a href="#about-us">About Us</a></li>
              <li><a href="#material">Material</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#payments">Payments</a></li>
              <li><a href="#schedule">Schedule</a></li>
            </ul>
          </nav>
        </header>
      </div>
    );
  }
}

export default App;