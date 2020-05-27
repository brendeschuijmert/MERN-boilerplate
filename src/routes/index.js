import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import get from "lodash-es/get";
import DomUtility from "components/dom_utility";
import SignIn from "pages/login";
import SignUp from "pages/signup";
import Dashboard from "pages/dashboard";
import Users from "pages/users";
import { ROLES } from "constants/index";

const Routes = () => {
  const isAuthenticated = useSelector(
    state => !!get(state, "auth.token", false)
  );

  const role = useSelector(state => get(state, "auth.me.role", 0));
  const isManagable = role === ROLES.MANAGER || role === ROLES.ADMIN;

  return (
    <>
      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            if (isAuthenticated) {
              return <Redirect to="/dashboard" />;
            }
            return <Redirect to="/login" />;
          }}
        />
        {!isAuthenticated && (
          <Switch>
            <Route path="/login" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/" render={() => <Redirect to="/login" />} />
          </Switch>
        )}
        {isAuthenticated && (
          <Switch>
            <Route exact path="/dashboard" component={Dashboard} />
            {isManagable && <Route exact path="/users" component={Users} />}
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        )}
      </Switch>
      <DomUtility />
    </>
  );
};

export default Routes;
