// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import ErrorComponent from "../pages/error/Error";
import Login from "../pages/login/Login";
import { useUserState, useUserDispatch } from "../context/UserContext";
import DAP from "../pages/apps/DAP";
import GADI from "../pages/apps/GADI";
import Issuer from "../pages/apps/Issuer";
import ServiceProvider from "../pages/apps/ServiceProvider";
import User from "../pages/apps/User";

export default function Main() {
  const user = useUserState();

  const isDap = user.party === "DAP";
  const isGadi = user.party === "GADI";
  const isIssuer = user.party === "ISSUER";
  const isServiceProvider = user.party === "SP";
  const isUser = !isDap && !isGadi && !isIssuer && !isServiceProvider;
  
  const defaultRoute = isDap
    ? "/apps/dap"
    : (isGadi
      ? "/apps/gadi"
      : (isIssuer
        ? "/apps/issuer"
        : (isServiceProvider
          ? "/apps/serviceprovider"
          : "/apps/user")));

  return (
    <HashRouter>
      <Switch>
        <PrivateRoute exact path="/" component={RootRoute} />
        <Route
          exact
          path="/apps"
          render={() => <Redirect to={defaultRoute} />}
        />
        {isDap && <PrivateRoute path="/apps/dap" component={DAP} />}
        {isGadi && <PrivateRoute path="/apps/gadi" component={GADI} />}
        {isIssuer && <PrivateRoute path="/apps/issuer" component={Issuer} />}
        {isServiceProvider && <PrivateRoute path="/apps/serviceprovider" component={ServiceProvider} />}
        {isUser && <PrivateRoute path="/apps/user" component={User} />}
        <PublicRoute path="/login" component={Login} />
        <Route component={ErrorComponent} />
      </Switch>
    </HashRouter>
  );

  // #######################################################################

  function RootRoute() {
    var userDispatch = useUserDispatch();
  
    useEffect(() => {
      const url = new URL(window.location.toString());
      const token = url.searchParams.get('token');
      if (token === null) {
        return;
      }
      const party = url.searchParams.get('party');
      if (party === null) {
        throw Error("When 'token' is passed via URL, 'party' must be passed too.");
      }
      localStorage.setItem("daml.party", party);
      localStorage.setItem("daml.token", token);
  
      userDispatch({ type: "LOGIN_SUCCESS", token, party });
    })
  
    return (
      <Redirect to="/apps" />
    )
  }
  
  function PrivateRoute({ component, ...rest } : any) {
    return (
      <Route
        {...rest}
        render={props =>
          user.isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest } : any) {
    return (
      <Route
        {...rest}
        render={props =>
          user.isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
