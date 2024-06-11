import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp, faLinkedin } from '@fortawesome/free-brands-svg-icons';


const AboutMe = () => {
    return (
        <div className="aboutme-container">
            <h1>sou o amor da vida do matt</h1>
             <nav className="App-nav">
                  <ul className="nav-list">
                    <li><Link to="/area-portal">Voltar para Home</Link></li>
                  </ul>
                </nav>
        </div>
    );
};
export default AboutMe;