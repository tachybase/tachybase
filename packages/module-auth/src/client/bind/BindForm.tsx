import React, { createElement } from 'react';
import { usePlugin, useRecord } from '@tachybase/client';

import AuthPlugin, { AuthOptions } from '..';
import { Authenticator } from '../authenticator';

const useBindForms = (): {
  [authType: string]: AuthOptions['components']['BindForm'];
} => {
  const plugin = usePlugin(AuthPlugin);
  const authTypes = plugin.authTypes.getEntities();
  const bindForms = {};
  for (const [authType, options] of authTypes) {
    if (options.components?.BindForm) {
      bindForms[authType] = options.components.BindForm;
    }
  }
  return bindForms;
};

export const BindForm = () => {
  const authenticator = useRecord();
  const bindForms = useBindForms();
  const C = bindForms[authenticator.authType];
  return createElement<{
    authenticator: Authenticator;
  }>(C, { authenticator });
};
