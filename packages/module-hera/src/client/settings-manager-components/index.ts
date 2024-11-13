import { Application } from '@tachybase/client';

import { tval } from '../locale';
import { LinkManager } from './LinkManager';
import { Configuration } from './TokenConfiguration';

export * from './LinkManager';
export * from './TokenConfiguration';

export class PluginSettingsHelper {
  constructor(private app: Application) {}
  async load() {
    this.app.systemSettingsManager.add('hera', {
      title: tval('Hera integration'),
      icon: 'HomeOutlined',
    });
    this.app.systemSettingsManager.add('hera.token', {
      title: tval('Third-party integration configuration'),
      icon: 'ShareAltOutlined',
      Component: Configuration,
    });
    this.app.systemSettingsManager.add('hera.linkmanage', {
      title: tval('Link manager'),
      icon: 'ShareAltOutlined',
      Component: LinkManager,
    });
  }
}