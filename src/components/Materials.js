import React, { useEffect, useState } from 'react';
import { ref, listAll, getMetadata, getDownloadURL } from 'firebase/storage';
import { getLoggedStudentCpfAndEmail } from '../components/StudentCpfLogged';
import { formatFileSize } from '../utils/Utils';
import { Link } from 'react-router-dom';
import { storage } from '../firebaseConfig';
import '../App.css';

const Materials = () => {
  const [arquivos, setArquivos] = useState([]);
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { cpf: studentCpf, email: studentEmail } = await getLoggedStudentCpfAndEmail();
        if (!studentCpf || !studentEmail) {
          throw new Error('CPF ou email do estudante não encontrado');
        }
        setCpf(studentCpf);
        setEmail(studentEmail);
        console.log("Email e CPF adquiridos:", studentEmail, studentCpf);

        try {
          const storageRef = ref(storage, `uploads/${studentCpf}`);
          const result = await listAll(storageRef);
          const arquivosData = await Promise.all(result.items.map(async (itemRef) => {
            try {
              const metadata = await getMetadata(itemRef);
              const url = await getDownloadURL(itemRef);
              return { name: metadata.name, size: metadata.size, updated: metadata.updated, url };
            } catch (error) {
              console.error("Erro ao obter metadados do arquivo:", error);
              return null;
            }
          }));

          setArquivos(arquivosData.filter(arquivo => arquivo !== null));
        } catch (error) {
          console.error("Erro ao listar arquivos no Firebase Storage:", error);
        }
      } catch (error) {
        console.error("Erro ao obter dados do estudante:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  return (
    <div className="material-container">
      <h1>Seus arquivos</h1>
      {/* {alunos.map((aluno) => (
          <tr key={aluno.cpf}>
            <td>{aluno.nome}</td>
            <td>{aluno.email}</td>
            <td>{aluno.vezesNaSemana}</td>
            <td>R${295 * aluno.vezesNaSemana}</td>
          </tr>
        ))} */}
      {arquivos.length === 0 ? (
        <p>Sem materiais disponíveis</p>
      ) : (

        <table className="alunos-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Última modificação</th>
              <th>Tamanho</th>
            </tr>
          </thead>
          <tbody>
            {arquivos.map((file, index) => (
              <tr key={index}>
                <td> <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.name}
                </a> </td>
                <td>{new Date(file.updated).toLocaleString()}</td>
                <td>{formatFileSize(file.size)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <nav className="App-nav">
        <ul className="nav-list">
          <li><Link to="/area-portal">Voltar para Home</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Materials;