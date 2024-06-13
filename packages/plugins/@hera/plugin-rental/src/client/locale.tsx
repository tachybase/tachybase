import { Application, tval as nTval, useApp } from '@tachybase/client';

const NAMESPACE = '@hera/plugin-rental';

export class Locale {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  lang(key: string) {
    return this.app.i18n.t(key, { ns: NAMESPACE });
  }
}

export const useTranslation = () => {
  const { i18n } = useApp();
  const t = (key: string, props = {}) => i18n.t(key, { ns: NAMESPACE, ...props });
  return { t };
};

export const tval = (key: string) => nTval(key, { ns: NAMESPACE });
