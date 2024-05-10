import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate
import { loginWithEmail, loginWithGoogle } from './authServices';

const LoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Use o hook useNavigate

  const handleLogin = () => {
    const email = "usuario@example.com";
    const password = "senha123";
    loginWithEmail(email, password)
      .then((userCredential) => {
        console.log(userCredential);
        setIsLoggedIn(true); // Atualiza o estado para logado
        navigate('/admin'); // Redireciona para AdminAreaPage
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleGoogleLogin = () => {
    loginWithGoogle()
      .then((result) => {
        console.log(result);
        setIsLoggedIn(true); // Atualiza o estado para logado
        navigate('/admin'); // Redireciona para AdminAreaPage
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  const handleLoginSuccess = () => {
    // Redireciona para a área administrativa após o login
    navigate('/admin');
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>{isLoggedIn ? 'Logado' : 'Login com Google'}</button>
    </div>
  );
};

export default LoginPage;