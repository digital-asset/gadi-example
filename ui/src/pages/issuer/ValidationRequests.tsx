// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { useStreamQuery, useLedger } from "@daml/react";
import { CertifiedIssuer, ValidationRequest } from "@daml2js/digital-trust-1.0.0/lib/Main";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Typography, Button } from "@material-ui/core";
import useStyles from "../styles";
import { ContractId } from "@daml/types";

export default function ValidationRequests() {
  const classes = useStyles();

  const ledger = useLedger();
  const certifiedIssuers = useStreamQuery(CertifiedIssuer).contracts;
  const requests = useStreamQuery(ValidationRequest).contracts;

  const isCertifiedIssuer = certifiedIssuers.length > 0;
  if (!isCertifiedIssuer) return (null);

  const handleAccept = async (requestCid : ContractId<ValidationRequest>) => {
    await ledger.exercise(ValidationRequest.ValidationRequest_Accept, requestCid, { terms: "Issuer Terms", price: "10.0" });
  }

  const handleReject = async (requestCid : ContractId<ValidationRequest>) => {
    await ledger.exercise(ValidationRequest.ValidationRequest_Reject, requestCid, {});
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={9}>
          <Typography variant="h2" className={classes.heading}>Validation Requests</Typography>
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
            <TableCell key={4} className={classes.tableCell}>Claim</TableCell>
            <TableCell key={5} className={classes.tableCell}></TableCell>
            <TableCell key={6} className={classes.tableCell}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((r, i) => (
            <TableRow key={i} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{r.contractId}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{r.payload.user}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{r.payload.serviceProvider}</TableCell>
              <TableCell key={3} className={classes.tableCell}>{r.payload.issuer}</TableCell>
              <TableCell key={4} className={classes.tableCell}>{r.payload.claim}</TableCell>
              <TableCell key={5} className={classes.tableCell}>
                <Button color="secondary" variant="contained" size="small" component="span" onClick={() => handleAccept(r.contractId)}>Accept</Button>
              </TableCell>
              <TableCell key={6} className={classes.tableCell}>
                <Button color="secondary" variant="contained" size="small" component="span" onClick={() => handleReject(r.contractId)}>Reject</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
