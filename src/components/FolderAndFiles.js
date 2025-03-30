import React, { useState, useEffect } from 'react';
import { ref, listAll, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const FolderAndFiles = ({ alunoCpf }) => {
  const [folderStructure, setFolderStructure] = useState({});
  const [currentPath, setCurrentPath] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFolderStructure = async () => {
      try {
        const storageRef = ref(storage, `uploads/${alunoCpf}`);
        const structure = await fetchFolderContents(storageRef);
        setFolderStructure(structure);
      } catch (error) {
        console.error('Erro ao carregar estrutura de pastas:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (alunoCpf) fetchFolderStructure();
  }, [alunoCpf]);

  const fetchFolderContents = async (folderRef) => {
    const result = await listAll(folderRef);
    const files = await Promise.all(
      result.items
        .filter((item) => item.name !== 'dummy.txt') // Filtra o arquivo dummy.txt
        .map(async (item) => {
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
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(newPath);
  };

  const navigateBack = () => {
    const pathArray = currentPath.split('/').filter(Boolean);
    pathArray.pop();
    setCurrentPath(pathArray.join('/'));
  };

  const handleFileSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const addFolder = async () => {
    if (!newFolderName.trim()) {
      alert('O nome da pasta não pode estar vazio.');
      return;
    }

    const folderPath = `uploads/${alunoCpf}/${currentPath}/${newFolderName}/`;
    const folderRef = ref(storage, folderPath);

    try {
      // Cria a pasta com um arquivo dummy.txt
      await uploadBytes(ref(folderRef, 'dummy.txt'), new Blob([]));
      alert('Pasta criada com sucesso!');
      setNewFolderName('');
      const storageRef = ref(storage, `uploads/${alunoCpf}`);
      const updatedStructure = await fetchFolderContents(storageRef);
      setFolderStructure(updatedStructure);
    } catch (error) {
      console.error('Erro ao criar pasta:', error);
      alert('Erro ao criar pasta.');
    }
  };

  const addFile = async () => {
    if (!currentPath) {
      alert('Selecione ou crie uma pasta antes de adicionar arquivos.');
      return;
    }

    if (!selectedFile) {
      alert('Selecione um arquivo para fazer upload.');
      return;
    }

    const filePath = `uploads/${alunoCpf}/${currentPath}/${selectedFile.name}`;
    const fileRef = ref(storage, filePath);

    try {
      // Remove o arquivo dummy.txt antes de adicionar o novo arquivo
      const dummyRef = ref(storage, `uploads/${alunoCpf}/${currentPath}/dummy.txt`);
      await deleteObject(dummyRef).catch(() => {});

      await uploadBytes(fileRef, selectedFile);
      alert('Arquivo enviado com sucesso!');
      setSelectedFile(null); // Atualiza para "nenhum arquivo selecionado"
      const storageRef = ref(storage, `uploads/${alunoCpf}`);
      const updatedStructure = await fetchFolderContents(storageRef);
      setFolderStructure(updatedStructure);
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      alert('Erro ao enviar arquivo.');
    }
  };

  const deleteFile = async (fileName) => {
    const filePath = `uploads/${alunoCpf}/${currentPath}/${fileName}`;
    const fileRef = ref(storage, filePath);

    try {
      await deleteObject(fileRef);
      alert('Arquivo removido com sucesso!');

      const storageRef = ref(storage, `uploads/${alunoCpf}`);
      const updatedStructure = await fetchFolderContents(storageRef);
      setFolderStructure(updatedStructure);

       // Verifica se a pasta atual está vazia
       const currentFolder = currentPath
       .split('/')
       .reduce((acc, folder) => acc?.subfolders?.[folder], updatedStructure);

   if (currentFolder && currentFolder.files.length === 0 && Object.keys(currentFolder.subfolders).length === 0) {
       const confirmDeleteFolder = window.confirm(
           'A pasta está vazia. Deseja removê-la também?'
       );

       if (confirmDeleteFolder) {
        const folderName = currentPath.split('/').pop();
        await deleteFolder(currentPath.split('/').pop());
        alert('Pasta removida com sucesso!');

        const pathArray = currentPath.split('/').filter(Boolean);
        pathArray.pop();
        setCurrentPath(pathArray.join('/'));
    } else {
        alert('A pasta não foi removida.');
    }
}
      
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
      alert('Erro ao remover arquivo.');
    }
  };

  const deleteFolder = async (folderName) => {
    const folderPath = `uploads/${alunoCpf}/${currentPath}/${folderName}`;
    const folderRef = ref(storage, folderPath);

    try {
      await deleteObject(folderRef);
      alert('Pasta removida com sucesso!');
      const storageRef = ref(storage, `uploads/${alunoCpf}`);
      const updatedStructure = await fetchFolderContents(storageRef);
      setFolderStructure(updatedStructure);
    } catch (error) {
      console.error('Erro ao remover pasta:', error);
      alert('Erro ao remover pasta, remova os arquivos e subpastas primeiro');
    }
  };

  const renderFolderContents = (contents) => {
    return (
      <div className="explorer-container">
        {Object.entries(contents.subfolders || {}).map(([name]) => (
          <div key={name} className="explorer-item folder">
            <FontAwesomeIcon icon={faFolder} />
            <span onClick={() => navigateToFolder(name)}>{name}</span>
            <button onClick={() => deleteFolder(name)}>
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        ))}
        {contents.files?.map((file) => (
          <div key={file.name} className="explorer-item file">
            <FontAwesomeIcon icon={faFile} />
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
            <button onClick={() => deleteFile(file.name)}>
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  const currentFolder = currentPath
    .split('/')
    .reduce((acc, folder) => acc?.subfolders?.[folder], folderStructure);

  return (
    <div>
      <h2>Escolha o camninho de Pastas e os Arquivos</h2>
      <div>
        <label>Caminho Atual: </label>
        <span>{currentPath || 'Raiz'}</span>
      </div>
      <div>
        <input
          type="text"
          placeholder="Nome da nova pasta"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <button onClick={addFolder}>Adicionar Pasta</button>
        <input type="file" onChange={handleFileSelection} />
        <button onClick={addFile}>Adicionar Arquivo</button>
        <button onClick={navigateBack} disabled={!currentPath}>
          Voltar
        </button>
      </div>
      <div>
        <h3>Estrutura de Pastas:</h3>
        {renderFolderContents(currentFolder || folderStructure)}
      </div>
    </div>
  );
};

export default FolderAndFiles;