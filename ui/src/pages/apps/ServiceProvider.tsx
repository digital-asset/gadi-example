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
import RegistrationRequests from "../serviceprovider/RegistrationRequests";
import AuthRequests from "../serviceprovider/AuthRequests";
import AuthProposals from "../serviceprovider/AuthProposals";
import AuthAgreements from "../serviceprovider/AuthAgreements";
import ValidationProposals from "../serviceprovider/ValidationProposals";
import AuthResults from "../serviceprovider/AuthResults";

export default function ServiceProvider() {
  const classes = useStyles();
  const user = useUserState();

  const entries : SidebarEntry[] = [
    { key: "onboarding", label: "Onboarding", path: "/apps/serviceprovider/onboarding", render: () => <></>, icon: (<Group/>), children: [
      { key: "registrationrequests", label: "Self", path: "/apps/serviceprovider/onboarding/registrationrequests", render: () => <RegistrationRequests />, icon: (<Person/>), children: [] },
    ] },
    { key: "authentication", label: "Authentication", path: "/apps/serviceprovider/authentication", render: () => <></>, icon: (<Fingerprint/>), children: [
      { key: "authrequests", label: "Requests", path: "/apps/serviceprovider/authentication/authrequests", render: () => <AuthRequests />, icon: (<LockOutlined/>), children: [] },
      { key: "authproposals", label: "Proposals", path: "/apps/serviceprovider/authentication/authproposals", render: () => <AuthProposals />, icon: (<LockOutlined/>), children: [] },
      { key: "authagreements", label: "Agreements", path: "/apps/serviceprovider/authentication/authagreements", render: () => <AuthAgreements />, icon: (<LockOutlined/>), children: [] },
      { key: "validationproposals", label: "Validations", path: "/apps/serviceprovider/authentication/validationproposals", render: () => <ValidationProposals />, icon: (<LockOutlined/>), children: [] },
      { key: "authresults", label: "Results", path: "/apps/serviceprovider/authentication/authresults", render: () => <AuthResults />, icon: (<LockOutlined/>), children: [] },
    ] },
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
