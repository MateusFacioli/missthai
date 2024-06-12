import { db, storage } from './firebaseConfig';
import { ref, set, get, child, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { getAuth, deleteUser } from 'firebase/auth';

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
export const deleteAluno = async (cpf, email, password) => {
  try {
    const alunoRef = ref(db, 'alunos/' + cpf);
    const snapshot = await get(alunoRef);
    if (snapshot.exists()) {
        const materiais = snapshot.val().materiais || {};
        for (const key in materiais) {
            await deleteFile(materiais[key].url);
        }
    }

    // Remover arquivos do Firebase Storage
    // try {
    //     const storageListRef = storageRef(storage, `uploads/${cpf}/`);
    //     const res = await listAll(storageListRef);
    //     const deletePromises = res.items.map((itemRef) => deleteObject(itemRef));
    //     await Promise.all(deletePromises);
    // } catch (error) {
    //     console.error('Erro ao remover arquivos do Firebase Storage:', error);
    //     throw new Error('Erro ao remover arquivos do Firebase Storage.');
    // }

    // Remover o aluno do Realtime Database
    try {
        await remove(alunoRef);
    } catch (error) {
        console.error('Erro ao remover aluno do Realtime Database:', error);
        throw new Error('Erro ao remover aluno do Realtime Database.');
    }

    // Remover o aluno do Firebase Authentication
    // try {
    //     const auth = getAuth();
    //     const user = auth.currentUser;
    //     if (user) {
    //         await deleteUser(user);
    //     }
    // } catch (error) {
    //     console.error('Erro ao remover aluno do Firebase Authentication:', error);
    //     throw new Error('Erro ao remover aluno do Firebase Authentication.');
    // }

    console.log('Aluno removido com sucesso.');
} catch (error) {
    console.error('Erro ao remover aluno:', error);
    throw new Error('Erro ao remover aluno.');
}
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
  console.log("capivara storage", storage)
  const res = await listAll(listRef);
  console.log("capivara list", res)
  const materiais = await Promise.all(res.items.map(async (itemRef) => {
    const url = await getDownloadURL(itemRef);
    const metadata = await itemRef.getMetadata();
    return { url: url, tamanho: metadata.size, ultimaVezEditado: metadata.update };
  }));
  console.log("capivara materiais", materiais)
  return materiais;
} catch (error) {
  console.error('capivara erro:', error);
    throw error;
}
};

// export const getMateriaisAluno = async (cpf) => {
//   try {
//     console.log('db:', db); // Verifique o estado do objeto db
//     const listRef = db.collection('uploads').doc(cpf);
//     const res = await listRef.get();
//     if (!res.exists) {
//       throw new Error('No such document!');
//     }
//     return res.data();
//   } catch (error) {
//     console.error('Erro ao obter materiais do aluno:', error);
//     throw error;
//   }
// };

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