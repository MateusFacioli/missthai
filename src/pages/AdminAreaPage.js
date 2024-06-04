import React, { useState, useEffect } from 'react';
import '../App.css';
import { getAlunos, uploadFile, addMaterialToAluno } from '../FirebaseService';

const AdminAreaPage = () => {
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    const fetchAlunos = async () => {
      const alunosData = await getAlunos();
      setAlunos(alunosData);
    };
    fetchAlunos();
  }, []);

  const handleFileUpload = async (event, alunoId) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      // Faz o upload do arquivo e obtém a URL do arquivo
      const fileUrl = await uploadFile(file);
      // Adiciona a URL do arquivo ao aluno específico
      await addMaterialToAluno(alunoId, fileUrl);
      alert('Material enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
      alert('Erro ao enviar o material.');
    }
  };

  return (
    <div className="App-header">
      <p>Você está na área administrativa</p>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Valor</th>
            <th>Vezes por Semana</th>
            <th>Material</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((aluno) => (
            <tr key={aluno.id}>
              <td>{aluno.nome}</td>
              <td>{aluno.valor}</td>
              <td>{aluno.vezesSemana}</td>
              <td>
                <input type="file" onChange={(event) => handleFileUpload(event, aluno.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAreaPage;