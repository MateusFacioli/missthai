import React from "react";
import { BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import { isAuthenticated } from "./pages/auth";
import StudentPortalPage from './pages/StudentPortalPage';
import AdminAreaPage from './pages/AdminAreaPage';
import ProtectedRoute from './ProtectedRoute'; // Importe o ProtectedRoute


export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
      )
    }
  />
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route component ={StudentPortalPage}  path="/portal"/>
      <Route component={AdminAreaPage} path="/admin"/>
      <Route component={() => <h1>Page not found</h1>}  path="*"/>
    </Switch>
  </BrowserRouter>
);

export default Routes; 