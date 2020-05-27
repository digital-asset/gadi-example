// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { useStreamQuery, useLedger } from "@daml/react";
import { User, AuthenticationTermsProposal } from "@daml2js/digital-trust-1.0.0/lib/Main";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Typography, Button } from "@material-ui/core";
import useStyles from "../styles";
import { ContractId } from "@daml/types";
import { parties } from "../../parties";

export default function AuthProposals() {
  const classes = useStyles();

  const ledger = useLedger();
  const users = useStreamQuery(User).contracts;
  const requests = useStreamQuery(AuthenticationTermsProposal).contracts;

  const isUser = users.length > 0;
  if (!isUser) return (null);

  const handleAccept = async (requestCid : ContractId<AuthenticationTermsProposal>) => {
    await ledger.exercise(AuthenticationTermsProposal.AuthenticationTermsProposal_Accept, requestCid, { issuer: parties.issuer });
  }

  const handleReject = async (requestCid : ContractId<AuthenticationTermsProposal>) => {
    await ledger.exercise(AuthenticationTermsProposal.AuthenticationTermsProposal_Reject, requestCid, {});
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
          {requests.map((p, i) => (
            <TableRow key={i} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{p.contractId}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{p.payload.serviceProvider}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{p.payload.user}</TableCell>
              <TableCell key={3} className={classes.tableCell}>{p.payload.terms}</TableCell>
              <TableCell key={4} className={classes.tableCell}>{p.payload.claim}</TableCell>
              <TableCell key={5} className={classes.tableCell}>
                <Button color="secondary" variant="contained" size="small" component="span" onClick={() => handleAccept(p.contractId)}>Accept</Button>
              </TableCell>
              <TableCell key={6} className={classes.tableCell}>
                <Button color="secondary" variant="contained" size="small" component="span" onClick={() => handleReject(p.contractId)}>Reject</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}