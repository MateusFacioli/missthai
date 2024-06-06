import React, { useState, useEffect } from 'react';
import '../App.css';
import { getAlunos, updateAluno, deleteAluno, uploadFile, addMaterialToAluno, deleteFile } from '../FirebaseService';
import { ref, remove } from 'firebase/database';
import { db } from '../firebaseConfig';

//funcoes que adicionam no banco realtime database ?
//editar apenas o vezes na semana do aluno
//fazer a conta quanto ganha com cada aluno
//validar semana>0

const AdminAreaPage = () => {
  const [alunos, setAlunos] = useState([]);//  O estado alunos é usado para armazenar a lista de alunos. O useEffect é utilizado para buscar os dados dos alunos quando o componente é montado.

  useEffect(() => {
      const fetchData = async () => {
      const alunosData = await getAlunos();
      setAlunos(alunosData);
    };
    fetchData();
  }, []);

  const handleUpdateAluno = async (cpf, updatedData) => {
    await updateAluno(cpf, updatedData);
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

  //Esta função é chamada quando um arquivo é selecionado. Ela faz o upload do arquivo e associa a URL do arquivo ao aluno específico.
  const handleFileUpload = async (event, cpf) => {
    const file = event.target.files[0];
    if (!file) return;
   const confirmUpload = window.confirm('Tem certeza que deseja adicionar este arquivo?');
    if (confirmUpload) {
      try {
      // Faz o upload do arquivo e obtém a URL do arquivo
      const fileUrl = await uploadFile(file);
      // Adiciona a URL do arquivo ao aluno específico
      await addMaterialToAluno(cpf, fileUrl);
      alert('Material enviado com sucesso!');
      const alunosData = await getAlunos();
      setAlunos(alunosData);
      } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
      alert('Erro ao enviar o material.');
     }
    }
  };

  const handleFileDelete = async (fileUrl, cpf, materialKey) => {
    const confirmDelete = window.confirm('Tem certeza que deseja remover este arquivo?');
    if (confirmDelete) {
      try {
      await deleteFile(fileUrl);
      const alunoRef = ref(db, 'alunos/' + cpf + '/materiais/' + materialKey);
      await remove(alunoRef);//await remove(alunoRef);
      //await updateAluno(cpf, { material: '' });// verificar
      alert('Material removido com sucesso!');
      const alunosData = await getAlunos();
      setAlunos(alunosData);
      } catch (error) {
      console.error('Erro ao remover o arquivo:', error);
      alert('Erro ao remover o material.');
     }
    }
  };

  return (
    <div className="App-header">
      <p>Você está na área administrativa</p>
      {alunos.length === 0 ? (
        <p>Sem dados de alunos</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Vezes na Semana</th>
              <th>Materiais</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.cpf}>
                <td>{aluno.nome}</td>
                <td>{aluno.email}</td>
                <td>{aluno.cpf}</td>
                <td>{aluno.vezesNaSemana}</td>
                <td>
                {aluno.materiais ? (
                  Object.keys(aluno.materiais).map((key) => (
                    <div key={key}>
                        <a href={aluno.materiais[key].url} target="_blank" rel="noopener noreferrer">Ver Material</a>
                        <button onClick={() => handleFileDelete(aluno.materiais[key].url, aluno.cpf, key)}>Remover Material</button>
                    </div>
                  ))
              ) : (
                    <input type="file" onChange={(event) => handleFileUpload(event, aluno.cpf)} />
                  )}
                </td>
                <td>
                  <button onClick={() => handleUpdateAluno(aluno.cpf, { nome: 'Novo Nome' })}>Atualizar</button>
                  <button onClick={() => handleDeleteAluno(aluno.cpf)}>Remover</button>
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