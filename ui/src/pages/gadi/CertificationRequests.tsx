// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { useStreamQuery, useQuery, useLedger } from "@daml/react";
import {  Gadi, CertificationRequest } from "@daml2js/digital-trust-1.0.0/lib/Main";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Typography, Button } from "@material-ui/core";
import useStyles from "../styles";
import { ContractId } from "@daml/types";

export default function CertificationRequests() {
  const classes = useStyles();

  const ledger = useLedger();
  const gadis = useQuery(Gadi).contracts;
  const requests = useStreamQuery(CertificationRequest).contracts;

  const isGadi = gadis.length > 0;
  if (!isGadi) return (null);

  const handleAccept = async (requestCid : ContractId<CertificationRequest>) => {
    await ledger.exercise(CertificationRequest.CertificationRequest_Accept, requestCid, { });
  }

  const handleReject = async (requestCid : ContractId<CertificationRequest>) => {
    await ledger.exercise(CertificationRequest.CertificationRequest_Reject, requestCid, {});
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={9}>
          <Typography variant="h2" className={classes.heading}>Certification Requests</Typography>
        </Grid>
        <Grid item xs={3}>
        </Grid>
      </Grid>
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>Contract</TableCell>
            <TableCell key={1} className={classes.tableCell}>Issuer</TableCell>
            <TableCell key={2} className={classes.tableCell}>DAP</TableCell>
            <TableCell key={3} className={classes.tableCell}>GADI</TableCell>
            <TableCell key={4} className={classes.tableCell}></TableCell>
            <TableCell key={5} className={classes.tableCell}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((r, i) => (
            <TableRow key={i} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{r.contractId}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{r.payload.issuer}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{r.payload.dap}</TableCell>
              <TableCell key={3} className={classes.tableCell}>{r.payload.gadi}</TableCell>
              <TableCell key={4} className={classes.tableCell}>
                <Button color="secondary" variant="contained" size="small" component="span" onClick={() => handleAccept(r.contractId)}>Accept</Button>
              </TableCell>
              <TableCell key={5} className={classes.tableCell}>
                <Button color="secondary" variant="contained" size="small" component="span" onClick={() => handleReject(r.contractId)}>Reject</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}