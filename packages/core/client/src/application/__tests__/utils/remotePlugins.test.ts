import { Plugin } from '../../Plugin';
import {
  configRequirejs,
  defineDevPlugins,
  definePluginClient,
  getPlugins,
  getRemotePlugins,
  processRemotePlugins,
} from '../../utils/remotePlugins';

describe('remotePlugins', () => {
  afterEach(() => {
    window.define = undefined;
  });

  describe('defineDevPlugins()', () => {
    it('should define plugins', () => {
      class DemoPlugin extends Plugin {}

      const plugins = {
        '@tachybase/demo': DemoPlugin,
      };

      const mockDefine: any = vi.fn();
      window.define = mockDefine;

      defineDevPlugins(plugins);

      expect(mockDefine).toBeCalledTimes(1);
      expect(mockDefine).toBeCalledWith('@tachybase/demo/client', expect.any(Function));
    });

    it('should return Plugin', () => {
      class DemoPlugin extends Plugin {}
      const plugins = {
        '@tachybase/demo': DemoPlugin,
      };
      const define: any = function (packageName: string, load: any) {
        expect(packageName).toEqual('@tachybase/demo/client');
        expect(load()).toEqual(DemoPlugin);
      };
      window.define = define;

      defineDevPlugins(plugins);
    });
  });

  describe('definePluginClient()', () => {
    it('should define plugins', () => {
      const mockDefine: any = vi.fn();
      window.define = mockDefine;

      definePluginClient('@tachybase/demo');

      expect(mockDefine).toBeCalledTimes(1);
      expect(mockDefine).toBeCalledWith('@tachybase/demo/client', ['exports', '@tachybase/demo'], expect.any(Function));
    });

    it('should proxy', () => {
      const mockDefine: any = vi.fn();
      window.define = mockDefine;

      definePluginClient('@tachybase/demo');

      const exports: any = {
        a: 'a',
      };
      const pluginExports = {
        a: 1,
        b: 2,
      };
      const proxy = mockDefine.mock.calls[0][2];
      proxy(exports, pluginExports);

      expect(exports.__esModule).toBe(true);
      expect(exports.a).toBe(1);
      expect(exports.b).toBe(2);
    });
  });

  test('should config requirejs', () => {
    const requirejs = {
      requirejs: {
        config: vi.fn(),
      },
    };
    const pluginData: any = [
      {
        packageName: '@tachybase/demo',
        url: 'https://demo.com',
      },
    ];
    configRequirejs(requirejs, pluginData);

    expect(requirejs.requirejs.config).toBeCalledTimes(1);
    expect(requirejs.requirejs.config).toBeCalledWith({
      waitSeconds: 120,
      paths: {
        '@tachybase/demo': 'https://demo.com',
      },
    });
  });

  describe('processRemotePlugins()', () => {
    it('should resolve', () => {
      const pluginData: any = [
        {
          name: '@tachybase/demo',
          packageName: '@tachybase/demo',
          url: 'https://demo.com',
        },
      ];
      const resolve = vi.fn();
      const process = processRemotePlugins(pluginData, resolve);

      const pluginModules: any = [
        {
          default: 'default',
        },
      ];
      process(...pluginModules);

      expect(resolve).toBeCalledTimes(1);
      expect(resolve).toBeCalledWith([['@tachybase/demo', 'default']]);
    });

    it('should filter', () => {
      const pluginData: any = [
        {
          name: '@tachybase/demo',
          packageName: '@tachybase/demo',
          url: 'https://demo.com',
        },
      ];
      const resolve = vi.fn();
      const process = processRemotePlugins(pluginData, resolve);

      const pluginModules: any = [null];
      process(...pluginModules);

      expect(resolve).toBeCalledTimes(1);
      expect(resolve).toBeCalledWith([]);
    });
  });

  describe('getRemotePlugins()', () => {
    it('should get remote plugins', async () => {
      const mockPluginsModules = (pluginData, resolve) => {
        resolve({ default: 'default' });
      };

      const requirejs: any = {
        requirejs: mockPluginsModules,
      };

      requirejs.requirejs.config = vi.fn();
      requirejs.requirejs.requirejs = vi.fn();
      const pluginData: any = [
        {
          name: '@tachybase/demo',
          packageName: '@tachybase/demo',
          url: 'https://demo.com',
        },
      ];
      const mockDefine: any = vi.fn();
      window.define = mockDefine;
      const plugins = await getRemotePlugins(requirejs, pluginData);
      expect(plugins).toEqual([['@tachybase/demo', 'default']]);
    });
  });

  describe('getPlugins()', () => {
    it('If there is no devDynamicImport, all plugins are obtained through API requests', async () => {
      const remoteFn = vi.fn();
      const mockPluginsModules = (pluginData, resolve) => {
        remoteFn();
        resolve({ default: 'default' }, { default: 'default' });
      };

      const requirejs: any = {
        requirejs: mockPluginsModules,
      };

      requirejs.requirejs.config = vi.fn();
      requirejs.requirejs.requirejs = vi.fn();
      const pluginData: any = [
        {
          name: '@tachybase/demo',
          packageName: '@tachybase/demo',
          url: 'https://demo1.com',
        },
        {
          name: '@tachybase/demo2',
          packageName: '@tachybase/demo2',
          url: 'https://demo2.com',
        },
      ];
      const mockDefine: any = vi.fn();
      window.define = mockDefine;

      const plugins = await getPlugins({ requirejs, pluginData });
      expect(plugins).toEqual([
        ['@tachybase/demo', 'default'],
        ['@tachybase/demo2', 'default'],
      ]);
      expect(remoteFn).toBeCalledTimes(1);
      expect(mockDefine).toBeCalledTimes(2);
      expect(requirejs.requirejs.config).toBeCalledWith({
        waitSeconds: 120,
        paths: {
          '@tachybase/demo': 'https://demo1.com',
          '@tachybase/demo2': 'https://demo2.com',
        },
      });
    });

    it('If there is devDynamicImport and devDynamicImport returns all, remote API will not be requested', async () => {
      const remoteFn = vi.fn();
      const mockPluginsModules = (pluginData, resolve) => {
        remoteFn();
        resolve({ default: 'default' }, { default: 'default' });
      };

      const requirejs: any = {
        requirejs: mockPluginsModules,
      };

      requirejs.requirejs.config = vi.fn();
      requirejs.requirejs.requirejs = vi.fn();
      const pluginData: any = [
        {
          name: '@tachybase/demo',
          packageName: '@tachybase/demo',
          url: 'https://demo1.com',
        },
        {
          name: '@tachybase/demo2',
          packageName: '@tachybase/demo2',
          url: 'https://demo2.com',
        },
      ];
      const mockDefine: any = vi.fn();
      window.define = mockDefine;

      const plugins = await getPlugins({
        requirejs,
        pluginData,
        devDynamicImport: (() => {
          return Promise.resolve({ default: 'default' });
        }) as any,
      });
      expect(plugins).toEqual([
        ['@tachybase/demo', 'default'],
        ['@tachybase/demo2', 'default'],
      ]);
      expect(remoteFn).toBeCalledTimes(0);
      expect(mockDefine).toBeCalledTimes(2);
      expect(requirejs.requirejs.config).toBeCalledTimes(0);
    });

    it('If there is devDynamicImport and devDynamicImport returns partial, remote API will be requested', async () => {
      const remoteFn = vi.fn();
      const mockPluginsModules = (pluginData, resolve) => {
        remoteFn();
        resolve({ default: 'default' });
      };

      const requirejs: any = {
        requirejs: mockPluginsModules,
      };

      requirejs.requirejs.config = vi.fn();
      requirejs.requirejs.requirejs = vi.fn();
      const pluginData: any = [
        {
          name: '@tachybase/demo',
          packageName: '@tachybase/demo',
          url: 'https://demo1.com',
        },
        {
          name: '@tachybase/demo2',
          packageName: '@tachybase/demo2',
          url: 'https://demo2.com',
        },
      ];
      const mockDefine: any = vi.fn();
      window.define = mockDefine;

      const plugins = await getPlugins({
        requirejs,
        pluginData,
        devDynamicImport: ((packageName) => {
          if (packageName === '@tachybase/demo') {
            return Promise.resolve({ default: 'default' });
          }
          return Promise.resolve(null);
        }) as any,
      });
      expect(plugins).toEqual([
        ['@tachybase/demo', 'default'],
        ['@tachybase/demo2', 'default'],
      ]);
      expect(remoteFn).toBeCalled();
      expect(mockDefine).toBeCalledTimes(2);
      expect(requirejs.requirejs.config).toBeCalledWith({
        waitSeconds: 120,
        paths: {
          '@tachybase/demo2': 'https://demo2.com',
        },
      });
    });
  });
});
