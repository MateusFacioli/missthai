import React, { useState, useEffect } from 'react';
import '../App.css';
import { getAlunos, updateAluno, deleteAluno } from '../FirebaseService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCloudArrowUp, faTrashCan, faEdit } from '@fortawesome/free-solid-svg-icons';
import FolderAndFiles from '../components/FolderAndFiles';
import NavBar from '../components/NavBarPJ';

const AdminAreaPage = () => {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = async () => {
    try {
      const alunosData = await getAlunos();
      setAlunos(alunosData);
      calculateTotal(alunosData);
    } catch (error) {
      handleError(error, 'Erro ao buscar alunos');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (alunosData) => {
    const totalSum = alunosData.reduce((acc, aluno) => acc + (aluno.vezesNaSemana * 295), 0);
    setTotal(totalSum);
  };

  const handleUpdateVezesSemanaAluno = async (cpf, vezesNaSemana) => {
    if (!validateVezesNaSemana(vezesNaSemana)) {
      return alert('Vezes na Semana deve ser um número positivo.');
    }

    try {
      await updateAluno(cpf, { vezesNaSemana });
      const updatedAlunos = alunos.map(aluno =>
        aluno.cpf === cpf ? { ...aluno, vezesNaSemana } : aluno
      );
      setAlunos(updatedAlunos);
      calculateTotal(updatedAlunos);
    } catch (error) {
      handleError(error, 'Erro ao atualizar vezes na semana');
    }
  };

  const handleDeleteAluno = async (cpf, email, password) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await deleteAluno(cpf, email, password);
        const updatedAlunos = alunos.filter(aluno => aluno.cpf !== cpf);
        setAlunos(updatedAlunos);
        calculateTotal(updatedAlunos);
        alert('Aluno excluído com sucesso!');
      } catch (error) {
        handleError(error, 'Erro ao excluir aluno');
      }
    }
  };

  const validateVezesNaSemana = (vezesNaSemana) => {
    const number = parseInt(vezesNaSemana, 10);
    return number > 0;
  };

  const handleError = (error, message) => {
    console.error(message, error);
    alert(message);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
                  <FolderAndFiles alunoCpf={aluno.cpf} />
                </td>
                <td>
                  <button onClick={() => handleUpdateVezesSemanaAluno(aluno.cpf, prompt('Digite o novo valor de vezes na semana:', aluno.vezesNaSemana))}>
                    <FontAwesomeIcon icon={faEdit} title="Atualizar vezes na semana" className="custom-icon" />
                  </button>
                  <button onClick={() => handleDeleteAluno(aluno.cpf, aluno.email, aluno.password)}>
                    <FontAwesomeIcon icon={faTrashCan} title="Excluir aluno" className="custom-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h2>Total geral: R${total}</h2>
      <NavBar />
    </div>
  );
};

export default AdminAreaPage;