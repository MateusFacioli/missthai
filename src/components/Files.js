// import React, { useEffect, useState } from 'react';
// import { ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
// import { storage } from '../firebaseConfig';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFolder, faFile, faTrashCan } from '@fortawesome/free-solid-svg-icons';

// const Files = ({ cpf }) => {
//   const [folderStructure, setFolderStructure] = useState({});
//   const [currentPath, setCurrentPath] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchFolderStructure = async () => {
//       try {
//         const storageRef = ref(storage, `uploads/${cpf}/${currentPath}`);
//         const structure = await fetchFolderContents(storageRef);
//         setFolderStructure(structure);
//       } catch (error) {
//         console.error('Erro ao listar pastas e arquivos:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFolderStructure();
//   }, [cpf, currentPath]);

//   const fetchFolderContents = async (folderRef) => {
//     const result = await listAll(folderRef);
//     const files = await Promise.all(
//       result.items.map(async (item) => {
//         const url = await getDownloadURL(item);
//         return { name: item.name, url };
//       })
//     );
//     const subfolders = {};
//     for (const subfolder of result.prefixes) {
//       subfolders[subfolder.name] = await fetchFolderContents(subfolder);
//     }
//     return { files, subfolders };
//   };

//   const deleteFile = async (filePath) => {
//     const fileRef = ref(storage, filePath);
//     try {
//       await deleteObject(fileRef);
//       alert('Arquivo removido com sucesso!');
//       setCurrentPath(currentPath); // Atualiza a página
//     } catch (error) {
//       console.error('Erro ao remover arquivo:', error);
//       alert('Erro ao remover arquivo.');
//     }
//   };

//   const deleteFolder = async (folderName) => {
//     const folderPath = `uploads/${cpf}/${currentPath}/${folderName}`;
//     const folderRef = ref(storage, folderPath);
//     try {
//       await deleteObject(folderRef);
//       alert('Pasta removida com sucesso!');
//       setCurrentPath(currentPath); // Atualiza a página
//     } catch (error) {
//       console.error('Erro ao remover pasta:', error);
//       alert('Erro ao remover pasta.');
//     }
//   };

//   const navigateToFolder = (folderName) => {
//     setCurrentPath((prevPath) => (prevPath ? `${prevPath}/${folderName}` : folderName));
//   };

//   const renderFolderContents = (contents, path = '') => {
//     return (
//       <div className="explorer-container">
//         {Object.entries(contents.subfolders || {}).map(([name]) => (
//           <div key={`${path}/${name}`} className="explorer-item folder">
//             <FontAwesomeIcon icon={faFolder} />
//             <span onClick={() => navigateToFolder(name)}>{name}</span>
//             <button onClick={() => deleteFolder(name)}>
//               <FontAwesomeIcon icon={faTrashCan} />
//             </button>
//           </div>
//         ))}
//         {contents.files?.map((file) => (
//           <div key={file.name} className="explorer-item file">
//             <FontAwesomeIcon icon={faFile} />
//             <a href={file.url} target="_blank" rel="noopener noreferrer">
//               {file.name}
//             </a>
//             <button onClick={() => deleteFile(`${currentPath}/${file.name}`)}>
//               <FontAwesomeIcon icon={faTrashCan} />
//             </button>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   if (loading) return <p>Carregando...</p>;
//   if (error) return <p>Erro: {error}</p>;

//   return (
//     <div className="files-container">
//       {renderFolderContents(folderStructure)}
//     </div>
//   );
// };

// export default Files;