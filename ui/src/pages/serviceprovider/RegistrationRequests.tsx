// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { useStreamQuery, useLedger } from "@daml/react";
import { ServiceProvider, RegistrationRequest, RegisteredServiceProvider } from "@daml2js/digital-trust-1.0.0/lib/Main";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Typography, Button, CircularProgress } from "@material-ui/core";
import useStyles from "../styles";
import { parties } from "../../parties";
import { ContractId } from "@daml/types";

export default function RegistrationRequests() {
  const classes = useStyles();

  const [isRequesting, setIsRequesting] = useState(false);

  const ledger = useLedger();
  const sps = useStreamQuery(ServiceProvider).contracts;
  const registeredSps = useStreamQuery(RegisteredServiceProvider).contracts;
  const requests = useStreamQuery(RegistrationRequest).contracts;

  const isSp = sps.length > 0;
  const isRegisteredSp = registeredSps.length > 0;
  const displayButton = isSp && requests.length === 0 && !isRegisteredSp;
  if (!isSp) return (null);

  const handleRequest = async () => {
    setIsRequesting(true);
    await ledger.exercise(ServiceProvider.RequestRegistration, sps[0].contractId, { dap: parties.dap });
    setIsRequesting(false);
  }

  const handleCancel = async (requestCid : ContractId<RegistrationRequest>) => {
    await ledger.exercise(RegistrationRequest.RegistrationRequest_Cancel, requestCid, {});
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={9}>
          <Typography variant="h2" className={classes.heading}>Service Provider Registration Requests</Typography>
        </Grid>
        <Grid item xs={3}>
          {displayButton && (
            isRequesting ? <CircularProgress size="small" /> : <Button color="secondary" variant="contained" className={classes.buttonLifecycle} onClick={handleRequest}>Request Registration</Button>
          )}
        </Grid>
      </Grid>
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>Contract</TableCell>
            <TableCell key={1} className={classes.tableCell}>Service Provider</TableCell>
            <TableCell key={2} className={classes.tableCell}>DAP</TableCell>
            <TableCell key={3} className={classes.tableCell}></TableCell>
            <TableCell key={4} className={classes.tableCell}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((r, i) => (
            <TableRow key={i} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{r.contractId}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{r.payload.serviceProvider}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{r.payload.dap}</TableCell>
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