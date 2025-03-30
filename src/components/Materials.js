import React, { useEffect, useState } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { getLoggedStudentCpfAndEmail } from '../components/StudentCpfLogged';
import { storage } from '../firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../App.css';
import NavBar from './NavBar';

const Materials = () => {
  const [folderStructure, setFolderStructure] = useState({});
  const [currentPath, setCurrentPath] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFolderStructure = async () => {
      try {
        const { cpf: studentCpf } = await getLoggedStudentCpfAndEmail();
        if (!studentCpf) {
          throw new Error('CPF do estudante não encontrado');
        }
        setCpf(studentCpf);

        const storageRef = ref(storage, `uploads/${studentCpf}`);
        const structure = await fetchFolderContents(storageRef);
        setFolderStructure(structure);
      } catch (error) {
        console.error('Erro ao carregar estrutura de pastas:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFolderStructure();
  }, []);

  const fetchFolderContents = async (folderRef) => {
    const result = await listAll(folderRef);
    const files = await Promise.all(
      result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return { name: item.name, url };
      })
    );

    const subfolders = {};
    for (const subfolder of result.prefixes) {
      subfolders[subfolder.name] = await fetchFolderContents(subfolder);
    }

    return { files, subfolders };
  };

  const navigateToFolder = (folderName) => {
    setCurrentPath((prevPath) => (prevPath ? `${prevPath}/${folderName}` : folderName));
  };

  const navigateBack = () => {
    setCurrentPath((prevPath) => {
      const pathArray = prevPath.split('/').filter(Boolean);
      pathArray.pop();
      return pathArray.join('/');
    });
  };

  const renderFolderContents = (contents) => {
    if (!contents) return null;

    return (
      <ul className="folder-list">
        {Object.entries(contents.subfolders || {}).map(([name]) => (
          <li key={name} className="folder-item">
            <FontAwesomeIcon icon={faFolder} className="fa-icon" />
            <span onClick={() => navigateToFolder(name)}>{name}</span>
          </li>
        ))}
        {contents.files?.map((file) => (
          <li key={file.name} className="folder-item">
            <FontAwesomeIcon icon={faFile} className="fa-icon" />
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  const currentFolder = currentPath
    .split('/')
    .reduce((acc, folder) => acc?.subfolders?.[folder], folderStructure);

  const isEmpty = !currentFolder?.files?.length && !Object.keys(currentFolder?.subfolders || {}).length;

  return (
    <div className="material-container">
      <h1>Seus Arquivos</h1>
      <div>
        <button onClick={navigateBack} disabled={!currentPath}>
          Voltar
        </button>
        <span>{currentPath}</span>
      </div>
      {renderFolderContents(currentFolder || folderStructure)}
      <NavBar />
    </div>
  );
};

export default Materials;