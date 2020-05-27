// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { useStreamQuery, useQuery, useLedger } from "@daml/react";
import { Dap, AuthorizedDap, MembershipRequest } from "@daml2js/digital-trust-1.0.0/lib/Main";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Typography, Button, CircularProgress } from "@material-ui/core";
import useStyles from "../styles";
import { parties } from "../../parties";
import { ContractId } from "@daml/types";

export default function MembershipRequests() {
  const classes = useStyles();

  const [isRequesting, setIsRequesting] = useState(false);

  const ledger = useLedger();
  const daps = useQuery(Dap).contracts;
  const authDaps = useStreamQuery(AuthorizedDap).contracts;
  const requests = useStreamQuery(MembershipRequest).contracts;

  const isDap = daps.length > 0;
  const isAuthorizedDap = authDaps.length > 0;
  const displayButton = isDap && requests.length === 0 && !isAuthorizedDap;
  if (!isDap) return (null);

  const handleRequest = async () => {
    setIsRequesting(true);
    await ledger.exercise(Dap.RequestMembership, daps[0].contractId, { gadi: parties.gadi });
    setIsRequesting(false);
  }

  const handleCancel = async (requestCid : ContractId<MembershipRequest>) => {
    await ledger.exercise(MembershipRequest.MembershipRequest_Cancel, requestCid, {});
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={9}>
          <Typography variant="h2" className={classes.heading}>Membership Requests</Typography>
        </Grid>
        <Grid item xs={3}>
          {displayButton && (
            isRequesting ? <CircularProgress size="small" /> : <Button color="secondary" variant="contained" className={classes.buttonLifecycle} onClick={handleRequest}>Request Membership</Button>
          )}
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
                <Button color="secondary" variant="contained" size="small" component="span" onClick={() => handleCancel(p.contractId)}>Cancel</Button>
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