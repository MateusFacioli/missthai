// authServices.js
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Login com e-mail e senha
const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Login com Google
const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// Verifica se o usuário está autenticado
const isAuthenticated = () => {
  return !!localStorage.getItem('userToken'); // Supondo que o token do usuário esteja armazenado com a chave 'userToken'
};

export { loginWithEmail, loginWithGoogle, isAuthenticated };