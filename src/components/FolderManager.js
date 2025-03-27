import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get, update } from 'firebase/database';

const FolderManager = ({ alunoCpf }) => {
  const [folderStructure, setFolderStructure] = useState({});
  const [currentPath, setCurrentPath] = useState('');
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    fetchFolderStructure();
  }, [alunoCpf]);

  const fetchFolderStructure = async () => {
    const db = getDatabase();
    const folderRef = ref(db, `alunos/${alunoCpf}/folderStructure`);
    const snapshot = await get(folderRef);
    if (snapshot.exists()) {
      setFolderStructure(snapshot.val());
    } else {
      setFolderStructure({});
    }
  };

  const saveFolderStructure = async (updatedStructure) => {
    const db = getDatabase();
    const folderRef = ref(db, `alunos/${alunoCpf}/folderStructure`);
    await set(folderRef, updatedStructure);
  };

  const addFolder = () => {
    if (!newFolderName.trim()) {
      alert('O nome da pasta não pode estar vazio.');
      return;
    }

    const pathArray = currentPath.split('/').filter(Boolean);
    let currentLevel = folderStructure;

    pathArray.forEach((folder) => {
      if (!currentLevel[folder]) {
        currentLevel[folder] = {};
      }
      currentLevel = currentLevel[folder];
    });

    if (currentLevel[newFolderName]) {
      alert('A pasta já existe neste nível.');
    } else {
      currentLevel[newFolderName] = {};
      const updatedStructure = { ...folderStructure };
      setFolderStructure(updatedStructure);
      saveFolderStructure(updatedStructure);
      setNewFolderName('');
    }
  };

  const navigateToFolder = (folderName) => {
    setCurrentPath((prevPath) => (prevPath ? `${prevPath}/${folderName}` : folderName));
  };

  const navigateBack = () => {
    const pathArray = currentPath.split('/').filter(Boolean);
    pathArray.pop();
    setCurrentPath(pathArray.join('/'));
  };

  const removeFolder = (folderName, path) => {
    const pathArray = path.split('/').filter(Boolean);
    let currentLevel = folderStructure;

    // Navega até o nível anterior da pasta
    pathArray.forEach((folder, index) => {
      if (index === pathArray.length - 1) return; // Para antes da pasta a ser removida
      currentLevel = currentLevel[folder];
    });

    // Verifica se a pasta contém subpastas ou arquivos
    if (Object.keys(currentLevel[folderName]).length > 0) {
      alert('A pasta não pode ser removida porque contém subpastas ou arquivos.');
      return;
    }

    // Remove a pasta
    delete currentLevel[folderName];
    const updatedStructure = { ...folderStructure };
    setFolderStructure(updatedStructure);
    saveFolderStructure(updatedStructure);

    // Atualiza o caminho atual se a pasta removida for a atual
    if (currentPath === path) {
      navigateBack();
    }
  };

  const renderFolders = (folders, path = '') => {
    return Object.keys(folders).map((folderName) => {
      const folderPath = `${path}/${folderName}`.replace(/^\//, ''); // Remove a barra inicial

      return (
        <div key={folderPath} style={{ marginLeft: '20px' }}>
          <span
            onClick={() => navigateToFolder(folderName)}
            style={{ cursor: 'pointer', color: 'blue', marginRight: '10px' }}
          >
            {folderName}
          </span>
          <button
            onClick={() => removeFolder(folderName, folderPath)}
            style={{ marginLeft: '10px' }}
          >
            Remover
          </button>
          {currentPath.startsWith(folderPath) && renderFolders(folders[folderName], folderPath)}
        </div>
      );
    });
  };

  return (
    <div>
      <h2>Gerenciador de Pastas</h2>
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
        <button onClick={navigateBack} disabled={!currentPath}>
          Voltar
        </button>
      </div>
      <div>
        <h3>Estrutura de Pastas:</h3>
        <div>{renderFolders(folderStructure)}</div>
      </div>
    </div>
  );
};

export default FolderManager;