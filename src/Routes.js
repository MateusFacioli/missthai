import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import StudentPortalPage from './pages/StudentPortalPage';
import AdminAreaPage from './pages/AdminAreaPage';
import AdminLogin from './pages/AdminLogin';
import Contact from './components/Contact';
import Materials from './components/Materials';
import AboutMe from './components/AboutMe';
import Payments from './components/Payments';
import Restrictions from './components/Restrictions';
import PasswordRecovery from './components/PasswordRecovery';
import { PrivateRoute } from './PrivateRoute';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <PrivateRoute path="/area-portal" component={StudentPortalPage} allowedRoles={['aluno', 'admin']} />
      <PrivateRoute path="/area-admin" component={AdminAreaPage} allowedRoles={['admin']} />
      <Route path="/area-login" component={AdminLogin} />
      <Route path="/area-portal/contact" component={Contact} />
      <Route path="/area-portal/material" component={Materials} />
      <Route path="/area-portal/aboutme" component={AboutMe} />
      <Route path='/area-portal/payments' component={Payments} />
      <Route path='/area-portal/schedule' component={Restrictions} />
      <Route path="/passwordrecovery" component={PasswordRecovery} />
    </Switch>
  </BrowserRouter>
);

export default Routes;