import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import firebase  from "../FirebaseService"

const AdminLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  // Emails permitidos para login
  const allowedEmails = ["mateusrodrigues790@gmail.com", "english.missthai@gmail.com", "thaaipaes@gmail.com"];

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Verifica se o email está na lista de permitidos
        if (allowedEmails.includes(result.user.email)) {
          console.log("Login com Google bem-sucedido:", result.user);
          setIsLoggedIn(true); // Atualiza o estado para logado
          navigate('/area-admin'); // Redireciona para AdminAreaPage
        } else {
          // Se o email não estiver na lista, trata o acesso negado
          console.error("Acesso negado. Este email não tem permissão para fazer login como admin.");
          // Aqui você pode adicionar lógica para lidar com acessos não permitidos
        }
      })
      .catch((error) => {
        console.error("Erro ao fazer login com Google:", error.message);
      });
  };

  return (
    <div>
      {!isLoggedIn && (
        <button onClick={handleGoogleLogin}>Login com Google</button>
      )}
      {isLoggedIn && <p>Você está logado!</p>}
    </div>
  );
};

export default AdminLogin;