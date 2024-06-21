import React, { useEffect, useState } from 'react';
import { ref, listAll, getMetadata, getDownloadURL } from 'firebase/storage';
import { getLoggedStudentCpfAndEmail } from '../components/StudentCpfLogged';
import { formatFileSize } from '../utils/Utils';
import { Link } from 'react-router-dom';
import { storage } from '../firebaseConfig';
import '../App.css';
import NavBar from './NavBar';
import { handleFileDelete, alunos } from '../pages/AdminAreaPage';

const Files = ({ cpf }) => {
    const [arquivos, setArquivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storageRef = ref(storage, `uploads/${cpf}`);
                const result = await listAll(storageRef);
                const arquivosData = await Promise.all(result.items.map(async (itemRef) => {
                    try {
                        const metadata = await getMetadata(itemRef);
                        const url = await getDownloadURL(itemRef);
                        return { name: metadata.name, size: metadata.size, updated: metadata.updated, url };
                    } catch (error) {
                        console.error("Erro ao obter metadados do arquivo:", error);
                        return null;
                    }
                }));
                setArquivos(arquivosData.filter(arquivo => arquivo !== null));
            } catch (error) {
                console.error("Erro ao listar arquivos no Firebase Storage:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (cpf) {
            fetchData();
        }
    }, [cpf]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>Erro: {error}</p>;
    }

    return (
        <div className="files-container">
            {arquivos.length === 0 ? (
                <p>Sem materiais disponíveis</p>
            ) : (
                arquivos.map((file, index) => (
                    <ul key={index}>
                        <li> <a href={file.url} target="_blank" rel="noopener noreferrer">
                            {file.name} - 
                            <small>{new Date(file.updated).toLocaleString()} - 
                            {formatFileSize(file.size)}</small>
                        </a> </li>
                        {/* <button onClick={() => handleFileDelete(aluno.cpf, index)}>Remover Material</button> */}
                    </ul>
                ))
            )}
        </div>
    );
};

export default Files;