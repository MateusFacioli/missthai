import React, { useState, useEffect } from 'react';
import '../App.css';
import { getAlunos, updateAluno, deleteAluno, deleteMaterialFromAluno, getMateriaisAluno } from '../FirebaseService';
import { storage } from '../firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const AdminAreaPage = () => {
  const [alunos, setAlunos] = useState([]);//  O estado alunos é usado para armazenar a lista de alunos. O useEffect é utilizado para buscar os dados dos alunos quando o componente é montado.
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const alunosData = await getAlunos();
        // const alunosWithFiles = await Promise.all(alunosData.map(async (aluno) => {
        // const arquivos = await getMateriaisAluno(aluno.cpf);
        // return { ...aluno, arquivos };
        // }));
        // setAlunos(alunosWithFiles);
        setAlunos(alunosData);
        const totalSum = alunosData.reduce((acc, aluno) => acc + (aluno.vezesNaSemana * 295), 0);
        setTotal(totalSum);
      } catch (error) {
        alert(error.message);
      }
    };
    fetchAlunos();
    setLoading(false);
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
        const uploadPromises = Array.from(files).map((file) => {
          return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `uploads/${cpf}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress((prevProgress) => ({ ...prevProgress, [file.name]: progress }));
              },
              (error) => {
                reject(error);
              },
              async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
              }
            );
          });
        });

        await Promise.all(uploadPromises);
        alert('Materiais enviados com sucesso!');
        const alunosData = await getAlunos();
        setAlunos(alunosData);
        setSelectedFiles((prevSelectedFiles) => ({ ...prevSelectedFiles, [cpf]: null }));
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
    try {
      await updateAluno(cpf, { vezesNaSemana });
      const updatedAlunos = alunos.map(aluno =>
        aluno.cpf === cpf ? { ...aluno, vezesNaSemana } : aluno
      );
      setAlunos(updatedAlunos);
      const totalSum = updatedAlunos.reduce((acc, aluno) => acc + (aluno.vezesNaSemana * 295), 0);
      setTotal(totalSum);
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
        const updatedAlunos = alunos.filter(aluno => aluno.cpf !== cpf);
        setAlunos(updatedAlunos);
        const totalSum = updatedAlunos.reduce((acc, aluno) => acc + (aluno.vezesNaSemana * 295), 0);
        setTotal(totalSum);
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
          alert('Erro ao excluir aluno');
        }
      }
    }
  };

  const validateVezesNaSemana = (vezesNaSemana) => {
    const number = parseInt(vezesNaSemana, 10);
    return number > 0;
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
                  {files.length === 0 ? (
                    <p>Sem arquivos</p>
                  ) : (
                    <ul>
                      {files.map((file, index) => (
                        <li index={index}>
                          <span>{file.name}</span> - <span>{new Date(file.ultimaVezEditado).toLocaleString()}</span>
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <button>Ver Arquivo</button> </a>
                          <button onClick={() => handleFileDelete(aluno.cpf, index)}>Remover Material</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td>
                  {
                    <div>
                      <input type="file" multiple onChange={(event) => handleFileSelection(event, aluno.cpf)} />
                      <button onClick={() => handleFileUpload(aluno.cpf)}>Upload</button>
                      {selectedFiles[aluno.cpf] &&
                        Array.from(selectedFiles[aluno.cpf]).map((file) => (
                          <div key={file.name}>
                            <p>{file.name}</p>
                            <progress value={uploadProgress[file.name] || 0} max="100" />
                          </div>
                        ))}
                    </div>
                  }
                  <button onClick={() => handleUpdateVezesSemanaAluno(aluno.cpf, prompt('Digite o novo valor de vezes na semana:', aluno.vezesNaSemana))}>Atualizar Vezes na Semana</button>
                  <button onClick={() => handleDeleteAluno(aluno.cpf, aluno.email, aluno.password)}>Excluir aluno</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h2>Total geral: R${total}</h2>
    </div>
  );
};

export default AdminAreaPage;
