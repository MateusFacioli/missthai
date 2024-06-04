import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setShowFields(!showFields);
  };

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
    setShowFields(!showFields);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name') setName(value);
    if (name === 'cpf') setCpf(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login bem-sucedido');
      navigate('/area-portal'); // Redireciona para a página do portal do estudante
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      //setError(error.message);
      alert('Erro ao fazer login: credencial não cadastrada'); // Mostra um alerta com a mensagem de erro
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registro bem-sucedido');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      alert('Erro ao registrar');
      //setError(error.message);
    }
  };

  return (
    <div>
      {isRegistering ? (
        <form onSubmit={handleRegisterSubmit}>
          <div>
            <label>Nome:</label>
            <input type="text" name="name" value={name} onChange={handleInputChange} required />
          </div>
          <div>
            <label>CPF:</label>
            <input type="text" name="cpf" value={cpf} onChange={handleInputChange} required />
          </div>
          {showFields && (
            <>
              <div>
                <label>Email:</label>
                <input type="email" name="email" value={email} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Senha:</label>
                <input type="password" name="password" value={password} onChange={handleInputChange} required />
              </div>
            </>
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Registrar</button>
          <button type="button" onClick={toggleForm}>Já tenho conta</button>
        </form>
      ) : (
        <div>
          {showFields && (
            <form onSubmit={handleLoginSubmit}>
              <div>
                <label>Email:</label>
                <input type="email" name="email" value={email} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Senha:</label>
                <input type="password" name="password" value={password} onChange={handleInputChange} required />
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button type="submit">Login</button>
            </form>
          )}
          {!showFields && (
            <>
              <button onClick={toggleLoginForm}>Login</button>
              <button onClick={toggleForm}>Sou Novo</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentLogin;