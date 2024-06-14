import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { getDownloadURL, ref, listAll, getStorage, getMetadata } from 'firebase/storage';
import { getAlunos } from '../FirebaseService';

const Materials = () => {
  const [alunos, setAlunos] = useState([]);
  const [filesByCpf, setFilesByCpf] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlunos = async () => {
      const alunosData = await getAlunos();
      setAlunos(alunosData);
      console.log(alunosData)
    };
    fetchAlunos();
  }, []);

  useEffect(() => {
    const fetchMateriais = async () => {
      if (!alunos || alunos.length === 0) return;

      const storage = getStorage();
      const filesMap = {};

      for (const aluno of alunos) {
        const cpf = aluno.cpf;
        const listRef = ref(storage, `uploads/${cpf}/`);
        try {
          const res = await listAll(listRef);
          const filePromises = res.items.map(async (itemRef) => {
            const fileUrl = await getDownloadURL(itemRef);
            const metadata = await getMetadata(itemRef);
            return {
              url: fileUrl,
              name: metadata.name,
              size: metadata.size,
              updated: metadata.updated
            };
          });
          const fileInfos = await Promise.all(filePromises);
          filesMap[cpf] = fileInfos;
        } catch (error) {
          console.error(`Erro ao listar arquivos para o CPF ${cpf}: `, error);
        }
      }
      setFilesByCpf(filesMap);
      setLoading(false);
    };

    fetchMateriais();
  }, [alunos]);

  const hasMaterials = Object.keys(filesByCpf).length > 0;

  return (
    <div className="material-container">
      <h1>Seus arquivos</h1>
      {!hasMaterials ? (
        <p>Sem materiais disponíveis</p>
      ) : (
        Object.keys(filesByCpf).map((cpf) => (
          <div key={cpf}>
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Nome</th>
                  <th>Tamanho</th>
                  <th>Última vez editado</th>
                </tr>
              </thead>
              <tbody>
                {filesByCpf[cpf].map((file, index) => (
                  <tr key={index}>
                    <td><a href={file} target="_blank" rel="noopener noreferrer">Ver Material</a></td>
                    <td>{file.name}</td>
                    <td>{file.size} bytes</td>
                    <td>{new Date(file.updated).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
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
{/* {alunos.map((aluno, index) => (
        <div key={index}>
          <p>CPF: {aluno.cpf}</p>
          <p>Email: {aluno.email}</p>
          <p>Nome: {aluno.nome}</p>
          <p>Senha: {aluno.senha}</p>
          <p>Vezes na Semana: {aluno.vezesNaSemana}</p>
        </div>
      ))} */}