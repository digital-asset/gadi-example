// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { useStreamQuery, useQuery, useLedger } from "@daml/react";
import { Gadi, MembershipRequest } from "@daml2js/digital-trust-1.0.0/lib/Main";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Typography, Button } from "@material-ui/core";
import useStyles from "../styles";
import { ContractId } from "@daml/types";

export default function MembershipRequests() {
  const classes = useStyles();

  const ledger = useLedger();
  const gadis = useQuery(Gadi).contracts;
  const requests = useStreamQuery(MembershipRequest).contracts;

  const isGadi = gadis.length > 0;
  if (!isGadi) return (null);

  const handleAccept = async (requestCid : ContractId<MembershipRequest>) => {
    await ledger.exercise(MembershipRequest.MembershipRequest_Accept, requestCid, { gadiCid: gadis[0].contractId });
  }

  const handleReject = async (requestCid : ContractId<MembershipRequest>) => {
    await ledger.exercise(MembershipRequest.MembershipRequest_Reject, requestCid, {});
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={9}>
          <Typography variant="h2" className={classes.heading}>Membership Requests</Typography>
        </Grid>
        <Grid item xs={3}>
        </Grid>
      </Grid>
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>Contract</TableCell>
            <TableCell key={1} className={classes.tableCell}>DAP</TableCell>
            <TableCell key={2} className={classes.tableCell}>GADI</TableCell>
            <TableCell key={3} className={classes.tableCell}></TableCell>
            <TableCell key={4} className={classes.tableCell}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((p, i) => (
            <TableRow key={i} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{p.contractId}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{p.payload.dap}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{p.payload.gadi}</TableCell>
              <TableCell key={3} className={classes.tableCell}>
                <Button color="secondary" variant="contained" size="small" component="span" onClick={() => handleAccept(p.contractId)}>Accept</Button>
              </TableCell>
              <TableCell key={4} className={classes.tableCell}>
                <Button color="secondary" variant="contained" size="small" component="span" onClick={() => handleReject(p.contractId)}>Reject</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}