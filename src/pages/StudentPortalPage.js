// import React, { Component } from 'react';
// import '../App.css';

// class StudentPortalPage extends Component {
//   render() {
  
//     return (
//       <div className="App">
//         <header className="App-header">
//           <p>você esta em portal do aluno</p>
//           <nav className="App-nav">
//               <ul className="nav-list">
//                 <li><a href="#about-us" className="menu-item">About Us</a></li>
//                 <li><a href="#material" className="menu-item">Material</a></li>
//                 <li><a href="#contact" className="menu-item">Contact</a></li>
//                 <li><a href="#payments" className="menu-item">Payments</a></li>
//                 <li><a href="#schedule" className="menu-item">Schedule</a></li>
//               </ul>
//             </nav>
//         </header>
//       </div>
//     );
//   }
// }


// export default StudentPortalPage;

import React, { useState, useEffect } from 'react';
import { getMateriaisAluno } from '../FirebaseService';
import '../App.css';

const StudentPortalPage = ({ cpf }) => {
    const [materiais, setMateriais] = useState({});

    useEffect(() => {
        const fetchMateriais = async () => {
            const materiaisData = await getMateriaisAluno(cpf);
            setMateriais(materiaisData);
        };
        fetchMateriais();
    }, [cpf]);

    return (
        <div className="App-header">
            <p>Você está na área do aluno</p>
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
        </div>
    );
};

export default StudentPortalPage;