import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { Route, Redirect } from "react-router-dom";
import User from "../api/user";
import "../styles/protected-route.css";

/**
 * Protects routes from global use.
 * @param {Object} `Object gets descructed~
 */
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      User.getUser((user, err) => {
        if (err) setUser("NO_AUTH");
        else setUser(user);
      });
    }
    return () => {
      mounted = false;
    };
  }, []);

  if (user === null)
    return (
      <div className="center-loading">
        <Spin size="large" tip="Authenticating user..." />
      </div>
    );

  return (
    <Route
      {...rest}
      render={(props) => {
        if (user !== "NO_AUTH") return <Component {...rest} user={user} />;
        else
          return (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location },
              }}
            />
          );
      }}
    />
  );
};

export default ProtectedRoute;
