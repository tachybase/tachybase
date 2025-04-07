import actions, { Context, Next } from '@tachybase/actions';

import Plugin, { namespace } from '..';

export async function recognize(context: Context, next: Next) {
  const plugin = context.app.getPlugin('otp') as Plugin;
  const { values } = context.action.params;
  const providerItem = await plugin.getDefault();
  if (!providerItem) {
    console.error(`[otp] no provider for action (${values.type}) provided`);
    return context.throw(500);
  }
  const ProviderType = plugin.providers.get(<string>providerItem.get('type'));
  const provider = new ProviderType(plugin, providerItem.get('options'));

  try {
    const result = await provider.recognize(values.image);
  } catch (error) {
    console.error(error);
    return context.throw(500);
  }

  await actions.create(context, async () => {
    const { body: result } = context;
    context.body = {
      id: result.id,
      expiresAt: result.expiresAt,
    };

    return next();
  });
}
