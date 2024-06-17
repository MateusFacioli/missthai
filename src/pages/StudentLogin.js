import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { addAluno } from '../FirebaseService';
import StudentCpfLogged from '../components/StudentCpfLogged';

const StudentLogin = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vezesNaSemana, setVezesNaSemana] = useState('');
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
    if (name === 'vezesNaSemana') setVezesNaSemana(value);
  };

  //validations 
  const validateCPF = (cpf) => {
    const regex = /^\d{11}$/;
    return regex.test(cpf);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateVezesNaSemana = (vezesNaSemana) => {
    const number = parseInt(vezesNaSemana, 10);
    return number > 0;
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    try {
      const userCredential = await  signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const cpfLogado = await StudentCpfLogged(user.email);
      console.log('Login bem-sucedido');
      console.log("DADOS DO ALUNO LOGADO", cpfLogado, user.email);
      navigate('/area-portal');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login: credencial não cadastrada');
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    if (!validateCPF(cpf)) {
      alert('CPF inválido. Deve conter exatamente 11 dígitos.');
      return;
    }
    if (!validateEmail(email)) {
      alert('Email inválido.');
      return;
    }
    if (!validateVezesNaSemana(vezesNaSemana)) {
      alert('Vezes na Semana deve ser um número positivo.');
      return;
    }

    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await addAluno({ nome: name, cpf, email, senha: password, vezesNaSemana});
      await StudentCpfLogged(email);
      alert('Registro bem-sucedido');
      console.log("CPF DO ALUNO LOGADO", cpf);
      navigate('/area-portal');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      alert('Erro ao registrar');
      switch (error.code) {
        case 'auth/email-already-in-use':
          alert('Este email já está em uso.');
          break;
        case 'auth/invalid-email':
          alert('Email inválido.');
          break;
        case 'auth/weak-password':
          alert('A senha é muito fraca.');
          break;
        default:
          alert('Erro ao registrar. Tente novamente.');
      }
    }
  };

  return (
    <div>
      {isRegistering ? (
        <form onSubmit={handleRegisterSubmit}>
          <div>
            <label>Nome:</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleInputChange}
              placeholder='Joao da Silva'
              required />
          </div>
          <div>
            <label>CPF:</label>
            <input
              type="text"
              name="cpf"
              value={cpf}
              onChange={handleInputChange}
              placeholder='12345678900'
              required />
          </div>
          {showFields && (
            <>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder='Seu melhor email'
                  required />
              </div>
              <div>
                <label>Senha:</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  placeholder='Use uma senha forte'
                  required />
              </div>
              <div>
                <label>Vezes na Semana:</label>
                <input
                  type="number"
                  name="vezesNaSemana"
                  value={vezesNaSemana}
                  onChange={handleInputChange}
                  min="1"
                  placeholder='Número de aulas'
                  required />
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
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  required />
              </div>
              <div>
                <label>Senha:</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  required />
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button type="submit">Login</button>
              <button onClick={() => navigate('/passwordrecovery')}>Esqueceu a senha?</button>
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