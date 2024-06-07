import { db, storage } from './firebaseConfig';
import { ref, set, get, child, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL,listAll, deleteObject } from 'firebase/storage';


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

// Função para remover um aluno e seus arquivos
export const deleteAluno = async (cpf) => {
  const alunoRef = ref(db, 'alunos/' + cpf);
  const snapshot = await get(alunoRef);
  if (snapshot.exists()) {
      const materiais = snapshot.val().materiais || {};
      for (const key in materiais) {
          await deleteFile(materiais[key].url);
      }
  }
  await remove(alunoRef);
};

// Função para fazer o upload de múltiplos arquivos e armazenar no Realtime Database
export const uploadFiles = async (cpf, files) => {
  //const alunoRef = storage.ref(db, 'alunos/' + cpf + '/materiais').put(files).on("state_changed", alert("success"), alert);
  //const alunoRef = ref(db, 'alunos/materiais');
  const alunoRef = ref(db, 'alunos/' + cpf + '/materiais');
  const uploadPromises = Array.from(files).map(async (file) => {
      //const fileRef = storageRef(storage, `materiais/${file.name}`);
      const fileRef = storageRef(storage, `uploads/${cpf}/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      const fileSize = file.size;
      const lastModified = new Date().toISOString();
      const newMaterialRef = ref(alunoRef, new Date().getTime().toString()); // Usando timestamp como chave única
      await set(newMaterialRef, { url: fileUrl, tamanho: fileSize, ultimaVezEditado: lastModified, cpf: cpf });
      return fileUrl;
  });
  return Promise.all(uploadPromises);
};

// Função para obter os materiais de um aluno específico
export const getMateriaisAluno = async (cpf) => {
  const alunoRef = ref(db, 'alunos/' + cpf + '/materiais');
  // const urlStorage = 'gs://missthai-dcfd6.appspot.com';
  // const alunoRef = ref('/uploads' + cpf);
  const snapshot = await get(alunoRef);
  if (snapshot.exists()) {
      return snapshot.val();
  } else {
      return {};
  }
};

// Função para remover um arquivo
export const deleteFile = async (fileUrl) => {
  const fileRef = storageRef(storage, fileUrl);
  await deleteObject(fileRef);
};

// Função para remover um arquivo específico de um aluno
export const deleteMaterialFromAluno = async (cpf, materialKey) => {
  const materialRef = ref(db, 'alunos/' + cpf + '/materiais/' + materialKey);
  const snapshot = await get(materialRef);
  if (snapshot.exists()) {
      const fileUrl = snapshot.val().url;
      await deleteFile(fileUrl);
  }
  await remove(materialRef);
};


//ABORDAGEM NOVA SÓ PARA ARQUIVOS
//https://firebase.google.com/docs/firestore/manage-data/add-data?hl=en#web