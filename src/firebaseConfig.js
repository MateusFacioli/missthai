// Importa as funções necessárias dos SDKs do Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDCihLM-Qs15kjmiFkzRrz5X-AEyZnVAFY",
  authDomain: "missthai-dcfd6.firebaseapp.com",
  databaseURL: "https://missthai-dcfd6-default-rtdb.firebaseio.com",
  projectId: "missthai-dcfd6",
  storageBucket: "missthai-dcfd6.appspot.com",
  messagingSenderId: "169899746663",
  appId: "1:169899746663:web:e19cc21ebc251d62483bc2",
  measurementId: "G-XQVQB6MNEM"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços do Firebase
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };