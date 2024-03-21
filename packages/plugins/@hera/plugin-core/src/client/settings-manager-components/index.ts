import { Application } from '@nocobase/client';
import { lang } from '../locale';
import { Configuration } from './TokenConfiguration';
import { HomePageConfiguration } from './HomePageConfiguration';
import { LinkManager } from './LinkManager';

export * from './HomePageConfiguration';
export * from './LinkManager';
export * from './TokenConfiguration';

export class PluginSettingsHelper {
  constructor(private app: Application) {}
  async load() {
    this.app.pluginSettingsManager.add('home_page', {
      title: lang('HomePage Config'),
      icon: 'HomeOutlined',
      Component: HomePageConfiguration,
    });
    this.app.pluginSettingsManager.add('token', {
      title: lang('Third-party integration configuration'),
      icon: 'ShareAltOutlined',
      Component: Configuration,
    });
    this.app.pluginSettingsManager.add('linkmanage', {
      title: lang('Link manager'),
      icon: 'ShareAltOutlined',
      Component: LinkManager,
    });
  }
}
