import { getDatabase, ref, get, query, orderByChild, equalTo } from 'firebase/database';

const StudentCpfLogged = async (email) => {
  const db = getDatabase();
  const studentsRef = ref(db, 'alunos');
  const q = query(studentsRef, orderByChild('email'), equalTo(email));
  const snapshot = await get(q);

  if (snapshot.exists()) {
    const studentData = Object.values(snapshot.val())[0]; // Pega o primeiro resultado
    return studentData.cpf;
  } else {
    console.error('No such document!');
    return null;
  }
};

export default StudentCpfLogged;