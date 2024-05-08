import { usePlugin } from '@tachybase/client';
import { PluginFieldMarkdownVditorClient } from '../';

export const useCDN = () => {
  const plugin = usePlugin(PluginFieldMarkdownVditorClient);
  return plugin.getCDN();
};
