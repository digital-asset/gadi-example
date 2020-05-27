// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { useStreamQuery, useLedger } from "@daml/react";
import { RegisteredServiceProvider, AuthenticationAgreement, ValidationResult, ValidationRequest, ValidationTermsProposal, ValidationAgreement, Wallet } from "@daml2js/digital-trust-1.0.0/lib/Main";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Typography, Button } from "@material-ui/core";
import useStyles from "../styles";
import { ContractId } from "@daml/types";
import { CreateEvent } from "@daml/ledger";

export default function AuthAgreements() {
  const classes = useStyles();

  const ledger = useLedger();
  const regSps = useStreamQuery(RegisteredServiceProvider).contracts;
  const wallet = useStreamQuery(Wallet).contracts.find(w => w.payload.owner === regSps[0]?.payload.serviceProvider);
  const requests = useStreamQuery(AuthenticationAgreement).contracts;
  const valRequests = useStreamQuery(ValidationRequest).contracts;
  const valProposals = useStreamQuery(ValidationTermsProposal).contracts;
  const valAgreements = useStreamQuery(ValidationAgreement).contracts;
  const validationResults = useStreamQuery(ValidationResult).contracts;

  const isRegSp = regSps.length > 0;
  if (!isRegSp) return (null);

  const hasRequested = (r : CreateEvent<AuthenticationAgreement>) => {
    const hasValRequest = valRequests.find(v => v.payload.serviceProvider === r.payload.serviceProvider && v.payload.user === r.payload.user) !== undefined;
    const hasValProposal = valProposals.find(v => v.payload.serviceProvider === r.payload.serviceProvider && v.payload.user === r.payload.user) !== undefined;
    const hasValAgreement = valAgreements.find(v => v.payload.serviceProvider === r.payload.serviceProvider && v.payload.user === r.payload.user) !== undefined;
    return hasValRequest || hasValProposal || hasValAgreement;
  }

  const hasValidation = (r : CreateEvent<AuthenticationAgreement>) => {
    return validationResults.find(v => v.payload.issuer === r.payload.issuer && v.payload.user === r.payload.user) !== undefined;
  }

  const handleValidation = async (requestCid : ContractId<AuthenticationAgreement>) => {
    if (!wallet) return;
    await ledger.exercise(AuthenticationAgreement.AuthenticationAgreement_RequestValidation, requestCid, { walletCid: wallet.contractId });
  }

  const handleAuthentication = async (requestCid : ContractId<AuthenticationAgreement>) => {
    await ledger.exercise(AuthenticationAgreement.AuthenticationAgreement_Authenticate, requestCid, { validationResultCid: validationResults[0].contractId });
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={9}>
          <Typography variant="h2" className={classes.heading}>Authentication Agreements</Typography>
        </Grid>
        <Grid item xs={3}>
        </Grid>
      </Grid>
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>Contract</TableCell>
            <TableCell key={1} className={classes.tableCell}>User</TableCell>
            <TableCell key={2} className={classes.tableCell}>Service Provider</TableCell>
            <TableCell key={3} className={classes.tableCell}>Issuer</TableCell>
            <TableCell key={4} className={classes.tableCell}>Terms</TableCell>
            <TableCell key={5} className={classes.tableCell}>Claim</TableCell>
            <TableCell key={6} className={classes.tableCell}>Validation</TableCell>
            <TableCell key={7} className={classes.tableCell}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((r, i) => (
            <TableRow key={i} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{r.contractId}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{r.payload.user}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{r.payload.serviceProvider}</TableCell>
              <TableCell key={3} className={classes.tableCell}>{r.payload.issuer}</TableCell>
              <TableCell key={4} className={classes.tableCell}>{r.payload.terms}</TableCell>
              <TableCell key={5} className={classes.tableCell}>{r.payload.claim}</TableCell>
              <TableCell key={6} className={classes.tableCell}>
                <Button color="secondary" variant="contained" size="small" component="span" disabled={hasRequested(r) || hasValidation(r)} onClick={() => handleValidation(r.contractId)}>Request</Button>
              </TableCell>
              <TableCell key={7} className={classes.tableCell}>
                <Button color="secondary" variant="contained" size="small" component="span" disabled={!hasValidation(r)} onClick={() => handleAuthentication(r.contractId)}>Authenticate</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}