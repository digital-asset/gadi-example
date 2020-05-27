// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { useStreamQuery } from "@daml/react";
import { RegisteredServiceProvider, AuthenticationResult } from "@daml2js/digital-trust-1.0.0/lib/Main";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Typography } from "@material-ui/core";
import useStyles from "../styles";

export default function AuthResults() {
  const classes = useStyles();

  const regSps = useStreamQuery(RegisteredServiceProvider).contracts;
  const requests = useStreamQuery(AuthenticationResult).contracts;

  const isRegSp = regSps.length > 0;
  if (!isRegSp) return (null);
  console.log(requests.length);
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={9}>
          <Typography variant="h2" className={classes.heading}>Authentication Results</Typography>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}