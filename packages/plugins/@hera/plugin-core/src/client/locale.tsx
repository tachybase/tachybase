import { Application, useApp, tval as nTval, i18n } from '@nocobase/client';

const NAMESPACE = '@hera/plugin-core';

export class Locale {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  lang(key: string) {
    return this.app.i18n.t(key, { ns: NAMESPACE });
  }
}

export const useTranslation = (): any => {
  const { i18n } = useApp();
  const t = (key: string, props = {}) => i18n.t(key, { ns: NAMESPACE, ...props });
  return { t };
};

export const tval = (key: string) => nTval(key, { ns: NAMESPACE });

export function lang(key: string) {
  return i18n.t(key, { ns: NAMESPACE });
}
