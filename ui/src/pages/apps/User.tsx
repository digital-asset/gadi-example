// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Route, Switch } from "react-router-dom";
import classnames from "classnames";
import useStyles from "./styles";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import DamlLedger from "@daml/react";
import { useUserState } from "../../context/UserContext";
import { wsBaseUrl, httpBaseUrl } from "../../config";
import { Group, Person, Fingerprint, LockOutlined } from "@material-ui/icons";
import { SidebarEntry } from "../../components/Sidebar/SidebarEntry";
import SignupRequests from "../user/SignupRequests";
import AuthRequests from "../user/AuthRequests";
import AuthProposals from "../user/AuthProposals";

export default function User() {
  const classes = useStyles();
  const user = useUserState();

  const entries : SidebarEntry[] = [
    { key: "onboarding", label: "Onboarding", path: "/apps/user/onboarding", render: () => <></>, icon: (<Group/>), children: [
      { key: "signuprequests", label: "Self", path: "/apps/user/onboarding/signuprequests", render: () => <SignupRequests />, icon: (<Person/>), children: [] },
    ] },
    { key: "authentication", label: "Authentication", path: "/apps/user/authentication", render: () => <></>, icon: (<Fingerprint/>), children: [
      { key: "authrequests", label: "Requests", path: "/apps/user/authentication/authrequests", render: () => <AuthRequests />, icon: (<LockOutlined/>), children: [] },
      { key: "authproposals", label: "Terms", path: "/apps/user/authentication/authproposals", render: () => <AuthProposals />, icon: (<LockOutlined/>), children: [] },
    ] }
  ]

  const getChildren = (e : SidebarEntry) : SidebarEntry[] => {
    return e.children.concat(e.children.flatMap(c => getChildren(c)));
  }
  const allEntries = entries.flatMap(e => getChildren(e).concat([e]));

  return (
    <DamlLedger party={user.party} token={user.token} httpBaseUrl={httpBaseUrl} wsBaseUrl={wsBaseUrl}>
      <div className={classes.root}>
          <>
            <Header />
            <Sidebar entries={entries} />
            <div
              className={classnames(classes.content, {
                [classes.contentShift]: true,
              })}
            >
              <div className={classes.fakeToolbar} />
              <Switch>
                {allEntries.map(e => 
                  <Route exact={true} key={e.key} label={e.label} path={e.path} render={e.render} />
                )}
              </Switch>
            </div>
          </>
      </div>
    </DamlLedger>
  );
}
