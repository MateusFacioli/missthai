import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

const Payments = () => {
  return (
    <div className="payments-container">
      <h1>sou rycaaa $$</h1>
      <nav className="App-nav">
        <ul className="nav-list">
          <li><Link to="/area-portal">Voltar para Home</Link></li>
        </ul>
      </nav>
    </div>
  );
};
export default Payments;