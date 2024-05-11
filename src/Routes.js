import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import StudentPortalPage from './pages/StudentPortalPage';
import AdminAreaPage from './pages/AdminAreaPage';
import LoginPage from './pages/LoginPage';
import { PrivateRoute } from './PrivateRoute';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <PrivateRoute path="/area-portal" component={StudentPortalPage} allowedRoles={['aluno', 'admin']} />
      <PrivateRoute path="/area-admin" component={AdminAreaPage} allowedRoles={['admin']} />
      <Route path="/area-login" component={LoginPage} />
      {/* Outras rotas aqui */}
    </Switch>
  </BrowserRouter>
);

export default Routes;


// import React from "react";
// import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
// import { isAuthenticated } from "./pages/auth";
// import ComponentToPrint from './pages/dados';
// import Home from './pages/home';
// import login from './pages/login';

// export const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={props =>
//       isAuthenticated() ? (
//         <Component {...props} />
//       ) : (
//         <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
//       )
//     }
//   />
// );

// export const Routes = () => (
//   <BrowserRouter>
//     <Switch>
//       <PrivateRoute exact path="/" component={Home} />
//       <Route path="/login" component={login} />
//       <PrivateRoute path="/dados" component={ComponentToPrint} />
//       <Route path="*" component={() => <h1>Page not found</h1>} />
//     </Switch>
//   </BrowserRouter>
// );