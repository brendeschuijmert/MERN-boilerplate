import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import ROLES from "constants";

function AdminOrManagerRoute({ children, ...rest }) {
  const info = useSelector(state => state.auth.me);
  return (
    <Route
      {...rest}
      render={() =>
        info.role >= ROLES.MANAGER ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/"
            }}
          />
        )
      }
    />
  );
}

AdminOrManagerRoute.propTypes = {
  children: PropTypes.element
};

export default AdminOrManagerRoute;
