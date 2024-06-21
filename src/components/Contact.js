import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import NavBar from './NavBar';


const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contact Me</h1>
      <div className="contact-item">
        <a href="https://www.instagram.com/seu_profilee" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </a>
      </div>
      <div className="contact-item">
        <a href="https://wa.me/seu_numero" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faWhatsapp} size="3x" />
        </a>
      </div>
      <div className="contact-item">
        <a href="https://www.linkedin.com/in/seu_perfilll" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLinkedin} size="3x" />
        </a>
      </div>
     <NavBar/>
    </div>
  );
};

export default Contact;