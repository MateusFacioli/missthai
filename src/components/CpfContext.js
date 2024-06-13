import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';

export const CpfContext = createContext();

export const CpfProvider = ({ children }) => {
  const [cpf, setCpf] = useState('');
  const [isValid, setIsValid] = useState(true);


  const validateCPF = (cpf) => {
    // const regex = /^\d{11}$/;
    // return regex.test(cpf);
    const isValid = cpf.length === 11;
    setIsValid(isValid);
    return isValid;
  };
  
  const handleCpfChange = (event) => {
    const newCpf = event.target.value;
    setCpf(newCpf);
    validateCPF(newCpf);
  };

  useEffect(() => {
    const fetchCpf = async () => {
      const userDoc = await db.collection('alunos').doc('cpf').get();
      if (userDoc.exists) {
        setCpf(userDoc.data().cpf);
      }
    };

    fetchCpf();
  }, []);

  return (
    <CpfContext.Provider value={{ cpf }}>
      {children}
    </CpfContext.Provider>
  );
};