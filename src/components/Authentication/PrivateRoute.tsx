import React, { useContext, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { isLoggedIn } from "./authHelpers";

const PrivateRoute = ({ component: Component, isAuth }) => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());
  useEffect(() => {
    // window.location.reload()
  }, [null]);

  return (
    <Route
      render={(props) =>
        !(isAuthenticated === true) ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
