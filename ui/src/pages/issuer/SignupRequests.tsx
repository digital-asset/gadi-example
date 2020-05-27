// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { useStreamQuery, useLedger } from "@daml/react";
import { SignupRequest, CertifiedIssuer, DigitalAddressDapRequest, DigitalAddressGadiRequest, DigitalAddress } from "@daml2js/digital-trust-1.0.0/lib/Main";
import { UserVerification, Claim } from "@daml2js/digital-trust-1.0.0/lib/Types";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Typography, Button, IconButton, Tooltip } from "@material-ui/core";
import useStyles from "../styles";
import { ContractId } from "@daml/types";
import { CheckCircle, CheckCircleOutlined } from "@material-ui/icons";
import { parties } from "../../parties";
import { CreateEvent } from "@daml/ledger";

export default function SignupRequests() {
  const classes = useStyles();

  const ledger = useLedger();
  const certifiedIssuers = useStreamQuery(CertifiedIssuer).contracts;
  const requests = useStreamQuery(SignupRequest).contracts;
  const daDapRequests = useStreamQuery(DigitalAddressDapRequest).contracts;
  const daGadiRequests = useStreamQuery(DigitalAddressGadiRequest).contracts;
  const addresses = useStreamQuery(DigitalAddress).contracts;

  const isCertifiedIssuer = certifiedIssuers.length > 0;
  if (!isCertifiedIssuer) return (null);

  const getAddress = (r : CreateEvent<SignupRequest>) => {
    return addresses.find(a => a.payload.issuer === r.payload.issuer && a.payload.user === r.payload.user);
  }

  const hasRequested = (r : CreateEvent<SignupRequest>) => {
    const hasRequestedDap = daDapRequests.find(a => a.payload.issuer === r.payload.issuer && a.payload.user === r.payload.user) !== undefined;
    const hasRequestedGadi = daGadiRequests.find(a => a.payload.issuer === r.payload.issuer && a.payload.user === r.payload.user) !== undefined;
    return hasRequestedDap || hasRequestedGadi;
  }

  const handleAccept = async (requestCid : ContractId<SignupRequest>) => {
    await ledger.exercise(SignupRequest.SignupRequest_Accept, requestCid, { verifiableClaims: [ { claim: Claim.COVID19_IMM } ], digitalAddressCid: addresses[0].contractId });
  }

  const handleReject = async (requestCid : ContractId<SignupRequest>) => {
    await ledger.exercise(SignupRequest.SignupRequest_Reject, requestCid, {});
  }

  const handleAddVerification = async (requestCid : ContractId<SignupRequest>, completedVerification : UserVerification) => {
    await ledger.exercise(SignupRequest.SignupRequest_AddVerification, requestCid, { completedVerification });
  }

  const handleRequestDigitalAddress = async (requestCid : ContractId<SignupRequest>) => {
    await ledger.exercise(SignupRequest.SignupRequest_RequestDigitalAddress, requestCid, { dap: parties.dap });
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={9}>
          <Typography variant="h2" className={classes.heading}>Signup Requests</Typography>
        </Grid>
        <Grid item xs={3}>
        </Grid>
      </Grid>
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>Contract</TableCell>
            <TableCell key={1} className={classes.tableCell}>User</TableCell>
            <TableCell key={2} className={classes.tableCell}>Issuer</TableCell>
            <TableCell key={3} className={classes.tableCell}>Verification</TableCell>
            <TableCell key={4} className={classes.tableCell}>Digital Address</TableCell>
            <TableCell key={5} className={classes.tableCell}></TableCell>
            <TableCell key={6} className={classes.tableCell}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((r, i) => (
            <TableRow key={i} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{r.contractId}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{r.payload.user}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{r.payload.issuer}</TableCell>
              <TableCell key={3} className={classes.tableCell}>
                <Tooltip title={UserVerification.IdVerification}>
                  <span>
                    <IconButton disabled={r.payload.completedVerifications.includes(UserVerification.IdVerification)} className={classes.verificationButton} onClick={() => handleAddVerification(r.contractId, UserVerification.IdVerification)}>
                      {r.payload.completedVerifications.includes(UserVerification.IdVerification) ? <CheckCircle fontSize="small" /> : <CheckCircleOutlined fontSize="small" /> }
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={UserVerification.BiometricData}>
                  <span>
                    <IconButton disabled={r.payload.completedVerifications.includes(UserVerification.BiometricData)} className={classes.verificationButton} onClick={() => handleAddVerification(r.contractId, UserVerification.BiometricData)}>
                      {r.payload.completedVerifications.includes(UserVerification.BiometricData) ? <CheckCircle fontSize="small" /> : <CheckCircleOutlined fontSize="small" /> }
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={UserVerification.KnowledgeBasedAuthentication}>
                  <span>
                    <IconButton disabled={r.payload.completedVerifications.includes(UserVerification.KnowledgeBasedAuthentication)} className={classes.verificationButton} onClick={() => handleAddVerification(r.contractId, UserVerification.KnowledgeBasedAuthentication)}>
                      {r.payload.completedVerifications.includes(UserVerification.KnowledgeBasedAuthentication) ? <CheckCircle fontSize="small" /> : <CheckCircleOutlined fontSize="small" /> }
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={UserVerification.KnowYourCustomer}>
                  <span>
                    <IconButton disabled={r.payload.completedVerifications.includes(UserVerification.KnowYourCustomer)} className={classes.verificationButton} onClick={() => handleAddVerification(r.contractId, UserVerification.KnowYourCustomer)}>
                      {r.payload.completedVerifications.includes(UserVerification.KnowYourCustomer) ? <CheckCircle fontSize="small" /> : <CheckCircleOutlined fontSize="small" /> }
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={UserVerification.RiskAssessment}>
                  <span>
                    <IconButton disabled={r.payload.completedVerifications.includes(UserVerification.RiskAssessment)} className={classes.verificationButton} onClick={() => handleAddVerification(r.contractId, UserVerification.RiskAssessment)}>
                      {r.payload.completedVerifications.includes(UserVerification.RiskAssessment) ? <CheckCircle fontSize="small" /> : <CheckCircleOutlined fontSize="small" /> }
                    </IconButton>
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell key={4} className={classes.tableCell}>
                {getAddress(r)
                  ? getAddress(r)?.payload.digitalAddress //<IconButton disabled={true} className={classes.verificationButton}><CheckCircle fontSize="small" /></IconButton>
                  : <Button color="secondary" variant="contained" size="small" component="span" disabled={hasRequested(r)} onClick={() => handleRequestDigitalAddress(r.contractId)}>Request</Button>}
              </TableCell>
              <TableCell key={5} className={classes.tableCell}>
                <Button color="secondary" variant="contained" size="small" component="span" disabled={!getAddress(r) || r.payload.completedVerifications.length < 5} onClick={() => handleAccept(r.contractId)}>Accept</Button>
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
