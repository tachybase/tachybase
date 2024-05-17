import { Application } from '@tachybase/client';
import { tval } from '../locale';
import { Configuration } from './TokenConfiguration';
import { LinkManager } from './LinkManager';
import { Features } from './Features';

export * from './LinkManager';
export * from './TokenConfiguration';

export class PluginSettingsHelper {
  constructor(private app: Application) {}
  async load() {
    this.app.pluginSettingsManager.add('hera', {
      title: tval('Hera integration'),
      icon: 'HomeOutlined',
    });
    this.app.pluginSettingsManager.add('hera.features', {
      title: tval('Hera features'),
      icon: 'ApiOutlined',
      Component: Features,
    });
    this.app.pluginSettingsManager.add('hera.token', {
      title: tval('Third-party integration configuration'),
      icon: 'ShareAltOutlined',
      Component: Configuration,
    });
    this.app.pluginSettingsManager.add('hera.linkmanage', {
      title: tval('Link manager'),
      icon: 'ShareAltOutlined',
      Component: LinkManager,
    });
  }
}
