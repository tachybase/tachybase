import { Plugin, tval } from '@tachybase/client';
import { HomePageConfiguration } from './HomePageConfiguration';
import { HomePage } from './Home';

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
    this.app.pluginSettingsManager.add('hera', {
      title: tval('Homepage config'),
      icon: 'HomeOutlined',
      Component: HomePageConfiguration,
    });
  }
}

export default PluginHomePageClient;
