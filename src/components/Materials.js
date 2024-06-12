import React, { useState, useEffect } from 'react';
import '../App.css';
import { getMateriaisAluno } from '../FirebaseService';
import { Link } from 'react-router-dom';


const Materials = ({cpf}) => {
    const [materiais, setMateriais] = useState([]);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchMateriais = async () => {
        try {
            const materiaisData = await getMateriaisAluno(cpf);
            console.log('cpf do caboclo', cpf);
            console.log('materias data', materiaisData);
            setMateriais(materiaisData);
                
            } catch (error) {
            console.error('Erro ao obter materiais do aluno pqqq', error);
            setError(error.message);
            //alert('Erro ao obter materiais do aluno.');
            }
        };
    fetchMateriais();
    }, [cpf]);
    

    return (
        <div className="material-container">
            <h1>Seus arquivos</h1>
            {materiais.length === 0 ? (
        <p>Sem materiais disponíveis</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Tamanho</th>
              <th>Última vez editado</th>
            </tr>
          </thead>
          <tbody>
            {materiais.map((material, index) => (
              <tr key={index}>
                <td><a href={material.url} target="_blank" rel="noopener noreferrer">Ver Material</a></td>
                <td>{material.tamanho} bytes</td>
                <td>{material.ultimaVezEditado}</td>
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

export default Materials;