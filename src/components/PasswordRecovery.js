import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';
import '../App.css';
import NavBar from './NavBar';

const PasswordRecovery = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('E-mail de recuperação de senha enviado com sucesso!');
      alert('E-mail de recuperação de senha enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar e-mail de recuperação de senha:', error);
      setMessage('Erro ao enviar e-mail de recuperação de senha.');
      alert('Erro ao enviar e-mail de recuperação de senha:', error);
    }
  };

  return (
    <div className="passwordrecovery-container">
      <h1>Recuperar Senha</h1>
      <form onSubmit={handlePasswordReset}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail" />
        <button type="submit">Recuperar</button>
      </form>
      <NavBar/>
    </div>
  );
};

export default PasswordRecovery;