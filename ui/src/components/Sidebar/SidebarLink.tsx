// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { ListItem, ListItemIcon, ListItemText, Collapse, List } from "@material-ui/core";
import { Link } from "react-router-dom";
import { History, Location } from "history";
import classnames from "classnames";
import useStyles from "./styles";
import { SidebarEntry } from "./SidebarEntry";

type SidebarLinkProps = {
  label : string
  path : string
  icon : JSX.Element
  children : SidebarEntry[]
  location : Location<History.PoorMansUnknown>
}

export default function SidebarLink({ label, path, icon, children, location } : SidebarLinkProps) {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(false);
  const isLinkActive = path && (location.pathname === path || location.pathname.indexOf(path) !== -1);

  function toggleCollapse(e : React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <ListItem
        button={true}
        component={Link}
        onClick={children.length > 0 ? toggleCollapse: () => {}}
        to={path}
        className={classes.link}
        classes={{
          root: classnames(classes.linkRoot, {
            [classes.linkActive]: isLinkActive,
          }),
        }}
        disableRipple
      >
        <ListItemIcon
          className={classnames(classes.linkIcon, {
            [classes.linkIconActive]: isLinkActive,
          })}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          classes={{
            primary: classnames(classes.linkText, {
              [classes.linkTextActive]: isLinkActive,
            }),
          }}
          primary={label}
        />
      </ListItem>
      {children && (
        <Collapse
          in={isOpen}
          timeout="auto"
          unmountOnExit
          className={classes.nestedList}
        >
          <List component="div" disablePadding>
            {children.map(child => (
              <SidebarLink
                location={location}
                {...child}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}
