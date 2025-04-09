import actions, { Context, Next } from '@tachybase/actions';

import { PluginOcrConvert } from '../plugin';

export async function recognize(context: Context, next: Next) {
  const plugin = context.app.getPlugin(PluginOcrConvert) as PluginOcrConvert;
  const { values } = context.action.params;
  const providerItem = await plugin.getDefault();
  if (!providerItem) {
    console.error(`[ocr-convert] no provider for action (${values.type}) provided`);
    return context.throw(500, 'no provider for action provided');
  }
  const ProviderType = plugin.providers.get(<string>providerItem.get('type'));
  const provider = new ProviderType(plugin, providerItem.get('options'));

  const result = await provider.recognize(context, values.image, values.type);
  context.body = result;
}
