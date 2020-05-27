// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Drawer, List } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import classNames from "classnames";
import useStyles from "./styles";
import SidebarLink from "./SidebarLink";
import { SidebarEntry } from "./SidebarEntry";

type SidebarProps = {
  entries : SidebarEntry[]
}

function Sidebar({ entries, location } : RouteComponentProps & SidebarProps) {
  var classes = useStyles();

  return (
    <Drawer
      variant={"permanent"}
      className={classNames(classes.drawer, classes.drawerOpen)}
      classes={{
        paper: classNames(classes.drawerOpen),
      }}
      open={true}
    >
      <div className={classes.toolbar} />
      <List>
        {entries.map(e =>
          <SidebarLink
            key={e.label}
            location={location}
            {...e}
          />
        )}
      </List>
    </Drawer>
  );
}

export default withRouter(Sidebar);
