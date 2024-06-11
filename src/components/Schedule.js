import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

const Schedule = () => {
    return (
        <div className="schedule-container">
            <h1>AGENDA CHEIAA</h1>
             <nav className="App-nav">
                  <ul className="nav-list">
                    <li><Link to="/area-portal">Voltar para Home</Link></li>
                  </ul>
                </nav>
        </div>
    );
};
export default Schedule;