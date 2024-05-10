// Importa as funções necessárias dos SDKs do Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics'; // Descomente se estiver usando o Firebase Analytics

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDCihLM-Qs15kjmiFkzRrz5X-AEyZnVAFY",
  authDomain: "missthai-dcfd6.firebaseapp.com",
  projectId: "missthai-dcfd6",
  storageBucket: "missthai-dcfd6.appspot.com",
  messagingSenderId: "169899746663",
  appId: "1:169899746663:web:e19cc21ebc251d62483bc2",
  measurementId: "G-XQVQB6MNEM"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços do Firebase
const db = getFirestore(app);
const auth = getAuth(app);
// const analytics = getAnalytics(app); // Descomente se estiver usando o Firebase Analytics

export { db, auth };