import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const alunosCollectionRef = collection(db, "alunos");

export const addMaterialToAluno = async (alunoId, materialUrl) => {
    const alunoRef = doc(db, "alunos", alunoId);
    await updateDoc(alunoRef, {
        material: materialUrl
    });
};

export const uploadFile = async (file) => {
    const storageRef = ref(db, `materials/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
};

export const getAlunos = async () => {
  const data = await getDocs(alunosCollectionRef);
  return data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};