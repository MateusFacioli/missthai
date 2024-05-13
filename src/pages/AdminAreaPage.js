import React, { useState, useEffect } from 'react';
import '../App.css';
import { getAlunos } from '../FirebaseService';

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
    <div className="App">
      <header className="App-header">
        <p>Você está na área administrativa</p>
        <input type="file" onChange={handleFileUpload} />
      </header>
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
                {/* Implemente a lógica para subir material específico para cada aluno */}
                <input type="file" onChange={handleFileUpload} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAreaPage;


<div className="App">
<header className="App-header">
  <p>Você está na área administrativa</p>
  <p>Pagamentos</p>
  <p>subir material</p>
</header>
</div>