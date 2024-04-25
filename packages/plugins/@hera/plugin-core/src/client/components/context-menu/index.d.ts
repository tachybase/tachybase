import * as React from 'react';

export interface ContextMenu {
  id: string;
  appendTo?: string;
  animation?: string;
  hideOnLeave?: boolean;
  attributes?: object;
  className?: string;
  children?: ReactNode;
  preventHideOnResize?: boolean;
  preventHideOnScroll?: boolean;
  onShow?: { (event: any): void };
  onHide?: { (event: any): void };
  onMouseLeave?: { (event: any): void };
}

export interface ContextMenuItem {
  disabled?: boolean;
  preventClose?: boolean;
  disableWhileShiftPressed?: boolean;
  attributes?: object;
  className?: string;
  children?: ReactNode;
  onClick?: { (event: any): void };
}

export interface ContextMenuTrigger {
  id: string;
  attributes?: object;
  disable?: boolean;
  className?: string;
  children?: ReactNode;
}

export interface Submenu {
  title: string;
  attributes?: object;
  className?: boolean;
  children?: ReactNode;
}

export const ContextMenu: React.FunctionComponent<ContextMenu>;
export const ContextMenuItem: React.FunctionComponent<ContextMenuItem>;
export const ContextMenuTrigger: React.FunctionComponent<ContextMenuTrigger>;
export const Submenu: React.FunctionComponent<Submenu>;
