// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { useStreamQuery, useLedger } from "@daml/react";
import { RegisteredServiceProvider, AuthenticationTermsProposal } from "@daml2js/digital-trust-1.0.0/lib/Main";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Typography, Button } from "@material-ui/core";
import useStyles from "../styles";
import { ContractId } from "@daml/types";

export default function AuthProposals() {
  const classes = useStyles();

  const ledger = useLedger();
  const regSps = useStreamQuery(RegisteredServiceProvider).contracts;
  const requests = useStreamQuery(AuthenticationTermsProposal).contracts;

  const isRegSp = regSps.length > 0;
  if (!isRegSp) return (null);

  const handleCancel = async (requestCid : ContractId<AuthenticationTermsProposal>) => {
    await ledger.exercise(AuthenticationTermsProposal.AuthenticationTermsProposal_Cancel, requestCid, {});
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={9}>
          <Typography variant="h2" className={classes.heading}>Authentication Terms</Typography>
        </Grid>
        <Grid item xs={3}>
        </Grid>
      </Grid>
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>Contract</TableCell>
            <TableCell key={1} className={classes.tableCell}>Service Provider</TableCell>
            <TableCell key={2} className={classes.tableCell}>User</TableCell>
            <TableCell key={3} className={classes.tableCell}>Terms</TableCell>
            <TableCell key={4} className={classes.tableCell}>Claim</TableCell>
            <TableCell key={5} className={classes.tableCell}></TableCell>
            <TableCell key={6} className={classes.tableCell}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((r, i) => (
            <TableRow key={i} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{r.contractId}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{r.payload.serviceProvider}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{r.payload.user}</TableCell>
              <TableCell key={3} className={classes.tableCell}>{r.payload.terms}</TableCell>
              <TableCell key={4} className={classes.tableCell}>{r.payload.claim}</TableCell>
              <TableCell key={5} className={classes.tableCell}>
                <Button color="secondary" variant="contained" size="small" component="span" onClick={() => handleCancel(r.contractId)}>Cancel</Button>
              </TableCell>
              <TableCell key={6} className={classes.tableCell}>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}