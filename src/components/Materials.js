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
                
            } catch (error) { // erro aqui TypeError: db._checkNotDeleted is not a function
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
            {Object.keys(materiais).length === 0 ? (
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
                        {Object.keys(materiais).map((key) => (
                            <tr key={key}>
                                <td><a href={materiais[key].url} target="_blank" rel="noopener noreferrer">Ver Material</a></td>
                                <td>{materiais[key].tamanho} bytes</td>
                                <td>{materiais[key].ultimaVezEditado}</td>
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