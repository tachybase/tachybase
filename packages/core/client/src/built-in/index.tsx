import React from 'react';
import { observer } from '@tachybase/schema';
import { getSubAppName } from '@tachybase/sdk';

import { DisconnectOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Result, Spin } from 'antd';
import { createStyles } from 'antd-style';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';

import { useAPIClient } from '../api-client';
import { Application, NoticeLevel, useApp } from '../application';
import { Plugin } from '../application/Plugin';
import { BlockSchemaComponentPlugin } from '../block-provider';
import { CollectionPlugin } from '../collection-manager';
import { RouteSchemaComponent } from '../route-switch';
import { AntdSchemaComponentPlugin, SchemaComponentPlugin } from '../schema-component';
import { ErrorFallback } from '../schema-component/antd/error-fallback';
import { AssociationFilterPlugin, SchemaInitializerPlugin } from '../schema-initializer';
import { SchemaSettingsPlugin } from '../schema-settings';
import { BlockTemplateDetails, BlockTemplatePage } from '../schema-templates';
import { CurrentUserProvider, CurrentUserSettingsMenuProvider } from '../user';
import { ACLPlugin } from './acl';
import { AdminLayoutPlugin } from './admin-layout';
import { PluginBuiltInCollections } from './built-in-collections';
import { RemoteDocumentTitlePlugin } from './document-title';
import { LocalePlugin } from './locale/LocalePlugin';
import { PinnedListPlugin } from './pinned-list';
import { PMPlugin } from './pm';
import { SystemSettingsPlugin } from './system-settings';

export { AdminProvider, NoticeArea } from './admin-layout';

interface AppStatusProps {
  error: Error;
  app: Application;
}

const AppSpin = () => {
  // TODO: better loading and mobile loading fix
  return (
    <Spin
      size="large"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        fontSize: 72 * (window.devicePixelRatio || 1),
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

const useStyles = createStyles(({ css }) => {
  return {
    modal: css`
      top: 50%;
      position: absolute;
      width: 100%;
      transform: translate(0, -50%);
    `,
  };
});

const useErrorProps = (app: Application, error: any) => {
  const api = useAPIClient();
  if (!error) {
    return {};
  }
  const err = error?.response?.data?.errors?.[0] || error;
  const subApp = getSubAppName(app.getPublicPath());
  switch (err.code) {
    case 'USER_HAS_NO_ROLES_ERR':
      return {
        title: app.i18n.t('Permission denied'),
        subTitle: err.message,
        extra: [
          <Button
            type="primary"
            key="try"
            onClick={() => {
              api.auth.setToken(null);
              window.location.reload();
            }}
          >
            {app.i18n.t('Sign in with another account')}
          </Button>,
          subApp ? (
            <Button key="back" onClick={() => (window.location.href = '/admin')}>
              {app.i18n.t('Return to the main application')}
            </Button>
          ) : null,
        ],
      };
    default:
      return {};
  }
};

const AppError = observer(
  ({ app, error }: AppStatusProps) => {
    const props = useErrorProps(app, error);
    const { styles } = useStyles();
    return (
      <div>
        <Result
          className={styles.modal}
          status="error"
          title={app.i18n.t('App error')}
          subTitle={app.i18n.t(error?.message)}
          extra={[
            <Button type="primary" key="try" onClick={() => window.location.reload()}>
              {app.i18n.t('Try again')}
            </Button>,
          ]}
          {...props}
        />
      </div>
    );
  },
  { displayName: 'AppError' },
);

const getProps = (app: Application) => {
  if (app.ws.serverDown) {
    return {
      status: 'error',
      icon: <DisconnectOutlined />,
      title: "You're offline",
      subTitle: 'Please check the server status or network connection status',
    };
  }

  if (!app.error) {
    return {};
  }

  if (app.error.code === 'APP_NOT_FOUND') {
    return {
      status: 'warning',
      title: 'App not found',
      subTitle: app.error?.message,
    };
  }

  if (app.error.code === 'APP_INITIALIZING') {
    return {
      status: 'info',
      icon: <LoadingOutlined />,
      title: 'App initializing',
      subTitle: app.error?.message,
    };
  }

  if (app.error.code === 'APP_INITIALIZED') {
    return {
      status: 'warning',
      title: 'App initialized',
      subTitle: app.error?.message,
    };
  }

  if (app.error.code === 'APP_ERROR' || app.error.code === 'LOAD_ERROR') {
    return {
      status: 'error',
      title: 'App error',
      subTitle: app.error?.message,
    };
  }

  if (app.error.code === 'APP_NOT_INSTALLED_ERROR') {
    return {
      status: 'warning',
      title: 'App not installed',
      subTitle: app.error?.message,
    };
  }

  if (app.error.code === 'APP_STOPPED') {
    return {
      status: 'warning',
      title: 'App stopped',
      subTitle: app.error?.message,
    };
  }

  if (app.error.code === 'APP_COMMANDING') {
    const props = {
      status: 'info',
      icon: <LoadingOutlined />,
      title: app.error?.command?.name,
      subTitle: app.error?.message,
    };
    const commands = {
      start: {
        title: 'App starting',
      },
      restart: {
        title: 'App restarting',
      },
      install: {
        title: 'App installing',
      },
      upgrade: {
        title: 'App upgrading',
      },
      'pm.add': {
        title: 'Adding plugin',
      },
      'pm.update': {
        title: 'Updating plugin',
      },
      'pm.enable': {
        title: 'Enabling plugin',
      },
      'pm.disable': {
        title: 'Disabling plugin',
      },
      'pm.remove': {
        title: 'Removing plugin',
      },
    };
    return { ...props, ...commands[app.error?.command?.name] };
  }

  return {};
};

const AppMaintaining = observer(
  ({ app }: AppStatusProps) => {
    const { icon, status, title, subTitle } = getProps(app);
    const { styles } = useStyles();
    return (
      <div>
        <Result
          className={styles.modal}
          icon={icon}
          status={status}
          title={app.i18n.t(title)}
          subTitle={app.i18n.t(subTitle)}
        />
      </div>
    );
  },
  { displayName: 'AppMaintaining' },
);

const AppMaintainingDialog = observer(
  ({ app }: AppStatusProps) => {
    const { icon, status, title, subTitle } = getProps(app);
    const manager = app.noticeManager;
    manager.status(app.i18n.t(title) + app.i18n.t(subTitle), NoticeLevel.INFO);
    return null;
  },
  { displayName: 'AppMaintainingDialog' },
);

export const AppNotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const app = useApp();
  return (
    <Result
      status="404"
      title="404"
      subTitle={t('Sorry, the page you visited does not exist.')}
      extra={
        <Button onClick={() => (location.href = app.adminUrl)} type="primary">
          {t('Back Home')}
        </Button>
      }
    />
  );
};

export class BuiltInPlugin extends Plugin {
  async afterAdd() {
    this.app.addComponents({
      AppSpin,
      AppError,
      AppMaintaining,
      AppMaintainingDialog,
      AppNotFound,
    });
    await this.addPlugins();
  }

  async load() {
    this.addComponents();
    this.addRoutes();

    this.app.use(CurrentUserProvider);
    this.app.use(CurrentUserSettingsMenuProvider);
  }

  addRoutes() {
    this.router.add('root', {
      path: '/',
      element: <Navigate replace to="/admin" />,
    });

    this.router.add('not-found', {
      path: '*',
      Component: AppNotFound,
    });

    this.router.add('admin', {
      path: '/admin',
      Component: 'AdminLayout',
    });
    this.router.add('admin.page', {
      path: '/admin/:name',
      Component: 'RouteSchemaComponent',
    });
  }

  addComponents() {
    this.app.addComponents({
      ErrorFallback,
      RouteSchemaComponent,
      BlockTemplatePage,
      BlockTemplateDetails,
    });
  }
  async addPlugins() {
    await this.app.pm.add(AssociationFilterPlugin);
    await this.app.pm.add(LocalePlugin, { name: 'builtin-locale' });
    await this.app.pm.add(AdminLayoutPlugin, { name: 'admin-layout' });
    await this.app.pm.add(SystemSettingsPlugin, { name: 'system-setting' });
    await this.app.pm.add(PinnedListPlugin, {
      name: 'pinned-list',
      config: {
        items: {
          wf: { order: 100, component: 'WorkflowLink', pin: true, snippet: 'pm.*' },
          ds: { order: 200, component: 'DatasourceLink', pin: true, snippet: 'pm.*' },
          pm: { order: 300, component: 'PluginManagerLink', pin: true, snippet: 'pm' },
          sc: { order: 400, component: 'SettingsCenterDropdown', pin: true, snippet: 'pm.*' },
        },
      },
    });
    await this.app.pm.add(SchemaComponentPlugin, { name: 'schema-component' });
    await this.app.pm.add(SchemaInitializerPlugin, { name: 'schema-initializer' });
    await this.app.pm.add(SchemaSettingsPlugin, { name: 'schema-settings' });
    await this.app.pm.add(BlockSchemaComponentPlugin, { name: 'block-schema-component' });
    await this.app.pm.add(AntdSchemaComponentPlugin, { name: 'antd-schema-component' });
    await this.app.pm.add(ACLPlugin, { name: 'builtin-acl' });
    await this.app.pm.add(RemoteDocumentTitlePlugin, { name: 'remote-document-title' });
    await this.app.pm.add(PMPlugin, { name: 'builtin-pm' });
    await this.app.pm.add(CollectionPlugin, { name: 'builtin-collection' });
  }
}
