// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { useStreamQuery, useQuery, useLedger } from "@daml/react";
import { User, AuthenticationResult, AuthenticationRequest } from "@daml2js/digital-trust-1.0.0/lib/Main";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Typography, Button, CircularProgress } from "@material-ui/core";
import useStyles from "../styles";
import { parties } from "../../parties";
import { ContractId } from "@daml/types";

export default function AuthRequests() {
  const classes = useStyles();

  const [isRequesting, setIsRequesting] = useState(false);

  const ledger = useLedger();
  const users = useQuery(User).contracts;
  const authResults = useStreamQuery(AuthenticationResult).contracts;
  const requests = useStreamQuery(AuthenticationRequest).contracts;

  const isUser = users.length > 0;
  const isAuthUser = authResults.length > 0;
  const displayButton = isUser && requests.length === 0 && !isAuthUser;
  if (!isUser) return (null);

  const handleRequest = async () => {
    setIsRequesting(true);
    await ledger.exercise(User.RequestAuthentication, users[0].contractId, { serviceProvider: parties.serviceProvider });
    setIsRequesting(false);
  }

  const handleCancel = async (requestCid : ContractId<AuthenticationRequest>) => {
    await ledger.exercise(AuthenticationRequest.AuthenticationRequest_Cancel, requestCid, {});
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={9}>
          <Typography variant="h2" className={classes.heading}>Authentication Requests</Typography>
        </Grid>
        <Grid item xs={3}>
          {displayButton && (
            isRequesting ? <CircularProgress size="small" /> : <Button color="secondary" variant="contained" className={classes.buttonLifecycle} onClick={handleRequest}>Authenticate</Button>
          )}
        </Grid>
      </Grid>
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>Contract</TableCell>
            <TableCell key={1} className={classes.tableCell}>Service Provider</TableCell>
            <TableCell key={2} className={classes.tableCell}>User</TableCell>
            <TableCell key={3} className={classes.tableCell}></TableCell>
            <TableCell key={4} className={classes.tableCell}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((r, i) => (
            <TableRow key={i} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{r.contractId}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{r.payload.serviceProvider}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{r.payload.user}</TableCell>
              <TableCell key={3} className={classes.tableCell}>
                <Button color="secondary" variant="contained" size="small" component="span" onClick={() => handleCancel(r.contractId)}>Cancel</Button>
              </TableCell>
              <TableCell key={4} className={classes.tableCell}>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}