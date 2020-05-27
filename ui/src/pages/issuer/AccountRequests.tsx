// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { useStreamQuery, useQuery, useLedger } from "@daml/react";
import { Issuer, CertifiedIssuer, AccountRequest, CertificationRequest } from "@daml2js/digital-trust-1.0.0/lib/Main";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Typography, Button, CircularProgress } from "@material-ui/core";
import useStyles from "../styles";
import { parties } from "../../parties";
import { ContractId } from "@daml/types";

export default function AccountRequests() {
  const classes = useStyles();

  const [isRequesting, setIsRequesting] = useState(false);

  const ledger = useLedger();
  const issuers = useQuery(Issuer).contracts;
  const accRequests = useStreamQuery(AccountRequest).contracts;
  const certRequests = useStreamQuery(CertificationRequest).contracts;
  const certIssuers = useStreamQuery(CertifiedIssuer).contracts;

  const isIssuer = issuers.length > 0;
  const isCertifiedIssuer = certIssuers.length > 0;
  const displayButton = isIssuer && accRequests.length === 0 && certRequests.length === 0 && !isCertifiedIssuer;
  if (!isIssuer) return (null);

  const handleRequest = async () => {
    setIsRequesting(true);
    await ledger.exercise(Issuer.RequestAccount, issuers[0].contractId, { dap: parties.dap });
    setIsRequesting(false);
  }

  const handleCancel = async (requestCid : ContractId<AccountRequest>) => {
    await ledger.exercise(AccountRequest.AccountRequest_Cancel, requestCid, {});
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={8}>
          <Typography variant="h2" className={classes.heading}>Account Requests</Typography>
        </Grid>
        <Grid item xs={4}>
          {displayButton && (
            isRequesting ? <CircularProgress size="small" /> : <Button color="secondary" variant="contained" className={classes.buttonLifecycle} onClick={handleRequest}>Request Account</Button>
          )}
        </Grid>
      </Grid>
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>Contract</TableCell>
            <TableCell key={1} className={classes.tableCell}>Issuer Admin</TableCell>
            <TableCell key={2} className={classes.tableCell}>DAP Admin</TableCell>
            <TableCell key={3} className={classes.tableCell}></TableCell>
            <TableCell key={4} className={classes.tableCell}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accRequests.map((r, i) => (
            <TableRow key={i} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{r.contractId}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{r.payload.issuer}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{r.payload.dap}</TableCell>
              <TableCell key={3} className={classes.tableCell}>
                {isIssuer && <Button color="secondary" variant="contained" size="small" component="span" onClick={() => handleCancel(r.contractId)}>Cancel</Button>}
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