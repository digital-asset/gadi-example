// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Chip } from "@material-ui/core";
import { ExitToApp } from "@material-ui/icons";
import useStyles from "./styles";
import { useUserDispatch, signOut, useUserState } from "../../context/UserContext";
import { useStreamQuery } from "@daml/react";
import { Wallet, RegisteredServiceProvider, CertifiedIssuer, DigitalAddress, AuthenticationResult } from "@daml2js/digital-trust-1.0.0/lib/Main";

function Header({ history } : RouteComponentProps) {
  const classes = useStyles();

  const user = useUserState();
  const userDispatch = useUserDispatch();

  const certifiedIssuers = useStreamQuery(CertifiedIssuer).contracts;
  const registeredSps = useStreamQuery(RegisteredServiceProvider).contracts;
  const hasWallet = certifiedIssuers.length > 0 || registeredSps.length > 0;
  const wallets = useStreamQuery(Wallet).contracts;
  const wallet = wallets.find(w => w.payload.owner === user.party);

  const addresses = useStreamQuery(DigitalAddress).contracts;
  const address = addresses.find(a => a.payload.user === user.party);
  
  const authResults = useStreamQuery(AuthenticationResult).contracts;
  const authResult = authResults.find(a => a.payload.user === user.party);

  const isDap = user.party === "DAP";
  const isGadi = user.party === "GADI";
  const isIssuer = user.party === "ISSUER";
  const isServiceProvider = user.party === "SP";
  const role = isDap
    ? "DAP"
    : (isGadi
      ? "GADI"
      : (isIssuer
        ? "Issuer"
        : (isServiceProvider
          ? "Verifier"
          : "User")));

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6">GADI App ({role})</Typography>
        <div className={classes.grow} />
        {authResult && <Chip className={classes.authChip} label={"Auth: " + authResult.payload.claim} />}
        {hasWallet && wallet && <Typography variant="h6">Wallet: ${wallet.payload.balance}</Typography>}
        {address && <Typography variant="h6">Address: {address.payload.digitalAddress}</Typography>}
        <Typography variant="h6" style={{ paddingLeft: "20px" }}>User: {user.party}</Typography>
        <IconButton
          aria-haspopup="true"
          color="inherit"
          className={classes.headerMenuButton}
          aria-controls="profile-menu"
          onClick={() => signOut(userDispatch, history)}
        >
          <ExitToApp classes={{ root: classes.headerIcon }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default withRouter(Header);