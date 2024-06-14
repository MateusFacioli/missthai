import React, { Component } from 'react';
import '../App.css';
import AdminLogin from './AdminLogin';
import StudentLogin from './StudentLogin'
class Home extends Component {
  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1>Home de MissThai - web</h1>
          <p>Faça o login para melhor experiência</p>
          <p>Sou Admin <AdminLogin></AdminLogin> </p>
          <p>Sou Aluno <StudentLogin> </StudentLogin></p>
        </header>
      </div>
    );
  }
}


export default Home;