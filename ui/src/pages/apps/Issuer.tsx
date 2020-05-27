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
import { Person, Group, VerifiedUser, PlaylistAddCheck } from "@material-ui/icons";
import { SidebarEntry } from "../../components/Sidebar/SidebarEntry";
import AccountRequests from "../issuer/AccountRequests";
import SignupRequests from "../issuer/SignupRequests";
import ValidationRequests from "../issuer/ValidationRequests";
import ValidationAgreements from "../issuer/ValidationAgreements";

export default function Issuer() {
  const classes = useStyles();
  const user = useUserState();

  const entries : SidebarEntry[] = [
    { key: "onboarding", label: "Onboarding", path: "/apps/issuer/onboarding", render: () => <></>, icon: (<Group/>), children: [
      { key: "accountrequests", label: "Self", path: "/apps/issuer/onboarding/accountrequests", render: () => <AccountRequests />, icon: (<Person/>), children: [] },
      { key: "signuprequests", label: "Users", path: "/apps/issuer/onboarding/signuprequests", render: () => <SignupRequests />, icon: (<Person/>), children: [] },
    ] },
    { key: "validations", label: "Validation", path: "/apps/issuer/validations", render: () => <></>, icon: (<VerifiedUser/>), children: [
      { key: "validationrequests", label: "Requests", path: "/apps/issuer/validations/validationrequests", render: () => <ValidationRequests />, icon: (<PlaylistAddCheck/>), children: [] },
      { key: "validationagreements", label: "Agreements", path: "/apps/issuer/validations/validationagreements", render: () => <ValidationAgreements />, icon: (<PlaylistAddCheck/>), children: [] },
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
