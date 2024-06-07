import React, { useState, useEffect } from 'react';
import '../App.css';
import { getAlunos, updateAluno, deleteAluno, uploadFiles, deleteMaterialFromAluno } from '../FirebaseService';

const AdminAreaPage = () => {
  const [alunos, setAlunos] = useState([]);//  O estado alunos é usado para armazenar a lista de alunos. O useEffect é utilizado para buscar os dados dos alunos quando o componente é montado.
  const [selectedFiles, setSelectedFiles] = useState({}); 

  useEffect(() => {
      const fetchData = async () => {
      const alunosData = await getAlunos();
      setAlunos(alunosData);
    };
    fetchData();
  }, []);

  const handleFileSelection = (event, cpf) => {
    const files = event.target.files;
    setSelectedFiles((prevSelectedFiles) => ({
        ...prevSelectedFiles,
        [cpf]: files
    }));
};

  //Esta função é chamada quando um arquivo é selecionado. Ela faz o upload do arquivo e associa a URL do arquivo ao aluno específico.
  const handleFileUpload = async (cpf) => {
    const files = selectedFiles[cpf];
    if (!files) {
      alert('Nenhum arquivo selecionado.');
      return;
    }
    const confirmUpload = window.confirm('Tem certeza que deseja adicionar estes arquivos?');
    if (confirmUpload) {
        try {
            // for (const file of files) {
              await uploadFiles(cpf, files);
            // }
            alert('Materiais enviados com sucesso!');
            const alunosData = await getAlunos();
            setAlunos(alunosData);
            setSelectedFiles((prevSelectedFiles) => ({
                ...prevSelectedFiles,
                [cpf]: null
            }));
          } catch (error) {
            if (error.code === 'storage/unauthorized') {
              alert('Você não tem permissão para fazer upload de arquivos.');
            } else if (error.code === 'storage/canceled') {
              alert('Upload cancelado.');
            } else if (error.code === 'storage/unknown') {
              alert('Erro desconhecido ao fazer upload.');
            } else {
              alert(`Erro ao enviar os materiais: ${error.message}`);
            }
          }
        }
      };

  const handleFileDelete = async (cpf, materialKey) => {
    const confirmDelete = window.confirm('Tem certeza que deseja remover este arquivo?');
    if (confirmDelete) {
      try {
      await deleteMaterialFromAluno(cpf, materialKey);
      alert('Material removido com sucesso!');
      const alunosData = await getAlunos();
      setAlunos(alunosData);
      } catch (error) {
      console.error('Erro ao remover o arquivo:', error);
      alert('Erro ao remover o material.');
     }
    }
  };

  const handleUpdateVezesSemanaAluno = async (cpf, vezesNaSemana) => {
    if (!validateVezesNaSemana(vezesNaSemana)) {
      alert('Vezes na Semana deve ser um número positivo.');
      return;
    }
    await updateAluno(cpf, { vezesNaSemana });
    const alunosData = await getAlunos();
    setAlunos(alunosData);
  };

const handleDeleteAluno = async (cpf) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este aluno?');
    if (confirmDelete) {
        await deleteAluno(cpf);
        const alunosData = await getAlunos();
        setAlunos(alunosData);
        alert('Aluno excluído com sucesso!');
    }
};

const validateVezesNaSemana = (vezesNaSemana) => {
  const number = parseInt(vezesNaSemana, 10);
  return number > 0;
};

  return (
    <div className="App-header">
      <p>Você está na área administrativa</p>
      {alunos.length === 0 ? (
        <p>Sem dados de alunos</p>
      ) : (
        <table className="alunos-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Vezes na Semana</th>
              <th>Total</th>
              <th>Materiais</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.cpf}>
                <td>{aluno.nome}</td>
                <td>{aluno.email}</td>
                <td>{aluno.vezesNaSemana}</td>
                <td>R${295 * aluno.vezesNaSemana}</td>
                <td>
                {aluno.materiais ? (
                  Object.keys(aluno.materiais).map((key) => (
                    <div key={key}>
                        <a href={aluno.materiais[key].url} target="_blank" rel="noopener noreferrer">Ver Material</a>
                        <button onClick={() => handleFileDelete(aluno.cpf, key)}>Remover Material</button>
                    </div>
                  ))
              ) : (
                  <div>
                    <input type="file" multiple onChange={(event) => handleFileSelection(event, aluno.cpf)} />
                    <button onClick={() => handleFileUpload(aluno.cpf)}>Upload</button>
                  </div>
                  )}
                </td>
                <td>
                <button onClick={() => handleUpdateVezesSemanaAluno(aluno.cpf, prompt('Digite o novo valor de vezes na semana:', aluno.vezesNaSemana))}>Atualizar Vezes na Semana</button>
                  <button onClick={() => handleDeleteAluno(aluno.cpf)}>Remover aluno</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminAreaPage;

//ABORDAGEM 2
// import React, { useState, useEffect } from 'react';
// import { getAlunos, addAluno, updateAluno, deleteAluno, uploadFile, addMaterialToAluno, deleteFile } from '../FirebaseService';
// import '../App.css';


// const AdminAreaPage = () => {
//   const [alunos, setAlunos] = useState([]);
//   const [newAluno, setNewAluno] = useState({ nome: '', email: '', cpf: '', vezesNaSemana: '' });

//   useEffect(() => {
//     const fetchAlunos = async () => {
//       const alunosData = await getAlunos();
//       setAlunos(alunosData);
//     };
//     fetchAlunos();
//   }, []);

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setNewAluno({ ...newAluno, [name]: value });
//   };

//   const handleAddAluno = async () => {
//     await addAluno(newAluno);
//     setNewAluno({ nome: '', email: '', cpf: '', vezesNaSemana: '' });
//     const alunosData = await getAlunos();
//     setAlunos(alunosData);
//   };

//   const handleUpdateAluno = async (alunoId, updatedData) => {
//     await updateAluno(alunoId, updatedData);
//     const alunosData = await getAlunos();
//     setAlunos(alunosData);
//   };

//   const handleDeleteAluno = async (alunoId) => {
//     await deleteAluno(alunoId);
//     const alunosData = await getAlunos();
//     setAlunos(alunosData);
//   };

//   const handleFileUpload = async (event, alunoId) => {
//     const file = event.target.files[0];
//     if (!file) return;
//     try {
//       const fileUrl = await uploadFile(file);
//       await addMaterialToAluno(alunoId, fileUrl);
//       alert('Material enviado com sucesso!');
//       const alunosData = await getAlunos();
//       setAlunos(alunosData);
//     } catch (error) {
//       console.error('Erro ao enviar o arquivo:', error);
//       alert('Erro ao enviar o material.');
//     }
//   };

//   const handleFileDelete = async (fileUrl, alunoId) => {
//     try {
//       await deleteFile(fileUrl);
//       await updateAluno(alunoId, { material: '' });
//       alert('Material removido com sucesso!');
//       const alunosData = await getAlunos();
//       setAlunos(alunosData);
//     } catch (error) {
//       console.error('Erro ao remover o arquivo:', error);
//       alert('Erro ao remover o material.');
//     }
//   };

//   return (
//     <div className="App-header">
//       <p>Você está na área administrativa</p>
//       <div>
//         <input type="text" name="nome" value={newAluno.nome} onChange={handleInputChange} placeholder="Nome" />
//         <input type="text" name="email" value={newAluno.email} onChange={handleInputChange} placeholder="Email" />
//         <input type="text" name="cpf" value={newAluno.cpf} onChange={handleInputChange} placeholder="CPF" />
//         <input type="text" name="vezesNaSemana" value={newAluno.vezesNaSemana} onChange={handleInputChange} placeholder="Vezes na Semana" />
//         <button onClick={handleAddAluno}>Adicionar Aluno</button>
//       </div>
//       {alunos.length === 0 ? (
//         <p>Sem dados de alunos</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Nome</th>
//               <th>Email</th>
//               <th>CPF</th>
//               <th>Vezes na Semana</th>
//               <th>Material</th>
//               <th>Ações</th>
//             </tr>
//           </thead>
//           <tbody>
//             {alunos.map((aluno) => (
//               <tr key={aluno.id}>
//                 <td>{aluno.nome}</td>
//                 <td>{aluno.email}</td>
//                 <td>{aluno.cpf}</td>
//                 <td>{aluno.vezesNaSemana}</td>
//                 <td>
//                   {aluno.material ? (
//                     <div>
//                       <a href={aluno.material} target="_blank" rel="noopener noreferrer">Ver Material</a>
//                       <button onClick={() => handleFileDelete(aluno.material, aluno.id)}>Remover Material</button>
//                     </div>
//                   ) : (
//                     <input type="file" onChange={(event) => handleFileUpload(event, aluno.id)} />
//                   )}
//                 </td>
//                 <td>
//                   <button onClick={() => handleUpdateAluno(aluno.id, { nome: 'Novo Nome' })}>Atualizar</button>
//                   <button onClick={() => handleDeleteAluno(aluno.id)}>Remover</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default AdminAreaPage;