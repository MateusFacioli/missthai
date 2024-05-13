// import React, { Component } from 'react';
// import { auth } from '../firebaseConfig'; // Certifique-se de que este caminho esteja correto
// import { createUserWithEmailAndPassword } from 'firebase/auth';

// class StudentLogin extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isRegistering: false, // Estado para controlar qual formulário mostrar
//       showLoginForm: false, // Estado para controlar a visibilidade do formulário de login
//       name: '',
//       cpf: '',
//       email: '',
//       password: '',
//       error: null,
//     };
//   }

//   toggleForm = () => {
//     this.setState((prevState) => ({
//       isRegistering: !prevState.isRegistering
//     }));
//   }

//   toggleLoginForm = () => {
//     this.setState((prevState) => ({ 
//       showLoginForm: !prevState.showLoginForm 
//     }));
//   };


//   handleInputChange = (event) => {
//     const { name, value } = event.target;
//     this.setState({ [name]: value });
//   };

//   handleLoginSubmit = async (event) => {
//     event.preventDefault();
//     const { email, password } = this.state;
//     try {
//       await auth.signInWithEmailAndPassword(email, password);
//       console.log('Login bem-sucedido');
//     } catch (error) {
//       console.error('Erro ao fazer login:', error);
//       this.setState({ error: error.message });
//     }
//   };

//   handleRegisterSubmit = async (event) => {
//     event.preventDefault();
//     const { email, password } = this.state;
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       console.log('Registro bem-sucedido');
//     } catch (error) {
//       console.error('Erro ao registrar:', error);
//       this.setState({ error: error.message });
//     }
//   };

//   render() {
//     const { isRegistering, name, cpf, email, password, error, showLoginForm } = this.state;
//     //{!showLoginForm && (botao login)}
//     // {showLoginForm && ( form <email senha erro submit sou novo>}
//     return (
//       <div>
    
//         {isRegistering ? (
//           <form onSubmit={this.handleRegisterSubmit}>
//             <div>
//               <label>Nome:</label>
//               <input type="text" name="name" value={name} onChange={this.handleInputChange} required />
//             </div>
//             <div>
//               <label>CPF:</label>
//               <input type="text" name="cpf" value={cpf} onChange={this.handleInputChange} required />
//             </div>
//             <div>
//               <label>Email:</label>
//               <input type="email" name="email" value={email} onChange={this.handleInputChange} required />
//             </div>
//             <div>
//               <label>Senha:</label>
//               <input type="password" name="password" value={password} onChange={this.handleInputChange} required />
//             </div>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             <button type="submit">Registrar</button>
//             <button type="button" onClick={this.toggleForm}>Já tenho conta</button>
//           </form>
//         ) : (
//           <form onSubmit={this.handleLoginSubmit}>
//             <div>
//               <label>Email:</label>
//               <input type="email" name="email" value={email} onChange={this.handleInputChange} required />
//             </div>
//             <div>
//               <label>Senha:</label>
//               <input type="password" name="password" value={password} onChange={this.handleInputChange} required />
//             </div>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             <button type="submit">Login</button>
//             <button type="button" onClick={this.toggleForm}>Sou Novo</button>
//           </form>
//         )}
//       </div>
//     );
//   }
// }

// export default StudentLogin;


import React, { Component } from 'react';
import { auth } from '../firebaseConfig'; // Certifique-se de que este caminho esteja correto
import { createUserWithEmailAndPassword } from 'firebase/auth';

class StudentLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRegistering: false, // Estado para controlar qual formulário mostrar
      showLoginForm: false, // Estado para controlar a visibilidade do formulário de login
      showFields: false, // Estado para controlar a visibilidade dos campos de email e senha
      name: '',
      cpf: '',
      email: '',
      password: '',
      error: null,
    };
  }

  toggleForm = () => {
    this.setState((prevState) => ({
      isRegistering: !prevState.isRegistering,
      showFields: !prevState.showFields // Alterna a visibilidade dos campos junto com o formulário
    }));
  }

  toggleLoginForm = () => {
    this.setState((prevState) => ({
      showLoginForm: !prevState.showLoginForm,
      showFields: !prevState.showFields // Alterna a visibilidade dos campos junto com o login
    }));
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleLoginSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    try {
      await auth.signInWithEmailAndPassword(email, password);
      console.log('Login bem-sucedido');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      this.setState({ error: error.message });
    }
  };

  handleRegisterSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registro bem-sucedido');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      this.setState({ error: error.message });
    }
  };

  render() {
    const { isRegistering, name, cpf, email, password, error, showLoginForm, showFields } = this.state;

    return (
      <div>
        {isRegistering ? (
          <form onSubmit={this.handleRegisterSubmit}>
            <div>
              <label>Nome:</label>
              <input type="text" name="name" value={name} onChange={this.handleInputChange} required />
            </div>
            <div>
              <label>CPF:</label>
              <input type="text" name="cpf" value={cpf} onChange={this.handleInputChange} required />
            </div>
            {showFields && (
              <>
                <div>
                  <label>Email:</label>
                  <input type="email" name="email" value={email} onChange={this.handleInputChange} required />
                </div>
                <div>
                  <label>Senha:</label>
                  <input type="password" name="password" value={password} onChange={this.handleInputChange} required />
                </div>
              </>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Registrar</button>
            <button type="button" onClick={this.toggleForm}>Já tenho conta</button>
          </form>
        ) : (
          <div>
            {showFields && (
              <form onSubmit={this.handleLoginSubmit}>
                <div>
                  <label>Email:</label>
                  <input type="email" name="email" value={email} onChange={this.handleInputChange} required />
                </div>
                <div>
                  <label>Senha:</label>
                  <input type="password" name="password" value={password} onChange={this.handleInputChange} required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Login</button>
              </form>
            )}
            {!showFields && (
              <>
                <button onClick={this.toggleLoginForm}>Login</button>
                <button onClick={this.toggleForm}>Sou Novo</button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default StudentLogin;