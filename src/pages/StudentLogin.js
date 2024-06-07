import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { addAluno } from '../FirebaseService';

const StudentLogin = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vezesNaSemana, setVezesNaSemana] = useState('');
  //const [materiais, setMateriais] = useState('');
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
    //if(name === 'materiais') setMateriais(value);
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
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login bem-sucedido');
      navigate('/area-portal');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login: credencial não cadastrada');
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    if (!validateCPF(cpf)) {
      setError('CPF inválido. Deve conter exatamente 11 dígitos.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Email inválido.');
      return;
    }
    if (!validateVezesNaSemana(vezesNaSemana)) {
      setError('Vezes na Semana deve ser um número positivo.');
      return;
    }

    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await addAluno({ nome: name, cpf, email, senha: password, vezesNaSemana/*, materiais */}); // Adiciona o aluno ao banco de dados
      alert('Registro bem-sucedido');
      navigate('/area-portal');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      alert('Erro ao registrar');
      switch (error.code) {
        case 'auth/email-already-in-use':
            setError('Este email já está em uso.');
            break;
        case 'auth/invalid-email':
            setError('Email inválido.');
            break;
        case 'auth/weak-password':
            setError('A senha é muito fraca.');
            break;
        default:
            setError('Erro ao registrar. Tente novamente.');
    }
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
              <div>
                <label>Vezes na Semana:</label>
                <input type="number" name="vezesNaSemana" value={vezesNaSemana} onChange={handleInputChange} min="1" required />
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