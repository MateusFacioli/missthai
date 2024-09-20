import React, { useState, useEffect } from 'react';
import '../App.css';
import { getAlunos, updateAluno, deleteAluno, deleteMaterialFromAluno, getMateriaisAluno } from '../FirebaseService';
import { storage } from '../firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { formatFileSize } from '../utils/Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCloudArrowUp, faTrashCan, faEdit } from '@fortawesome/free-solid-svg-icons'; // Importando os ícones
import NavBar from '../components/NavBar';
import Files from '../components/Files';

//criar um menu para ver alunos, restriçoes e arquivos/uploads
//notificar users
//botao voltar  = navbar

const AdminAreaPage = () => {
  const [alunos, setAlunos] = useState([]);//  O estado alunos é usado para armazenar a lista de alunos. O useEffect é utilizado para buscar os dados dos alunos quando o componente é montado.
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [arquivos, setArquivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const alunosData = await getAlunos();
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

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const allArquivos = await Promise.all(
          alunos.map(async (aluno) => {
            try {
              const arquivosAluno = await getMateriaisAluno(aluno.cpf);
              console.log("chamada getmateriais aluno", arquivosAluno);
              return arquivosAluno.map(arquivo => ({ ...arquivo, cpf: aluno.cpf }));
            } catch (error) {
              console.log('Erro ao obter materiais do aluno: adminareapage', error);
              return { ...aluno, arquivos: [] };
            }
          })
        );

        setArquivos(allArquivos.flat());
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [alunos]);

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

        // Atualiza a lista de arquivos do aluno após o upload
        const arquivosAluno = await getMateriaisAluno(cpf);
        setArquivos((prevArquivos) => [
            ...prevArquivos.filter(arquivo => arquivo.cpf !== cpf),
            ...arquivosAluno.map(arquivo => ({ ...arquivo, cpf }))
        ]);

        alert('Materiais enviados com sucesso!');
        window.location.reload();

         // Limpa os arquivos selecionados
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

  const handleFileDelete = async (cpf, fileName) => {
    const confirmDelete = window.confirm('Tem certeza que deseja remover este arquivo?');
    if (confirmDelete) {
      try {
      const fileRef = ref(storage, `uploads/${cpf}/${fileName}`); // Cria a referência ao arquivo no Firebase Storage
      await deleteObject(fileRef); // Deleta o arquivo do Firebase Storage
      await deleteMaterialFromAluno(cpf, fileName); // Remove o arquivo do banco de dados (se necessário) 

      // Atualiza a lista de arquivos do aluno após o upload
      const arquivosAluno = await getMateriaisAluno(cpf);
      setArquivos((prevArquivos) => [
          ...prevArquivos.filter(arquivo => arquivo.cpf !== cpf),
          ...arquivosAluno.map(arquivo => ({ ...arquivo, cpf }))
      ]);

      const alunosData = await getAlunos();
      setAlunos(alunosData);
      alert('Material removido com sucesso!');
      window.location.reload();
      } catch (error) {
        console.error('Erro ao remover o arquivo:', error);
        alert('Material removido com sucesso!');
      }
      window.location.reload();
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
        window.location.reload();
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
      window.location.reload();
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
      {/* <NavBar /> */}
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
                </td>
                <td>
                    <div> 
                      <label htmlFor={`file-input-${aluno.cpf}`}>
                        <FontAwesomeIcon 
                          icon = {faSearch} 
                          title = "Escolher arquivos" 
                          className = "custom-icon"
                        />
                      </label>
                  <input
                    id={`file-input-${aluno.cpf}`}
                    type="file" 
                    multiple onChange={(event) => handleFileSelection(event, aluno.cpf)}
                    className="file-input"
                     />
                      <button onClick={() => handleFileUpload(aluno.cpf)}>
                      <FontAwesomeIcon icon = {faCloudArrowUp} title = "Upload" className = ".custom-icon" />
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
                  <FontAwesomeIcon icon = {faEdit} title = "Atualizar vezes na semana" className = ".custom-icon"/>
                  </button>
                  <button onClick={() => handleDeleteAluno(aluno.cpf, aluno.email, aluno.password)}>
                  <FontAwesomeIcon icon={faTrashCan} title="Excluir aluno" className=".custom-icon"/>
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
