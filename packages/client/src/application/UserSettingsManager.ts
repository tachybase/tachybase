import React, { createElement } from 'react';

import { set } from 'lodash';
import { Outlet } from 'react-router-dom';

import { Icon } from '../icon';
import type { Application } from './Application';
import type { RouteType } from './RouterManager';

export const USER_SETTINGS_KEY = 'profilers.';
export const USER_SETTINGS_PATH = '/profilers/';
export const SNIPPET_PREFIX = 'pm.';

export interface UserSettingOptions {
  title: any;
  /**
   * @default Outlet
   */
  Component?: RouteType['Component'];
  icon?: string;
  /**
   * sort, the smaller the number, the higher the priority
   * @default 0
   */
  sort?: number;
  aclSnippet?: string;
  [index: string]: any;
}

export interface UserSettingsPageType {
  label?: string | React.ReactElement;
  title: string | React.ReactElement;
  key: string;
  icon: any;
  path: string;
  sort?: number;
  name?: string;
  isAllow?: boolean;
  topLevelName?: string;
  aclSnippet: string;
  children?: UserSettingsPageType[];
  [index: string]: any;
}

export class UserSettingsManager {
  protected settings: Record<string, UserSettingOptions> = {};
  protected aclSnippets: string[] = [];
  public app: Application;
  private cachedList = {};

  constructor(_userSettings: Record<string, UserSettingOptions>, app: Application) {
    this.app = app;
    Object.entries(_userSettings || {}).forEach(([name, userSettingOptions]) => {
      this.add(name, userSettingOptions);
    });
  }

  setAclSnippets(aclSnippets: string[]) {
    this.aclSnippets = aclSnippets;
  }

  getAclSnippet(name: string) {
    const setting = this.settings[name];
    return setting?.aclSnippet ? setting.aclSnippet : `${SNIPPET_PREFIX}${name}`;
  }

  getRouteName(name: string) {
    return `${USER_SETTINGS_KEY}${name}`;
  }

  getRoutePath(name: string) {
    return `${USER_SETTINGS_PATH}${name.replaceAll('.', '/')}`;
  }

  add(name: string, options: UserSettingOptions) {
    const nameArr = name.split('.');
    const topLevelName = nameArr[0];
    this.settings[name] = {
      ...this.settings[name],
      Component: Outlet,
      ...options,
      name,
      topLevelName: options.topLevelName || topLevelName,
    };
    // add children
    if (nameArr.length > 1) {
      set(this.settings, nameArr.join('.children.'), this.settings[name]);
    }

    // add route
    this.app.router.add(this.getRouteName(name), {
      path: this.getRoutePath(name),
      Component: this.settings[name].Component,
    });
  }

  remove(name: string) {
    // delete self and children
    Object.keys(this.settings).forEach((key) => {
      if (key.startsWith(name)) {
        delete this.settings[key];
        this.app.router.remove(`${USER_SETTINGS_KEY}${key}`);
      }
    });
  }

  hasAuth(name: string) {
    if (this.aclSnippets.includes(`!${this.getAclSnippet('*')}`)) return false;
    return this.aclSnippets.includes(`!${this.getAclSnippet(name)}`) === false;
  }

  getSetting(name: string) {
    return this.settings[name];
  }

  has(name: string) {
    const hasAuth = this.hasAuth(name);
    if (!hasAuth) return false;
    return !!this.getSetting(name);
  }

  get(name: string, filterAuth = true): UserSettingsPageType {
    const isAllow = this.hasAuth(name);
    const userSetting = this.getSetting(name);
    if ((filterAuth && !isAllow) || !userSetting) return null;
    const children = Object.keys(userSetting.children || {})
      .sort((a, b) => a.localeCompare(b)) // sort by name
      .map((key) => this.get(userSetting.children[key].name, filterAuth))
      .filter(Boolean)
      .sort((a, b) => (a.sort || 0) - (b.sort || 0));
    const { title, icon, aclSnippet, ...others } = userSetting;
    return {
      ...others,
      aclSnippet: this.getAclSnippet(name),
      title,
      isAllow,
      label: title,
      icon: typeof icon === 'string' ? createElement(Icon, { type: icon }) : icon,
      path: this.getRoutePath(name),
      key: name,
      children: children.length ? children : undefined,
    };
  }

  getList(filterAuth = true): UserSettingsPageType[] {
    const cacheKey = JSON.stringify(filterAuth);
    if (this.cachedList[cacheKey]) return this.cachedList[cacheKey];

    return (this.cachedList[cacheKey] = Array.from(
      new Set(Object.values(this.settings).map((item) => item.topLevelName)),
    )
      .sort((a, b) => a.localeCompare(b)) // sort by name
      .map((name) => this.get(name, filterAuth))
      .filter(Boolean)
      .sort((a, b) => (a.sort || 0) - (b.sort || 0)));
  }

  getAclSnippets() {
    return Object.keys(this.settings).map((name) => this.getAclSnippet(name));
  }
}
