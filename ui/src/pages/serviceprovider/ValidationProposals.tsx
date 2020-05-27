// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { useStreamQuery, useLedger } from "@daml/react";
import { RegisteredServiceProvider, ValidationTermsProposal } from "@daml2js/digital-trust-1.0.0/lib/Main";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Typography, Button } from "@material-ui/core";
import useStyles from "../styles";
import { ContractId } from "@daml/types";
import { Claim } from "@daml2js/digital-trust-1.0.0/lib/Types";

export default function ValidationProposals() {
  const classes = useStyles();

  const ledger = useLedger();
  const regSps = useStreamQuery(RegisteredServiceProvider).contracts;
  const requests = useStreamQuery(ValidationTermsProposal).contracts;

  const isRegSp = regSps.length > 0;
  if (!isRegSp) return (null);

  const handleAccept = async (requestCid : ContractId<ValidationTermsProposal>) => {
    await ledger.exercise(ValidationTermsProposal.ValidationTermsProposal_Accept, requestCid, { terms: "SP Terms", claim: Claim.COVID19_IMM, registeredServiceProviderCid: regSps[0].contractId });
  }

  const handleReject = async (requestCid : ContractId<ValidationTermsProposal>) => {
    await ledger.exercise(ValidationTermsProposal.ValidationTermsProposal_Reject, requestCid, {});
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={9}>
          <Typography variant="h2" className={classes.heading}>Validation Terms</Typography>
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
            <TableCell key={6} className={classes.tableCell}>Price</TableCell>
            <TableCell key={7} className={classes.tableCell}></TableCell>
            <TableCell key={8} className={classes.tableCell}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((p, i) => (
            <TableRow key={i} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{p.contractId}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{p.payload.user}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{p.payload.serviceProvider}</TableCell>
              <TableCell key={3} className={classes.tableCell}>{p.payload.issuer}</TableCell>
              <TableCell key={4} className={classes.tableCell}>{p.payload.terms}</TableCell>
              <TableCell key={5} className={classes.tableCell}>{p.payload.claim}</TableCell>
              <TableCell key={6} className={classes.tableCell}>${p.payload.price}</TableCell>
              <TableCell key={7} className={classes.tableCell}>
                <Button color="secondary" variant="contained" size="small" component="span" onClick={() => handleAccept(p.contractId)}>Accept</Button>
              </TableCell>
              <TableCell key={8} className={classes.tableCell}>
                <Button color="secondary" variant="contained" size="small" component="span" onClick={() => handleReject(p.contractId)}>Reject</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}