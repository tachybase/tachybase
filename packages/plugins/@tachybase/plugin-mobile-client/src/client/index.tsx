import React from 'react';
import { createRouterManager, Plugin, RouterManager } from '@tachybase/client';

import { Navigate, Outlet } from 'react-router-dom';

import { AppConfiguration, InterfaceConfiguration } from './configuration';
import {
  ImageSearchConfigureFields,
  ImageSearchItemFieldSettings,
  mBlockInitializers,
  mBlockInitializers_deprecated,
  SwiperFieldSettings,
  SwiperPage,
  TabSearchFieldSchemaInitializer,
  TabSearchItemFieldSettings,
} from './core/schema';
import { NAMESPACE } from './locale';
import { MAppNotFound } from './MAppNotFound';
import { MobileClientProvider } from './MobileClientProvider';
import { MobileLinkProvider } from './MobileLinkProvider';
import MApplication from './router/Application';

export class MobileClientPlugin extends Plugin {
  public mobileRouter: RouterManager;
  async load() {
    this.setMobileRouter();
    this.addRoutes();
    this.addSettings();
    this.app.use(MobileClientProvider);
    this.app.use(MobileLinkProvider);
    this.app.schemaInitializerManager.add(mBlockInitializers_deprecated);
    this.app.schemaInitializerManager.add(mBlockInitializers);
    this.app.schemaInitializerManager.add(ImageSearchConfigureFields);
    this.app.schemaInitializerManager.add(TabSearchFieldSchemaInitializer);

    this.app.schemaSettingsManager.add(SwiperFieldSettings);
    this.app.schemaSettingsManager.add(ImageSearchItemFieldSettings);
    this.app.schemaSettingsManager.add(TabSearchItemFieldSettings);
  }

  addSettings() {
    this.app.pluginSettingsManager.add(NAMESPACE, {
      title: `{{t("Mobile Client-side", { ns: "${NAMESPACE}" })}}`,
      icon: 'MobileOutlined',
      Component: () => <Outlet />,
    });
    this.app.pluginSettingsManager.add(`${NAMESPACE}.interface`, {
      title: `{{t("Interface Configuration", { ns: "${NAMESPACE}" })}}`,
      Component: InterfaceConfiguration,
      sort: 1,
    });
    this.app.pluginSettingsManager.add(`${NAMESPACE}.app`, {
      title: `{{t("App Configuration", { ns: "${NAMESPACE}" })}}`,
      Component: AppConfiguration,
      sort: 2,
    });
  }

  setMobileRouter() {
    const router = createRouterManager({ type: 'hash' }, this.app);
    this.router.add('not-found', {
      path: '*',
      Component: MAppNotFound,
    });
    router.add('root', {
      path: '/',
      element: <Navigate replace to="/mobile" />,
    });
    router.add('mobile', {
      path: '/mobile',
      element: <MApplication />,
    });
    router.add('mobile.page', {
      path: '/mobile/:name',
      Component: 'RouteSchemaComponent',
    });
    this.mobileRouter = router;
  }

  getMobileRouterComponent() {
    return this.mobileRouter.getRouterComponent();
  }

  addRoutes() {
    this.app.router.add('mobile', {
      path: '/mobile',
      element: <MApplication />,
    });
    this.app.router.add('mobile.page', {
      path: '/mobile/:name',
      Component: 'RouteSchemaComponent',
    });
    this.app.router.add('mobile.swiper.page', {
      path: '/mobile/:name/image/:collection/:field/:fieldParams',
      Component: SwiperPage,
    });
  }
}

export default MobileClientPlugin;

export * from './core';
