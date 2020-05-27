// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { makeStyles, createStyles } from "@material-ui/styles";

export default makeStyles((theme : any) => createStyles({
  tableCell: {
    verticalAlign: "center",
    paddingTop: 6,
    paddingBottom: 6,
    fontSize: "0.75rem"
  },
  tableRow: {
    height: "auto"
  },
  heading: {
    paddingLeft: "10px",
    // fontSize: theme.typography.pxToRem(15),
    // fontWeight: theme.typography.fontWeightRegular,
  },
  buttonLifecycle: {
    width: "90%",
    // marginRight: "10px",
    // margin: "10px",
  },
  verificationButton: {
    padding: "0px",
  }
}));
