import React, { ComponentType, ReactElement } from 'react';
import { define, observable } from '@tachybase/schema';
import { APIClientOptions, getSubAppName } from '@tachybase/sdk';

import * as Sentry from '@sentry/react';
import { i18n as i18next } from 'i18next';
import { get, merge, set } from 'lodash';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Link, Navigate, NavLink } from 'react-router-dom';

import { APIClient, APIClientProvider } from '../api-client';
import { CollectionField } from '../data-source/collection-field/CollectionField';
import { DataSourceApplicationProvider } from '../data-source/components/DataSourceApplicationProvider';
import { DataBlockProvider } from '../data-source/data-block/DataBlockProvider';
import { DataSourceManager, type DataSourceManagerOptions } from '../data-source/data-source/DataSourceManager';
import { i18n } from '../i18n';
import { CSSVariableProvider } from '../style/css-variable';
import { AntdAppProvider, GlobalThemeProvider } from '../style/theme';
import { AppSchemaComponentProvider } from './AppSchemaComponentProvider';
import { AttachmentPreviewManager, PluginAttachmentItemsOptions } from './AttachmentPreviewManager';
import { AppComponent, BlankComponent, defaultAppComponents } from './components';
import { NoticeManager } from './NoticesManager';
import type { Plugin } from './Plugin';
import { PluginContextMenu, PluginItemsOptions } from './PluginContextMenu';
import { PluginManager, PluginType } from './PluginManager';
import { ComponentTypeAndString, RouterManager, RouterOptions } from './RouterManager';
import { SchemaInitializer, SchemaInitializerManager } from './schema-initializer';
import * as schemaInitializerComponents from './schema-initializer/components';
import { SchemaSettings, SchemaSettingsManager } from './schema-settings';
import { PluginSettingOptions, SystemSettingsManager } from './SystemSettingsManager';
import { UserSettingOptions, UserSettingsManager } from './UserSettingsManager';
import { compose, normalizeContainer } from './utils';
import { defineGlobalDeps } from './utils/globalDeps';
import { getRequireJs, type RequireJS } from './utils/requirejs';
import { WebSocketClient, WebSocketClientOptions } from './WebSocketClient';

declare global {
  interface Window {
    define: RequireJS['define'];
    require: RequireJS['require'];
    // TODO type definition
    Sentry?: any;
  }
}

export type DevDynamicImport = (packageName: string) => Promise<{ default: typeof Plugin }>;
export type ComponentAndProps<T = any> = [ComponentType, T];
export interface ApplicationOptions {
  name?: string;
  publicPath?: string;
  apiClient?: APIClientOptions | APIClient;
  ws?: WebSocketClientOptions | boolean;
  i18n?: i18next;
  providers?: (ComponentType | ComponentAndProps)[];
  plugins?: PluginType[];
  components?: Record<string, ComponentType>;
  scopes?: Record<string, any>;
  router?: RouterOptions;
  pluginSettings?: Record<string, PluginSettingOptions>;
  userSettings?: Record<string, UserSettingOptions>;
  schemaSettings?: SchemaSettings[];
  schemaInitializers?: SchemaInitializer[];
  designable?: boolean;
  loadRemotePlugins?: boolean;
  devDynamicImport?: DevDynamicImport;
  dataSourceManager?: DataSourceManagerOptions;
  pluginMenuItems?: Record<string, PluginItemsOptions>;
  attachmentItem?: Record<string, PluginAttachmentItemsOptions>;
}

export class Application {
  public providers: ComponentAndProps[] = [];
  public router: RouterManager;
  public scopes: Record<string, any> = {};
  public i18n: i18next;
  public ws: WebSocketClient;
  public apiClient: APIClient;
  public components: Record<string, ComponentType<any> | any> = {
    DataBlockProvider,
    ...defaultAppComponents,
    ...schemaInitializerComponents,
    CollectionField,
  };
  public pluginManager: PluginManager;
  public systemSettingsManager: SystemSettingsManager;
  public userSettingsManager: UserSettingsManager;
  public devDynamicImport: DevDynamicImport;
  public requirejs: RequireJS;
  public notification;
  public schemaInitializerManager: SchemaInitializerManager;
  public schemaSettingsManager: SchemaSettingsManager;
  public dataSourceManager: DataSourceManager;
  public noticeManager: NoticeManager;
  public pluginContextMenu: PluginContextMenu;
  public AttachmentPreviewManager: AttachmentPreviewManager;
  public name: string;

  loading = true;
  maintained = false;
  maintaining = false;
  error = null;
  get pm() {
    return this.pluginManager;
  }

  get adminUrl() {
    if (this.name === 'main') {
      return '/admin/';
    } else {
      return `/apps/${this.name}/admin/`;
    }
  }

  constructor(protected options: ApplicationOptions = {}) {
    this.initRequireJs();
    define(this, {
      maintained: observable.ref,
      loading: observable.ref,
      maintaining: observable.ref,
      error: observable.ref,
    });
    this.devDynamicImport = options.devDynamicImport;
    this.scopes = merge(this.scopes, options.scopes);
    this.components = merge(this.components, options.components);
    this.apiClient = options.apiClient instanceof APIClient ? options.apiClient : new APIClient(options.apiClient);
    this.apiClient.app = this;
    this.i18n = options.i18n || i18n;
    this.router = new RouterManager(options.router, this);
    this.schemaSettingsManager = new SchemaSettingsManager(options.schemaSettings, this);
    this.pluginManager = new PluginManager(options.plugins, options.loadRemotePlugins, this);
    this.schemaInitializerManager = new SchemaInitializerManager(options.schemaInitializers, this);
    this.dataSourceManager = new DataSourceManager(options.dataSourceManager, this);
    this.noticeManager = new NoticeManager(this);
    this.addDefaultProviders();
    this.addReactRouterComponents();
    this.addProviders(options.providers || []);
    this.ws = new WebSocketClient(options.ws, this);
    this.systemSettingsManager = new SystemSettingsManager(options.pluginSettings, this);
    this.userSettingsManager = new UserSettingsManager(options.userSettings, this);
    this.addRoutes();
    this.name = this.options.name || getSubAppName(options.publicPath) || 'main';
    this.pluginContextMenu = new PluginContextMenu(options.pluginMenuItems);
    this.AttachmentPreviewManager = new AttachmentPreviewManager(options.attachmentItem, this);
  }

  private initRequireJs() {
    this.requirejs = getRequireJs();
    defineGlobalDeps(this.requirejs);
    window.define = this.requirejs.define;
    window.require = this.requirejs.require as RequireJS['require'] & NodeRequire;
  }

  private addDefaultProviders() {
    this.use(APIClientProvider, { apiClient: this.apiClient });
    this.use(I18nextProvider, { i18n: this.i18n });
    this.use(GlobalThemeProvider);
    this.use(CSSVariableProvider);
    this.use(AppSchemaComponentProvider, {
      designable: this.options.designable,
      appName: this.name,
      components: this.components,
      scope: this.scopes,
    });
    this.use(AntdAppProvider);
    this.use(DataSourceApplicationProvider, { dataSourceManager: this.dataSourceManager });
  }

  private addReactRouterComponents() {
    this.addComponents({
      Link,
      Navigate: Navigate as ComponentType,
      NavLink,
    });
  }

  private addRoutes() {
    this.router.add('not-found', {
      path: '*',
      Component: this.components['AppNotFound'],
    });
  }

  getOptions() {
    return this.options;
  }

  getPublicPath() {
    return this.options.publicPath || '/';
  }

  getName() {
    return getSubAppName(this.getPublicPath()) || null;
  }

  getApiUrl(pathname = '') {
    let baseURL = this.apiClient.axios['defaults']['baseURL'];
    if (!baseURL.startsWith('http://') && !baseURL.startsWith('https://')) {
      const { protocol, host } = window.location;
      baseURL = `${protocol}//${host}${baseURL}`;
    }
    return baseURL.replace(/\/$/g, '') + '/' + pathname.replace(/^\//g, '');
  }

  getRouteUrl(pathname: string) {
    return this.options.publicPath.replace(/\/$/g, '') + pathname;
  }

  getCollectionManager(dataSource?: string) {
    return this.dataSourceManager.getDataSource(dataSource)?.collectionManager;
  }

  /**
   * @internal
   */
  getComposeProviders() {
    const Providers = compose(...this.providers)(BlankComponent);
    Providers.displayName = 'Providers';
    return Providers;
  }

  use<T = any>(component: ComponentType, props?: T) {
    return this.addProvider(component, props);
  }

  addProvider<T = any>(component: ComponentType, props?: T) {
    return this.providers.push([component, props]);
  }

  addProviders(providers: (ComponentType | [ComponentType, any])[]) {
    providers.forEach((provider) => {
      if (Array.isArray(provider)) {
        this.addProvider(provider[0], provider[1]);
      } else {
        this.addProvider(provider);
      }
    });
  }

  async load() {
    let loadFailed = false;
    this.ws.on('message', (event) => {
      const data = JSON.parse(event.data);
      if (data?.payload?.refresh) {
        window.location.reload();
        return;
      }
      if (data.type === 'notification') {
        this.notification[data.payload?.type || 'info']({ message: data.payload?.message });
        return;
      }
      if (data.type === 'notice') {
        this.noticeManager.on(data.payload);
      }
      const maintaining = data.type === 'maintaining' && data.payload.code !== 'APP_RUNNING';
      if (maintaining) {
        this.maintaining = true;
        this.error = data.payload;
      } else {
        if (loadFailed) {
          window.location.reload();
          return;
        }
        this.maintaining = false;
        this.maintained = true;
        this.error = null;
      }
    });
    this.ws.on('serverDown', () => {
      this.maintaining = true;
      this.maintained = true;
    });
    this.ws.connect();
    try {
      this.loading = true;
      await this.pm.load();
    } catch (error) {
      if (this.ws.enabled) {
        await new Promise((resolve) => {
          setTimeout(() => resolve(null), 1000);
        });
      }
      loadFailed = true;
      const others = error?.response?.data?.error || error?.response?.data?.errors?.[0] || { message: error?.message };
      this.error = {
        code: 'LOAD_ERROR',
        ...others,
      };
      console.error(error, this.error);
    }
    if (process.env.APP_ENV === 'production') {
      const dsn = process.env.SENTRY_DSN;
      if (dsn) {
        const integrations = [];
        let tracesSampleRate = 1.0;
        let tracePropagationTargets = ['localhost', /^\//];
        if (process.env.SENTRY_TRACE_ENABLE === 'on') {
          integrations.push(Sentry.browserTracingIntegration());
          if (Number(process.env.SENTRY_TRACE_SAMPLE_RATE) >= 0 && Number(process.env.SENTRY_TRACE_SAMPLE_RATE) <= 1) {
            tracesSampleRate = parseFloat(process.env.SENTRY_TRACE_SAMPLE_RATE);
          }
          if (process.env.SENTRY_TRACE_PROPAGATION_TARGETS) {
            tracePropagationTargets = process.env.SENTRY_TRACE_PROPAGATION_TARGETS.split(',').map((target) => {
              if (target.startsWith('/')) {
                return new RegExp(target);
              }
              return target;
            });
          }
        }
        let replaysSessionSampleRate = 0.1;
        let replaysOnErrorSampleRate = 1.0;
        if (process.env.SENTRY_SESSION_REPLAY_ENABLE === 'on') {
          integrations.push(Sentry.replayIntegration());
          if (
            Number(process.env.SENTRY_SESSION_REPLAY_SAMPLE_RATE) >= 0 &&
            Number(process.env.SENTRY_SESSION_REPLAY_SAMPLE_RATE) <= 1
          ) {
            replaysSessionSampleRate = parseFloat(process.env.SENTRY_SESSION_REPLAY_SAMPLE_RATE);
          }
          if (
            Number(process.env.SENTRY_SESSION_REPLAY_ONERROR_SAMPLE_RATE) >= 0 &&
            Number(process.env.SENTRY_SESSION_REPLAY_ONERROR_SAMPLE_RATE) <= 1
          ) {
            replaysOnErrorSampleRate = parseFloat(process.env.SENTRY_SESSION_REPLAY_ON_ERROR_SAMPLE_RATE);
          }
        }
        Sentry.init({
          dsn,
          integrations,
          // Performance Monitoring
          tracesSampleRate, //  Capture 100% of the transactions
          // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
          tracePropagationTargets,
          // Session Replay
          replaysSessionSampleRate, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
          replaysOnErrorSampleRate, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
        });
      } else {
        console.log('SENTRY_DSN is not set, Sentry will not be initialized');
      }
    }

    this.loading = false;
  }

  getComponent<T = any>(Component: ComponentTypeAndString<T>, isShowError = true): ComponentType<T> | undefined {
    const showError = (msg: string) => isShowError && console.error(msg);
    if (!Component) {
      showError(`getComponent called with ${Component}`);
      return;
    }

    // ClassComponent or FunctionComponent
    if (typeof Component === 'function') return Component;

    // Component is a string, try to get it from this.components
    if (typeof Component === 'string') {
      const res = get(this.components, Component) as ComponentType<T>;
      if (!res) {
        showError(`Component ${Component} not found`);
        return;
      }
      return res;
    }

    showError(`Component ${Component} should be a string or a React component`);
    return;
  }

  renderComponent<T extends {}>(Component: ComponentTypeAndString, props?: T): ReactElement {
    return React.createElement(this.getComponent(Component), props);
  }

  /**
   * @internal use addComponents({ SomeComponent }) instead
   */
  protected addComponent(component: ComponentType, name?: string) {
    const componentName = name || component.displayName || component.name;
    if (!componentName) {
      console.error('Component must have a displayName or pass name as second argument');
      return;
    }
    set(this.components, componentName, component);
  }

  addComponents(components: Record<string, ComponentType>) {
    Object.keys(components).forEach((name) => {
      this.addComponent(components[name], name);
    });
  }

  addScopes(scopes: Record<string, any>) {
    this.scopes = merge(this.scopes, scopes);
  }

  getRootComponent() {
    const Root = () => <AppComponent app={this} />;
    return Root;
  }

  mount(containerOrSelector: Element | ShadowRoot | string) {
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;
    const App = this.getRootComponent();
    const root = createRoot(container);
    root.render(<App />);
    return root;
  }
}