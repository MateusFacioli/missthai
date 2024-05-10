// App.js
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import LoginPage from './login';
import StudentPortalPage from './pages/StudentPortalPage';
import AdminAreaPage from './pages/AdminAreaPage';
import ProtectedRoute from './ProtectedRoute'; // Certifique-se de que este é o caminho correto

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <div className="login-section">
              <LoginPage></LoginPage>
            </div>
            <h1>Faça login para continuar no MissThai-web</h1>
            <p>você está em home</p>
            {/* Adicionando botões para navegação */}
            <Link to="/portal"><button>Aluno</button></Link>
            <Link to="/admin"><button>Admin</button></Link>
          </header>
          <Routes>
            <Route path="/portal" element={<StudentPortalPage />} />
            <Route path="/admin" element={ <AdminAreaPage />} />
             {/*<ProtectedRoute>
                <AdminAreaPage />
    </ProtectedRoute> */}
             {/* Inclua uma rota para LoginPage se necessário */}
             <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;