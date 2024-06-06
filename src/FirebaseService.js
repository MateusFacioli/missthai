import { db, storage } from './firebaseConfig';
import { ref, set, get, child, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

//const alunosCollectionRef = ref(db, "alunos");


// Função para adicionar um novo aluno
export const addAluno = async (aluno) => {
  const alunoRef = ref(db, 'alunos/' + aluno.cpf);
  await set(alunoRef, aluno);
};

// Função para obter a lista de alunos
export const getAlunos = async () => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, 'alunos'));
  if (snapshot.exists()) {
    return Object.values(snapshot.val());
  } else {
    return [];
  }
};

  // Função para atualizar um aluno
export const updateAluno = async (cpf, updatedData) => {
  const alunoRef = ref(db, 'alunos/' + cpf);
  await update(alunoRef, updatedData);
};

// Função para remover um aluno
export const deleteAluno = async (cpf) => {
  const alunoRef = ref(db, 'alunos/' + cpf);
  await remove(alunoRef);
};

// Função para fazer o upload de um arquivo
export const uploadFile = async (file) => {
  const fileRef = storageRef(storage, `uploads/${file.name}`);
  await uploadBytes(fileRef, file);
  const fileUrl = await getDownloadURL(fileRef);
  return fileUrl;
};

// Função para remover um arquivo
export const deleteFile = async (fileUrl) => {
  const fileRef = storageRef(storage, fileUrl);
  await deleteObject(fileRef);
};

// Função para adicionar material a um aluno específico
export const addMaterialToAluno = async (cpf, fileUrl) => {
  const alunoRef = ref(db, 'alunos/' + cpf + '/materiais');
  const newMaterialRef = ref(alunoRef, new Date().getTime().toString()); // Usando timestamp como chave única
  await set(newMaterialRef, { url: fileUrl });
  //await update(alunoRef, { material: fileUrl });//verificar
};

