import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAlunos } from '../FirebaseService';

const AdminLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  // Emails permitidos para login
  const allowedEmails = ["mateusrodrigues790@gmail.com", "english.missthai@gmail.com", "thaaipaes@gmail.com"];

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (allowedEmails.includes(result.user.email)) {
        console.log("Login com Google bem-sucedido:", result.user);
        setIsLoggedIn(true);
        await getAlunos();
        navigate('/area-admin');
      } else {
        alert("Acesso negado. Este email não tem permissão para fazer login como admin.");
        console.error("Acesso negado. Este email não tem permissão para fazer login como admin.");
      }
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error.message);
      setError("Erro ao fazer login com Google:" + error.message);
    }
  };
  return (
    <div>
    {!isLoggedIn ? (
      <button onClick={handleGoogleLogin}>Login com Google</button>
    ) : (
      <p>Você está logado!</p>
    )}
    {error && <p style={{ color: 'red' }}>{error}</p>}
  </div>
  );
};

export default AdminLogin;