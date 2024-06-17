import { getDatabase, ref, get, query, orderByChild, equalTo } from 'firebase/database';

// Variáveis globais para armazenar o CPF e o email
let globalCpf = '';
let globalEmail = '';

const StudentCpfLogged = async (email) => {
  if (!email) {
    console.error('Email não fornecido');
  }
  const db = getDatabase();
  const studentsRef = ref(db, 'alunos');
  const q = query(studentsRef, orderByChild('email'), equalTo(email));

  const snapshot = await get(q);
  if (snapshot.exists()) {
    const studentData = snapshot.val();
    const studentKey = Object.keys(studentData)[0];//primeira referencia
    
    const { cpf, email: studentEmail } = studentData[studentKey];
    globalCpf = cpf;
    globalEmail = studentEmail;
    console.log("dados user logado", globalCpf, globalEmail);
    return { cpf, email: studentEmail };
  } else {
    throw new Error('Estudante não encontrado');
  }
};

// Função sem parâmetros que retorna o email e o CPF do aluno logado
export async function getLoggedStudentCpfAndEmail() {
  return { cpf: globalCpf,  email: globalEmail };
}

export default StudentCpfLogged;