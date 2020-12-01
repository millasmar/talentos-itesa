import React from "react";

import { Route, Switch, Redirect } from "react-router-dom";
import { AuthProvider } from "../firebase/auth/auth";

// CONTAINERS
import RegisterFreelancerContainer from "./containers/RegisterFreelancerContainer";
import LoginContainer from "./containers/LoginContainer";
import AdminContainer from "./containers/AdminContainer";
import PagosFreelace from "./components/PagosFreelace";
import UserContainer from "./containers/UserContainer";

function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route exact path='/login' component={LoginContainer} />
        <Route exact path='/freelancer' component={UserContainer} />
        <Route exact path='/admin' component={AdminContainer} />
        <Route exact path='/pruebacard2' component={PagosFreelace} />
        <Route path='/register' component={RegisterFreelancerContainer} />
        <Redirect from='/' to='/login' />
      </Switch>
    </AuthProvider>
  );
}

export default App;
