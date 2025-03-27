import React, { useState, useEffect } from 'react';
import '../App.css';
import { getAlunos, updateAluno, deleteAluno, deleteMaterialFromAluno, getMateriaisAluno } from '../FirebaseService';
import { storage } from '../firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCloudArrowUp, faTrashCan, faEdit } from '@fortawesome/free-solid-svg-icons';
import Files from '../components/Files';


const AdminAreaPage = () => {
  const [alunos, setAlunos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [arquivos, setArquivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchAlunos();
  }, []);

  useEffect(() => {
    if (alunos.length > 0) {
      fetchFiles();
    }
  }, [alunos]);

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

  const fetchFiles = async () => {
    try {
      const allArquivos = await Promise.all(
        alunos.map(async (aluno) => {
          const arquivosAluno = await getMateriaisAluno(aluno.cpf);
          return arquivosAluno.map(arquivo => ({ ...arquivo, cpf: aluno.cpf }));
        })
      );
      setArquivos(allArquivos.flat());
    } catch (error) {
      handleError(error, 'Erro ao buscar arquivos');
    }
  };
  
  const calculateTotal = (alunosData) => {
    const totalSum = alunosData.reduce((acc, aluno) => acc + (aluno.vezesNaSemana * 295), 0);
    setTotal(totalSum);
  };

  const handleFileSelection = (event, cpf) => {
    const files = event.target.files;
    setSelectedFiles(prevSelectedFiles => ({ ...prevSelectedFiles, [cpf]: files }));
  };

  const handleFileUpload = async (cpf) => {
    const files = selectedFiles[cpf];
    if (!files) return alert('Nenhum arquivo selecionado.');

    if (window.confirm('Tem certeza que deseja adicionar estes arquivos?')) {
      try {
        await uploadFiles(cpf, files);
        await refreshArquivos(cpf);
        alert('Materiais enviados com sucesso!');
        setSelectedFiles(prev => ({ ...prev, [cpf]: null }));
      } catch (error) {
        handleError(error, 'Erro ao enviar os materiais');
      }
    }
  };

  const uploadFiles = async (cpf, files) => {
    const uploadPromises = Array.from(files).map(file => {
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `uploads/${cpf}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
          },
          reject,
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });
    });

    await Promise.all(uploadPromises);
  };

  const refreshArquivos = async (cpf) => {
    const arquivosAluno = await getMateriaisAluno(cpf);
    setArquivos(prevArquivos => [
      ...prevArquivos.filter(arquivo => arquivo.cpf !== cpf),
      ...arquivosAluno.map(arquivo => ({ ...arquivo, cpf }))
    ]);
  };

  const handleFileDelete = async (cpf, fileName) => {
    if (window.confirm('Tem certeza que deseja remover este arquivo?')) {
      try {
        await deleteFile(cpf, fileName);
        await refreshArquivos(cpf);
        alert('Material removido com sucesso!');
      } catch (error) {
        handleError(error, 'Erro ao remover o arquivo');
      }
    }
  };

  const deleteFile = async (cpf, fileName) => {
    const fileRef = ref(storage, `uploads/${cpf}/${fileName}`);
    await deleteObject(fileRef);
    await deleteMaterialFromAluno(cpf, fileName);
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
                  <Files 
                    cpf={aluno.cpf} 
                    arquivos={arquivos.filter(arquivo => arquivo.cpf === aluno.cpf)} 
                    onDelete={handleFileDelete} 
                  />
                  <FolderManager alunoCpf={aluno.cpf} />
                </td>
                <td>
                  <div>
                    <label htmlFor={`file-input-${aluno.cpf}`}>
                      <FontAwesomeIcon icon={faSearch} title="Escolher arquivos" className="custom-icon" />
                    </label>
                    <input
                      id={`file-input-${aluno.cpf}`}
                      type="file"
                      multiple
                      onChange={(event) => handleFileSelection(event, aluno.cpf)}
                      className="file-input"
                    />
                    <button onClick={() => handleFileUpload(aluno.cpf)}>
                      <FontAwesomeIcon icon={faCloudArrowUp} title="Upload" className="custom-icon" />
                    </button>
                    {selectedFiles[aluno.cpf] &&
                      Array.from(selectedFiles[aluno.cpf]).map((file) => (
                        <div key={file.name}>
                          <p>{file.name}</p>
                          <progress value={uploadProgress[file.name] || 0} max="100" />
                        </div>
                      ))}
                  </div>
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
    </div>
  );
};

export default AdminAreaPage;