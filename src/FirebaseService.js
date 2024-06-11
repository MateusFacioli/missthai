import { db, storage } from './firebaseConfig';
import { ref, set, get, child, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";

//nao usado
export const getMateriais = async () => {
  const db = getFirestore();
  const materiaisRef = collection(db, "uploads");
  const q = query(materiaisRef, /*where("cpf", "==", cpf),*/ orderBy("lastModified", "desc"));
  const querySnapshot = await getDocs(q);
  const materiais = [];
  querySnapshot.forEach((doc) => {
    materiais.push({ id: doc.id, ...doc.data() });
  });
  return materiais;
};

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
  const alunoRef = ref(db, 'alunos/' + cpf + '/materiais');
  const uploadPromises = Array.from(files).map(async (file) => {
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

// Função para obter os materiais de um aluno específico diretamente do Storage
export const getMateriaisAluno = async (cpf) => {
  try{
  const listRef = ref(storage, `uploads/${cpf}/`);
  console.log("capivara", listRef)
  const res = await listAll(listRef);
  console.log("capivara", res)
  const materiais = await Promise.all(res.items.map(async (itemRef) => {
    const url = await getDownloadURL(itemRef);
    const metadata = await itemRef.getMetadata();
    return { url: url, tamanho: metadata.size, ultimaVezEditado: metadata.update };
  }));
  console.log("capivara", materiais)
  return materiais;
} catch (error) {
  console.error('capivara:', error);
    throw error;
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