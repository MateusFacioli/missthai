// import React, { useState, useEffect } from 'react';
// import { ref, listAll, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
// import { storage } from '../firebaseConfig';

// const FolderManager = ({ alunoCpf, onPathChange }) => {
//   const [folderStructure, setFolderStructure] = useState({});
//   const [currentPath, setCurrentPath] = useState('');
//   const [newFolderName, setNewFolderName] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchFolderStructure = async () => {
//       try {
//         const storageRef = ref(storage, `uploads/${alunoCpf}`);
//         const structure = await fetchFolderContents(storageRef);
//         setFolderStructure(structure);
//       } catch (error) {
//         console.error('Erro ao carregar estrutura de pastas:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (alunoCpf) fetchFolderStructure();
//   }, [alunoCpf]);

//   const fetchFolderContents = async (folderRef) => {
//     const result = await listAll(folderRef);
//     const subfolders = {};
//     for (const subfolder of result.prefixes) {
//       subfolders[subfolder.name] = await fetchFolderContents(subfolder);
//     }
//     return { subfolders };
//   };

//   const navigateToFolder = (folderName) => {
//     const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
//     setCurrentPath(newPath);
//     if (onPathChange) onPathChange(newPath);
//   };

//   const navigateBack = () => {
//     const pathArray = currentPath.split('/').filter(Boolean);
//     pathArray.pop();
//     const newPath = pathArray.join('/');
//     setCurrentPath(newPath);
//     if (onPathChange) onPathChange(newPath);
//   };

//   const handleFileSelection = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   const addFolderWithFile = async () => {
//     if (!newFolderName.trim()) {
//       alert('O nome da pasta não pode estar vazio.');
//       return;
//     }

//     if (!selectedFile) {
//       alert('Selecione um arquivo para adicionar à pasta.');
//       return;
//     }

//     const folderPath = `uploads/${alunoCpf}/${currentPath}/${newFolderName}`;
//     const fileRef = ref(storage, `${folderPath}/${selectedFile.name}`);

//     try {
//       await uploadBytes(fileRef, selectedFile);
//       alert('Pasta e arquivo criados com sucesso!');
//       setNewFolderName('');
//       setSelectedFile(null);

//       const storageRef = ref(storage, `uploads/${alunoCpf}`);
//       const updatedStructure = await fetchFolderContents(storageRef);
//       setFolderStructure(updatedStructure);
//     } catch (error) {
//       console.error('Erro ao criar pasta e arquivo:', error);
//       alert('Erro ao criar pasta e arquivo.');
//     }
//   };

//   const deleteFolder = async (folderName) => {
//     const folderPath = `uploads/${alunoCpf}/${currentPath}/${folderName}`;
//     const folderRef = ref(storage, folderPath);

//     try {
//       await deleteObject(folderRef);
//       alert('Pasta removida com sucesso!');
//       const storageRef = ref(storage, `uploads/${alunoCpf}`);
//       const updatedStructure = await fetchFolderContents(storageRef);
//       setFolderStructure(updatedStructure);
//     } catch (error) {
//       console.error('Erro ao remover pasta:', error);
//       alert('Erro ao remover pasta.');
//     }
//   };

//   const renderFolders = (folders) => {
//     return Object.keys(folders.subfolders || {}).map((folderName) => (
//       <div key={folderName} className="folder-item">
//         <span onClick={() => navigateToFolder(folderName)}>{folderName}</span>
//         <button onClick={() => deleteFolder(folderName)}>Remover</button>
//       </div>
//     ));
//   };

//   if (loading) return <p>Carregando...</p>;
//   if (error) return <p>Erro: {error}</p>;

//   const currentFolder = currentPath
//     .split('/')
//     .reduce((acc, folder) => acc?.subfolders?.[folder], folderStructure);

//   return (
//     <div>
//       <h2>Gerenciador de Pastas</h2>
//       <div>
//         <label>Caminho Atual: </label>
//         <span>{currentPath || 'Raiz'}</span>
//       </div>
//       <div>
//         <input
//           type="text"
//           placeholder="Nome da nova pasta"
//           value={newFolderName}
//           onChange={(e) => setNewFolderName(e.target.value)}
//         />
//         <input type="file" onChange={handleFileSelection} />
//         <button onClick={addFolderWithFile}>Adicionar Pasta com Arquivo</button>
//         <button onClick={navigateBack} disabled={!currentPath}>
//           Voltar
//         </button>
//       </div>
//       <div>
//         <h3>Estrutura de Pastas:</h3>
//         {renderFolders(currentFolder || folderStructure)}
//       </div>
//     </div>
//   );
// };

// export default FolderManager;