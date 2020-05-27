// Copyright (c) 2019 The DAML Authors. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

export type SidebarEntry = {
  key : string
  label : string
  path : string
  icon : JSX.Element
  render : () => JSX.Element
  children : SidebarEntry[]
}
