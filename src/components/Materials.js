import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { getDownloadURL, ref, listAll, getStorage, getMetadata } from 'firebase/storage';
import { getAlunos } from '../FirebaseService';
import { formatFileSize } from '../utils/Utils'; 

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
                    <td>{formatFileSize(file.size)}</td>
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

/*import React, { useState, useEffect } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { getDownloadURL, ref, listAll, getStorage, getMetadata } from 'firebase/storage';
import { getAlunos } from '../FirebaseService';
import { formatFileSize } from '../utils/Utils'; 
import UserLoggedEmail from '../components/UserLoggedEmail';


//so falta filtrar por cpf somente
const Materials = ( {user} ) => {
  const [alunos, setAlunos] = useState([]);
  const [cpfLogado, setCpfLogado] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlunos = async () => {
      const alunosData = await getAlunos();
      setAlunos(alunosData);
      console.log(alunosData);
    };

    const fetchMateriais = async (cpfLogado) => {
      if (!cpfLogado) return;
      if (!alunos || alunos.length === 0) return;
      try {
        if (user && user.cpfLogado) {
      const storage = getStorage();
      const filesMap = {};

      for (const aluno of alunos) {
        const cpfLogado = aluno.cpfLogado;
        const listRef = ref(storage, `uploads/${cpfLogado}/`);
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
          filesMap[cpfLogado] = fileInfos;
        } catch (error) {
          console.error(`Erro ao listar arquivos para o CPF ${cpfLogado}: `, error);
        }
      }
      alert("cpfLogado logado");
      setFiles(filesMap);
      setLoading(false);

    } else {
      console.error('Usuário ou CPF não definido');
    }
  } catch (error) {
    console.error('Erro ao buscar materiais:', error);
  }

    };
    const initialize = async () => {
      const cpfLogado = await fetchAlunos();
      setCpfLogado(cpfLogado);
      await fetchMateriais(cpfLogado);
    };

    initialize();
  }, []);
  // useEffect(() => {
  //   const fetchMateriaisCpf = async () => {
  //     if (!cpfLogado) return;
  //     const storage = getStorage();
  //     const listRef = ref(storage, `uploads/${cpfLogado}/`);
  //     try {
  //       const res = await listAll(listRef);
  //       const filePromises = res.items.map(async (itemRef) => {
  //         const fileUrl = await getDownloadURL(itemRef);
  //         const metadata = await getMetadata(itemRef);
  //         return { url: fileUrl, name: metadata.name, size: metadata.size, updated: metadata.updated };
  //       });
  //       const fileInfos = await Promise.all(filePromises);
  //       setFiles(fileInfos);
  //       userLoggedCpf(fileInfos);
  //     } catch (error) {
  //       console.error(`Erro ao listar arquivos para o CPF ${cpfLogado}: `, error);
  //     }
  //     setLoading(false);
  //   };

  //   fetchMateriaisCpf();
  // }, [cpfLogado]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (!cpf) {
  //   return <div>No CPF found for the logged-in user.</div>;
  // }
  const hasMaterials = Object.keys(files).length > 0;

  return (
    <div className="material-container">
      <h1>Seus arquivos</h1>
      {!hasMaterials ? (
        <p>Sem materiais disponíveis</p>
      ) : (
        files.map((file, index) => (
          <div key={cpfLogado}>
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
                {files[cpfLogado].map((file, index) => (
                  <tr key={index}>
                    <td><a href={file} target="_blank" rel="noopener noreferrer">Ver Material</a></td>
                    <td>{file.name}</td>
                    <td>{formatFileSize(file.size)}</td>
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

export default Materials; */