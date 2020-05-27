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
import { Group, Person, PersonPinCircle, NotListedLocation } from "@material-ui/icons";
import { SidebarEntry } from "../../components/Sidebar/SidebarEntry";
import MembershipRequests from "../dap/MembershipRequests";
import AccountRequests from "../dap/AccountRequests";
import RegistrationRequests from "../dap/RegistrationRequests";
import AddressRequests from "../dap/AddressRequests";

export default function DAP() {
  const classes = useStyles();
  const user = useUserState();

  const entries : SidebarEntry[] = [
    { key: "onboarding", label: "Onboarding", path: "/apps/dap/onboarding", render: () => <></>, icon: (<Group/>), children: [
      { key: "membershiprequests", label: "Self", path: "/apps/dap/onboarding/membershiprequests", render: () => <MembershipRequests />, icon: (<Person/>), children: [] },
      { key: "accountrequests", label: "Issuers", path: "/apps/dap/onboarding/accountrequests", render: () => <AccountRequests />, icon: (<Person/>), children: [] },
      { key: "registrationrequests", label: "Verifiers", path: "/apps/dap/onboarding/registrationrequests", render: () => <RegistrationRequests />, icon: (<Person/>), children: [] },
    ] },
    { key: "digitaladdresses", label: "Digital Addresses", path: "/apps/dap/digitaladdresses", render: () => <></>, icon: (<PersonPinCircle/>), children: [
      { key: "addressrequests", label: "Requests", path: "/apps/dap/digitaladdresses/addressrequests", render: () => <AddressRequests />, icon: (<NotListedLocation/>), children: [] },
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
