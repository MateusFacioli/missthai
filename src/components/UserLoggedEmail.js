import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

const UserLoggedEmail = () => {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    
    const fetchEmail = async (userId) => {
      const userRef = ref(db, `alunos/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setEmail(snapshot.val().email);
        alert("email do logado", email );
      } else {
        console.error('No such document!');
      }
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchEmail(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { email, loading };
};

export default UserLoggedEmail;