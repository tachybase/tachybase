import { Application } from '@tachybase/client';

import { tval } from '../locale';
import { LinkManager } from './LinkManager';
import { Configuration } from './TokenConfiguration';
import { WebhookManager } from './WebhookManager';

export * from './LinkManager';
export * from './TokenConfiguration';

export class PluginSettingsHelper {
  constructor(private app: Application) {}
  async load() {
    this.app.pluginSettingsManager.add('hera', {
      title: tval('Hera integration'),
      icon: 'HomeOutlined',
    });
    this.app.pluginSettingsManager.add('hera.webhook', {
      title: tval('Webhook manager'),
      icon: 'ShareAltOutlined',
      Component: WebhookManager,
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
