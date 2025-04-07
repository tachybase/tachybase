import { PROVIDER_TYPE_TENCENT } from '../constants';
import Plugin from '../plugin';
import { Provider } from './Provider';
import TencentProvider from './tencent-cloud';

interface Providers {
  [key: string]: typeof Provider;
}

/**
 * 初始化 OCR 识别提供商
 * @param plugin 插件实例
 */
export async function initProviders(plugin: Plugin, more: Providers = {}) {
  const { providers } = plugin;
  // 注册腾讯云 OCR 提供商
  plugin.providers.register(PROVIDER_TYPE_TENCENT, TencentProvider);

  for (const [name, provider] of Object.entries({ ...more })) {
    providers.register(name, provider);
  }
}
