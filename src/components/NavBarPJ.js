import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const NavBarPJ = () => {
    return (
        <nav className="App-nav">
            <ul className="nav-list">
                <li><Link to="/area-admin">Voltar para Home</Link></li>
            </ul>
        </nav>);
};

export default NavBarPJ;