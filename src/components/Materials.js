// import React, { useState, useEffect, useContext } from 'react';
// import '../App.css';
// import { Link } from 'react-router-dom';
// import { getDownloadURL, ref, listAll, getStorage, getMetadata } from 'firebase/storage';
// import { getAlunos } from '../FirebaseService';
// import { formatFileSize } from '../utils/Utils'; 

// const Materials = () => {
//   const [alunos, setAlunos] = useState([]);
//   const [filesByCpf, setFilesByCpf] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAlunos = async () => {
//       const alunosData = await getAlunos();
//       setAlunos(alunosData);
//       console.log(alunosData)
//     };
//     fetchAlunos();
//   }, []);

//   useEffect(() => {
//     const fetchMateriais = async () => {
//       if (!alunos || alunos.length === 0) return;

//       const storage = getStorage();
//       const filesMap = {};

//       for (const aluno of alunos) {
//         const cpf = aluno.cpf;
//         const listRef = ref(storage, `uploads/${cpf}/`);
//         try {
//           const res = await listAll(listRef);
//           const filePromises = res.items.map(async (itemRef) => {
//             const fileUrl = await getDownloadURL(itemRef);
//             const metadata = await getMetadata(itemRef);
//             return {
//               url: fileUrl,
//               name: metadata.name,
//               size: metadata.size,
//               updated: metadata.updated
//             };
//           });
//           const fileInfos = await Promise.all(filePromises);
//           filesMap[cpf] = fileInfos;
//         } catch (error) {
//           console.error(`Erro ao listar arquivos para o CPF ${cpf}: `, error);
//         }
//       }
//       setFilesByCpf(filesMap);
//       setLoading(false);
//     };

//     fetchMateriais();
//   }, [alunos]);

//   const hasMaterials = Object.keys(filesByCpf).length > 0;

//   return (
//     <div className="material-container">
//       <h1>Seus arquivos</h1>
//       {!hasMaterials ? (
//         <p>Sem materiais disponíveis</p>
//       ) : (
//         Object.keys(filesByCpf).map((cpf) => (
//           <div key={cpf}>
//             <table>
//               <thead>
//                 <tr>
//                   <th>URL</th>
//                   <th>Nome</th>
//                   <th>Tamanho</th>
//                   <th>Última vez editado</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filesByCpf[cpf].map((file, index) => (
//                   <tr key={index}>
//                     <td><a href={file} target="_blank" rel="noopener noreferrer">Ver Material</a></td>
//                     <td>{file.name}</td>
//                     <td>{formatFileSize(file.size)}</td>
//                     <td>{new Date(file.updated).toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ))
//       )}
//       <nav className="App-nav">
//         <ul className="nav-list">
//           <li><Link to="/area-portal">Voltar para Home</Link></li>
//         </ul>
//       </nav>

//     </div>
//   );
// };

// export default Materials;

import React, { useState, useEffect } from 'react';
import '../App.css';
import { getDownloadURL, ref, listAll, getStorage, getMetadata } from 'firebase/storage';
import { getAlunos } from '../FirebaseService';
import { formatFileSize } from '../utils/Utils';

const Materials = () => {
  const [alunos, setAlunos] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cpfLogado, setCpfLogado] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const alunosData = await getAlunos();
        setAlunos(alunosData);
        console.log(alunosData)

      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.log('Erro ao obter o CPF do usuário logado undefined');
      }
    };

    const fetchMateriais = async (cpf) => {
      if (!alunos || alunos.length === 0) return;
      if (!cpf) return;
      console.log(cpf);
      const storage = getStorage();
      const filesMap = {};
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
        setFiles(fileInfos);
      } catch (error) {
        console.error(`Erro ao listar arquivos para o CPF ${cpf}: `, error);
      }
      setLoading(false);
    };
    const initialize = async () => {
      const aluno = await fetchAlunos();
      setCpfLogado(aluno);
      await fetchMateriais(aluno);
      console.log("chamou fetchMateriais", aluno);
    };

    initialize();
  }, []);

  return (
    <div className="material-container">
      <h1>Seus arquivos</h1>
      {files.length === 0 ? (
        <p>Sem materiais disponíveis</p>
      ) : (
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
              <p>Tamanho: {formatFileSize(file.size)}</p>
              <p>Última modificação: {new Date(file.updated).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Materials;