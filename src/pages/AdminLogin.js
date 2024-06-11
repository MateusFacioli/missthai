import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAlunos } from '../FirebaseService';

const AdminLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
          const alunos = await getAlunos(); // Chama a função fetchAlunos
        //  // Converte o vetor de alunos em uma string formatada
        //     const alunosString = alunos.map(aluno => `Nome: ${aluno.nome}, Valor: ${aluno.valor}, Vezes por Semana: ${aluno.vezesSemana}`).join('\n');
        // // Exibe a string formatada no alert
        //   alert(`Seus alunos são:\n${alunosString}`);
          navigate('/area-admin'); // Redireciona para AdminAreaPage
      } else {
          console.error("Acesso negado. Este email não tem permissão para fazer login como admin.");
      }
  } catch (error) {
      console.error("Erro ao fazer login com Google:", error.message);
  }
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