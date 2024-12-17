import React, { createContext, useCallback, useMemo } from 'react';

import { Result } from 'antd';
import _ from 'lodash';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { ADMIN_SETTINGS_PATH, PluginSettingsPageType, useApp } from '../../application';
import { useCompile } from '../../schema-component';
import { SettingLayout } from './SettingLayout';

export const SettingsCenterContext = createContext<any>({});
SettingsCenterContext.displayName = 'SettingsCenterContext';

function matchRoute(data, url) {
  const keys = Object.keys(data);
  if (data[url]) {
    return data[url];
  }
  for (const pattern of keys) {
    const regexPattern = pattern.replace(/:[^/]+/g, '([^/]+)');
    const match = url.match(new RegExp(`^${regexPattern}$`));

    if (match) {
      return data[pattern];
    }
  }

  return null;
}

export const AdminSettingsLayout = () => {
  const app = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const compile = useCompile();
  const settings = useMemo(() => {
    const list = app.systemSettingsManager.getList();
    // compile title
    function traverse(settings: PluginSettingsPageType[]) {
      settings.forEach((item) => {
        item.title = compile(item.title);
        item.label = compile(item.title);
        if (item.children?.length) {
          traverse(item.children);
        }
      });
    }
    traverse(list);
    return list;
  }, [app.systemSettingsManager, compile]);
  const routeChildren = useMemo(() => {
    const list = app.systemSettingsManager.getList();
    // compile title
    function traverse(settings: PluginSettingsPageType[]) {
      return settings.map((item) => {
        if (item.path.includes(':')) {
          item.hideInMenu = true;
        }
        item.title = compile(item.title);
        item.label = compile(item.title);
        if (item.children?.length) {
          item.children = traverse(item.children);
        }
        return {
          ...item,
          name: item.label as string,
        };
      });
    }
    return traverse(list);
  }, [app.systemSettingsManager, compile]);
  const getFirstDeepChildPath = useCallback((settings: PluginSettingsPageType[]) => {
    if (!settings || !settings.length) {
      return '/_admin';
    }
    const first = settings[0];
    if (first.children?.length) {
      return getFirstDeepChildPath(first.children);
    }
    return first.path;
  }, []);

  const settingsMapByPath = useMemo<Record<string, PluginSettingsPageType>>(() => {
    const map = {};
    const traverse = (settings: PluginSettingsPageType[]) => {
      settings.forEach((item) => {
        map[item.path] = item;
        if (item.children?.length) {
          traverse(item.children);
        }
      });
    };
    traverse(settings);
    return map;
  }, [settings]);
  const settingsMapByKey = useMemo<Record<string, PluginSettingsPageType>>(() => {
    const map = {};
    const traverse = (settings: PluginSettingsPageType[]) => {
      settings.forEach((item) => {
        map[item.key] = item;
        if (item.children?.length) {
          traverse(item.children);
        }
      });
    };
    traverse(settings);
    return map;
  }, [settings]);
  const currentSetting = useMemo(
    () => matchRoute(settingsMapByPath, location.pathname),
    [location.pathname, settingsMapByPath],
  );
  if (!currentSetting || location.pathname === ADMIN_SETTINGS_PATH || location.pathname === ADMIN_SETTINGS_PATH + '/') {
    return <Navigate replace to={getFirstDeepChildPath(settings)} />;
  }
  return (
    <SettingLayout
      fullscreen={!!currentSetting?.fullscreen}
      route={{
        path: '/',
        children: routeChildren,
      }}
      selectedKeys={[currentSetting?.groupKey ?? currentSetting?.key]}
      onClick={({ key }) => {
        const setting = settingsMapByKey[key];
        if (setting?.path) {
          navigate(setting.path);
        }
      }}
    >
      {currentSetting ? (
        <Outlet />
      ) : (
        <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />
      )}
    </SettingLayout>
  );
};
