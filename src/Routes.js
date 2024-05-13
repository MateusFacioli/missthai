import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import StudentPortalPage from './pages/StudentPortalPage';
import AdminAreaPage from './pages/AdminAreaPage';
import AdminLogin from './pages/AdminLogin';
import { PrivateRoute } from './PrivateRoute';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <PrivateRoute path="/area-portal" component={StudentPortalPage} allowedRoles={['aluno', 'admin']} />
      <PrivateRoute path="/area-admin" component={AdminAreaPage} allowedRoles={['admin']} />
      <Route path="/area-login" component={AdminLogin} />
      {/* Outras rotas aqui */}
    </Switch>
  </BrowserRouter>
);

export default Routes;