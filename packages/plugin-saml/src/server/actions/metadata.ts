import { Context, Next } from '@tachybase/actions';

import { SAML } from '@node-saml/node-saml';

import { SAMLAuth } from '../saml-auth';

export const metadata = async (ctx: Context, next: Next) => {
  const auth = ctx.auth as SAMLAuth;
  const options = auth.getOptions();
  const saml = new SAML(options);

  ctx.type = 'text/xml';
  ctx.body = saml.generateServiceProviderMetadata(options.cert as string);
  ctx.withoutDataWrapping = true;

  return next();
};
