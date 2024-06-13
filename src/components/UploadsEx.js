import React, { useState, useEffect } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { storage } from '../firebaseConfig';
import { getDownloadURL, ref, listAll } from 'firebase/storage';

const Upload = ({ cpf }) => {
  const [materiais, setMateriais] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMateriais = async () => {
      try {
        const listRef = ref(storage, `uploads/${cpf}/`);
        const res = await listAll(listRef);
        const materiais = await Promise.all(
          res.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            const metadata = await itemRef.getMetadata();
            return {
              name: itemRef.name,
              url,
              tamanho: metadata.size,
              ultimaVezEditado: metadata.updated,
            };
          })
        );
        setMateriais(materiais);
      } catch (error) {
        console.error('Erro ao obter materiais do aluno:', error);
        setError(error.message);
      }
    };
    fetchMateriais();
  }, [cpf]);

  return (
    <div className="material-container">
      <h1>Seus arquivos</h1>
      {error && <p>Erro: {error}</p>}
      {materiais.length === 0 ? (
        <p>Sem materiais disponíveis</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tamanho</th>
              <th>Última vez editado</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {materiais.map((material, index) => (
              <tr key={index}>
                <td>{material.name}</td>
                <td>{material.tamanho} bytes</td>
                <td>{material.ultimaVezEditado}</td>
                <td>
                  <a href={material.url} target="_blank" rel="noopener noreferrer">
                    Ver Material
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <nav className="App-nav">
        <ul className="nav-list">
          <li><Link to="/area-portal">Voltar para Home</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Upload;