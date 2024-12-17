import { Plugin } from '@tachybase/client';

import { HomePage } from './Home';
import { HomePageConfiguration } from './HomePageConfiguration';
import { tval } from './locale';

export class PluginHomePageClient extends Plugin {
  async load() {
    this.app.addComponents({
      HomePage,
    });
    this.app.router.remove('root');
    this.app.router.add('home', {
      path: '/',
      Component: 'HomePage',
    });
    this.app.systemSettingsManager.add('system-services.' + 'homepage', {
      title: tval('Homepage config'),
      icon: 'HomeOutlined',
      Component: HomePageConfiguration,
    });
  }
}

export default PluginHomePageClient;
