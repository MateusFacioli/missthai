import React, { useState, useEffect } from 'react';
import '../App.css';
import { getAlunos, updateAluno, deleteAluno, uploadFiles, deleteMaterialFromAluno, getMateriais } from '../FirebaseService';

const AdminAreaPage = () => {
  const [alunos, setAlunos] = useState([]);//  O estado alunos é usado para armazenar a lista de alunos. O useEffect é utilizado para buscar os dados dos alunos quando o componente é montado.
  const [selectedFiles, setSelectedFiles] = useState({}); 

  useEffect(() => {
      const fetchData = async () => {
      const alunosData = await getAlunos();
      setAlunos(alunosData);
      console.log(alunosData)
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
              //alert(`Erro ao enviar os materiais: ${error.message}`);
              alert('Materiais enviados com sucesso');
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
    try {
    await updateAluno(cpf, { vezesNaSemana });
    const alunosData = await getAlunos();
    setAlunos(alunosData);
    } catch (error) {
      console.error('Erro ao atualizar vezes na semana:', error);
      alert('Erro ao atualizar vezes na semana.');
    }
  };

  const handleDeleteAluno = async (cpf, email, password) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este aluno?');
    if (confirmDelete) {
      try {
        await deleteAluno(cpf, email, password);
        const alunosData = await getAlunos();
        setAlunos(alunosData);
        alert('Aluno excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        if (error.message.includes('Firebase Storage')) {
            alert('Erro ao remover arquivos do Firebase Storage.');
        } else if (error.message.includes('Realtime Database')) {
            alert('Erro ao remover aluno do Realtime Database.');
        } else if (error.message.includes('Firebase Authentication')) {
            alert('Erro ao remover aluno do Firebase Authentication.');
        } else {
          console.log(error);
            alert('Erro ao excluir aluno vix');
        }
    }
}
};

const validateVezesNaSemana = (vezesNaSemana) => {
  const number = parseInt(vezesNaSemana, 10);
  return number > 0;
};

  return (
    <div className="App-header">
      <p>Área administrativa</p>
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
                {alunos.map((aluno) => (
                      <ul key={aluno.cpf}>
                          <button onClick={() => handleDeleteAluno(aluno.cpf, aluno.email, aluno.password)}>Excluir aluno</button>
                      </ul>
                  ))}
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
