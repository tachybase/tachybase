import React from 'react';

import * as antIcons from '@ant-design/icons';
import AntdIcon, { createFromIconfontCN } from '@ant-design/icons';

let IconFont: any;

export const icons = new Map<string, any>();

export function registerIcon(type: string, icon: any = IconFont) {
  icons.set(type.toLowerCase(), icon);
}

export function hasIcon(type: string) {
  if (!type) {
    return false;
  }
  return icons.has(type.toLowerCase());
}

export function registerIcons(components) {
  Object.keys(components).forEach((type) => {
    registerIcon(type, components[type]);
  });
}

Object.keys(antIcons).forEach((name) => {
  if (name.endsWith('Outlined')) {
    registerIcon(name, antIcons[name]);
  }
});

interface IconProps {
  type?: string;
  component?: any;
  [key: string]: any;
}

export const Icon = (props: IconProps): React.ReactNode => {
  const { type = '', component, ...restProps } = props;
  if (component) {
    return <AntdIcon component={component} {...restProps} />;
  }
  if (type && icons.has(type.toLowerCase())) {
    const IconComponent = icons.get(type.toLowerCase());
    return <IconComponent {...restProps} />;
  }
  if (type && IconFont) {
    return <IconFont type={type} />;
  }
  return null;
};

Icon.createFromIconfontCN = (options) => {
  IconFont = createFromIconfontCN(options);
};

Icon.register = (icons?: any) => {
  registerIcons(icons);
};

const AppsSvg = () => (
  <svg width="1em" height="1em" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
    <path d="M0 0h3v3H0V0zm4.5 0h3v3h-3V0zM9 0h3v3H9V0zM0 4.5h3v3H0v-3zm4.503 0h3v3h-3v-3zM9 4.5h3v3H9v-3zM0 9h3v3H0V9zm4.503 0h3v3h-3V9zM9 9h3v3H9V9z"></path>
  </svg>
);

export const AppsIcon = (props) => <Icon component={AppsSvg} {...props} />;
Icon.register({ apps: AppsIcon });

export default Icon;
