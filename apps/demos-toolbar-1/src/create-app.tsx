import { Application, ApplicationOptions, Plugin } from '@tachybase/client';

class PluginHome extends Plugin {
  async load() {
    this.router.add('home', {
      path: '/',
      Component: 'HomePage',
    });
  }
}

export function createApp(options: ApplicationOptions = {}) {
  const { plugins = [], ...others } = options;
  return new Application({
    router: {
      type: 'memory',
      initialEntries: ['/'],
    },
    designable: true,
    ...others,
    plugins: [PluginHome, ...plugins],
  });
}
