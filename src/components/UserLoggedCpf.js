import { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import UserLoggedEmail from '../components/UserLoggedEmail';

const UserLoggedCpf = () => {
  const { email, loading: emailLoading } = UserLoggedEmail();
  const [cpf, setCpf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (email && !emailLoading) {
      const fetchCpf = async () => {
        const db = getDatabase();
        const q = query(collection(db, 'alunos'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setCpf(userDoc.data().cpf);
        } else {
          console.error('No such document!');
        }
        setLoading(false);
      };

      fetchCpf();
    } else {
      setLoading(emailLoading);
    }
  }, [email, emailLoading]);

  return { cpf, loading };
};

export default UserLoggedCpf;