// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";

import Themes from "./themes";
import Main from "./components/Main";
import { UserProvider } from "./context/UserContext";

ReactDOM.render(
  <UserProvider>
    <ThemeProvider theme={Themes.default}>
      <CssBaseline />
      <Main />
    </ThemeProvider>
  </UserProvider>,
  document.getElementById("root"),
);
